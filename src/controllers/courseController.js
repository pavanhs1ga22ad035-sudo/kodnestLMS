const prisma = require('../config/prisma');

async function getCoursePlayerData(req, res) {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            topics: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const firstTopic = course.modules.flatMap((m) => m.topics)[0] || null;

    return res.status(200).json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          type: course.type,
        },
        modules: course.modules.map((moduleItem) => ({
          id: moduleItem.id,
          title: moduleItem.title,
          orderIndex: moduleItem.orderIndex,
          topics: moduleItem.topics.map((topic) => ({
            id: topic.id,
            title: topic.title,
            videoUrl: topic.videoUrl,
            durationMins: topic.durationMins,
            orderIndex: topic.orderIndex,
          })),
        })),
        activeTopic: firstTopic
          ? {
              id: firstTopic.id,
              title: firstTopic.title,
              videoUrl: firstTopic.videoUrl,
              durationMins: firstTopic.durationMins,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Course player fetch error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch course player data' });
  }
}

module.exports = {
  getCoursePlayerData,
};
