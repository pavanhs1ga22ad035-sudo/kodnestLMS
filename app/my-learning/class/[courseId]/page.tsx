'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Topic = { id: string; title: string; videoUrl: string; durationMins: number; orderIndex: number };
type ModuleItem = { id: string; title: string; orderIndex: number; topics: Topic[] };
type PlayerData = {
  course: { id: string; title: string; description: string; type: string };
  modules: ModuleItem[];
  activeTopic: Topic | null;
};

const fallbackData: PlayerData = {
  course: {
    id: 'demo',
    title: 'Full Stack Web Development',
    description: 'Learn React, Next.js, APIs, and deployment workflows.',
    type: 'SKILL',
  },
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Frontend Foundations',
      orderIndex: 1,
      topics: [
        { id: 't1', title: 'Intro to Next.js', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', durationMins: 18, orderIndex: 1 },
        { id: 't2', title: 'Layouts and Routing', videoUrl: 'https://www.w3schools.com/html/movie.mp4', durationMins: 24, orderIndex: 2 },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2: Backend APIs',
      orderIndex: 2,
      topics: [
        { id: 't3', title: 'Express Architecture', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', durationMins: 22, orderIndex: 1 },
      ],
    },
  ],
  activeTopic: { id: 't1', title: 'Intro to Next.js', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', durationMins: 18, orderIndex: 1 },
};

export default function CoursePlayerPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId || '';
  const [data, setData] = useState<PlayerData>(fallbackData);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(fallbackData.activeTopic);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({ [fallbackData.modules[0].id]: true });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    async function loadCoursePlayer() {
      try {
        const response = await fetch(`/api/courses/${courseId}/player`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) throw new Error('Failed to fetch course player data');
        const json = await response.json();
        if (json?.data) {
          setData(json.data);
          setActiveTopic(json.data.activeTopic);
          const firstModule = json.data.modules?.[0];
          if (firstModule?.id) setOpenModules({ [firstModule.id]: true });
        }
      } catch (_e) {
        setData(fallbackData);
        setActiveTopic(fallbackData.activeTopic);
      }
    }

    if (courseId) loadCoursePlayer();
  }, [courseId]);

  const allTopicsCount = useMemo(() => data.modules.reduce((acc, moduleItem) => acc + moduleItem.topics.length, 0), [data.modules]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-black">{data.course.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{data.course.description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-10">
        <section className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
            <video key={activeTopic?.id || 'video-fallback'} controls className="h-[480px] w-full bg-black" src={activeTopic?.videoUrl || ''}>
              Your browser does not support HTML video.
            </video>
          </div>
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">Now Playing</p>
            <h2 className="mt-1 text-lg font-semibold text-black">{activeTopic?.title || 'Select a topic'}</h2>
            <p className="mt-1 text-sm text-gray-600">Duration: {activeTopic?.durationMins || 0} mins</p>
          </div>
        </section>

        <aside className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="text-base font-semibold text-black">Course Content</h3>
            <p className="text-xs text-gray-500">{data.modules.length} modules · {allTopicsCount} topics</p>
          </div>

          <div className="max-h-[620px] overflow-y-auto p-3">
            {data.modules.map((moduleItem) => {
              const isOpen = Boolean(openModules[moduleItem.id]);
              return (
                <div key={moduleItem.id} className="mb-3 overflow-hidden rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpenModules((prev) => ({ ...prev, [moduleItem.id]: !prev[moduleItem.id] }))}
                    className="flex w-full items-center justify-between bg-gray-50 px-3 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-black">{moduleItem.title}</span>
                    <span className="text-xs text-gray-500">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <ul className="divide-y divide-gray-100 bg-white">
                      {moduleItem.topics.map((topic) => (
                        <li key={topic.id}>
                          <button
                            type="button"
                            onClick={() => setActiveTopic(topic)}
                            className={`w-full px-3 py-2.5 text-left text-sm transition ${
                              activeTopic?.id === topic.id ? 'bg-yellow-50 text-black' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span>{topic.title}</span>
                              <span className="whitespace-nowrap text-xs text-gray-500">{topic.durationMins}m</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
