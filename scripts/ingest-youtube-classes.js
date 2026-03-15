require('dotenv').config();

const prisma = require('../src/config/prisma');

async function fetchPlaylistItems({ apiKey, playlistId }) {
  let pageToken = '';
  const items = [];

  while (true) {
    const qs = new URLSearchParams({
      part: 'snippet,contentDetails',
      maxResults: '50',
      playlistId,
      key: apiKey,
    });

    if (pageToken) {
      qs.set('pageToken', pageToken);
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${qs.toString()}`);
    if (!response.ok) {
      throw new Error(`YouTube API request failed (${response.status}) for playlist ${playlistId}`);
    }

    const json = await response.json();
    const chunk = json.items || [];
    items.push(...chunk);

    if (!json.nextPageToken) {
      break;
    }

    pageToken = json.nextPageToken;
  }

  return items;
}

function parsePlaylistConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const raw = process.env.YOUTUBE_PLAYLISTS;
  if (!raw) {
    throw new Error('YOUTUBE_PLAYLISTS is not configured');
  }

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('YOUTUBE_PLAYLISTS must be a non-empty JSON array');
  }

  return { apiKey, playlists: parsed };
}

async function syncCourseFromPlaylist(apiKey, config) {
  const course = await prisma.course.upsert({
    where: { id: config.courseId || `yt-${config.playlistId}` },
    update: {
      title: config.courseTitle,
      description: config.courseDescription || `Imported from YouTube playlist ${config.playlistId}`,
      type: config.courseType === 'ACADEMIC' ? 'ACADEMIC' : 'SKILL',
    },
    create: {
      id: config.courseId || `yt-${config.playlistId}`,
      title: config.courseTitle,
      description: config.courseDescription || `Imported from YouTube playlist ${config.playlistId}`,
      type: config.courseType === 'ACADEMIC' ? 'ACADEMIC' : 'SKILL',
    },
  });

  const moduleRecord = await prisma.module.upsert({
    where: { id: config.moduleId || `yt-module-${config.playlistId}` },
    update: {
      title: config.moduleTitle || 'YouTube Classes',
      orderIndex: 1,
      courseId: course.id,
    },
    create: {
      id: config.moduleId || `yt-module-${config.playlistId}`,
      title: config.moduleTitle || 'YouTube Classes',
      orderIndex: 1,
      courseId: course.id,
    },
  });

  const playlistItems = await fetchPlaylistItems({ apiKey, playlistId: config.playlistId });

  let index = 1;
  for (const item of playlistItems) {
    const videoId = item?.contentDetails?.videoId;
    const title = item?.snippet?.title || `Class ${index}`;

    if (!videoId || title === 'Private video' || title === 'Deleted video') {
      continue;
    }

    const topicId = `yt-topic-${config.playlistId}-${videoId}`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    await prisma.topic.upsert({
      where: { id: topicId },
      update: {
        title,
        videoUrl,
        durationMins: Number(config.defaultDurationMins || 15),
        orderIndex: index,
        moduleId: moduleRecord.id,
      },
      create: {
        id: topicId,
        title,
        videoUrl,
        durationMins: Number(config.defaultDurationMins || 15),
        orderIndex: index,
        moduleId: moduleRecord.id,
      },
    });

    index += 1;
  }

  return { courseTitle: course.title, topicCount: index - 1 };
}

async function main() {
  const { apiKey, playlists } = parsePlaylistConfig();
  let totalTopics = 0;

  for (const playlistConfig of playlists) {
    const result = await syncCourseFromPlaylist(apiKey, playlistConfig);
    totalTopics += result.topicCount;
    console.log(`✅ Synced ${result.topicCount} classes for ${result.courseTitle}`);
  }

  console.log(`✅ YouTube classes sync complete. Total topics synced: ${totalTopics}`);
}

main()
  .catch((error) => {
    console.error('❌ YouTube classes sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
