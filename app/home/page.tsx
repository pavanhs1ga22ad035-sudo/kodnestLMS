'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Session = {
  id: string;
  title: string;
  mentor: string;
  startsAt: string;
  topic: string;
};

type Course = {
  enrollmentId: string;
  courseId: string;
  title: string;
  description: string;
  type: 'ACADEMIC' | 'SKILL';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  completedTopics: number;
  totalTopics: number;
};

type Placement = {
  id: string;
  studentName: string;
  studentPhotoUrl: string;
  companyName: string;
  companyLogoUrl: string;
  role: string;
  packageLpa: string;
  location: string;
};

type DashboardPayload = {
  user: { id: string; name: string; email: string };
  hero: { title: string; subtitle: string; ctaLabel: string; ctaHref: string };
  liveSessions: Session[];
  enrolledCourses: Course[];
  placementAchievements: Placement[];
};

const fallbackData: DashboardPayload = {
  user: { id: 'demo', name: 'Learner', email: 'learner@kodnest.com' },
  hero: {
    title: 'Welcome back, Learner 👋',
    subtitle: 'Continue your coding journey, join live sessions, and accelerate your placement prep.',
    ctaLabel: 'Chat with BroKod',
    ctaHref: '/brokod',
  },
  liveSessions: [
    { id: '1', title: 'DSA Power Hour', mentor: 'Priya Nair', startsAt: 'Today, 07:00 PM', topic: 'Binary Search' },
    { id: '2', title: 'System Design Essentials', mentor: 'Arjun Rao', startsAt: 'Tomorrow, 08:00 PM', topic: 'API Scalability' },
    { id: '3', title: 'Aptitude Sprint', mentor: 'Rahul Menon', startsAt: 'Sat, 10:00 AM', topic: 'Logical Reasoning' },
  ],
  enrolledCourses: [
    {
      enrollmentId: 'e1',
      courseId: 'c1',
      title: 'Full Stack Web Development',
      description: 'Master Next.js, APIs, and deployment workflows.',
      type: 'SKILL',
      status: 'IN_PROGRESS',
      progressPercent: 64,
      completedTopics: 16,
      totalTopics: 25,
    },
    {
      enrollmentId: 'e2',
      courseId: 'c2',
      title: 'Data Structures & Algorithms',
      description: 'Interview-focused problem solving track.',
      type: 'ACADEMIC',
      status: 'IN_PROGRESS',
      progressPercent: 42,
      completedTopics: 9,
      totalTopics: 21,
    },
  ],
  placementAchievements: [
    {
      id: 'p1',
      studentName: 'Ananya R',
      studentPhotoUrl: 'https://i.pravatar.cc/120?u=ananya',
      companyName: 'Infosys',
      companyLogoUrl: 'https://logo.clearbit.com/infosys.com',
      role: 'Software Engineer',
      packageLpa: '9.5 LPA',
      location: 'Bengaluru',
    },
    {
      id: 'p2',
      studentName: 'Karthik S',
      studentPhotoUrl: 'https://i.pravatar.cc/120?u=karthik',
      companyName: 'Accenture',
      companyLogoUrl: 'https://logo.clearbit.com/accenture.com',
      role: 'Associate Developer',
      packageLpa: '7.2 LPA',
      location: 'Hyderabad',
    },
  ],
};

export default function HomeDashboardPage() {
  const [data, setData] = useState<DashboardPayload>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard/home', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          throw new Error('Failed to load dashboard');
        }

        const json = await res.json();
        if (json?.data) {
          setData(json.data);
        }
      } catch (_error) {
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const greetingName = useMemo(() => data.user.name.split(' ')[0], [data.user.name]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-white via-yellow-50 to-gray-50 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">KodNest Dashboard</p>
        <h1 className="mt-3 text-3xl font-extrabold text-black sm:text-4xl">{loading ? 'Loading...' : data.hero.title}</h1>
        <p className="mt-3 max-w-2xl text-gray-700">{data.hero.subtitle}</p>
        <div className="mt-6">
          <Link
            href={data.hero.ctaHref}
            className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-yellow-300 shadow hover:bg-gray-900"
          >
            {data.hero.ctaLabel}
          </Link>
          <span className="ml-4 text-sm text-gray-600">Let&apos;s crack your next milestone, {greetingName}.</span>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Live Sessions</h2>
          <span className="text-sm text-gray-500">Swipe to explore</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {data.liveSessions.map((session) => (
            <article
              key={session.id}
              className="min-w-[280px] flex-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-600">{session.startsAt}</p>
              <h3 className="mt-2 text-lg font-semibold text-black">{session.title}</h3>
              <p className="mt-1 text-sm text-gray-700">Topic: {session.topic}</p>
              <p className="mt-3 text-sm text-gray-500">Mentor: {session.mentor}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-black">Self-Paced Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.enrolledCourses.map((course) => (
            <article key={course.enrollmentId} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{course.type}</span>
                <span className="text-xs font-semibold text-yellow-700">{course.progressPercent}%</span>
              </div>
              <h3 className="text-lg font-semibold text-black">{course.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{course.description}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-yellow-400" style={{ width: `${course.progressPercent}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {course.completedTopics}/{course.totalTopics} topics completed
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-black">Placement Achievements</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.placementAchievements.map((achievement) => (
            <article key={achievement.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <img
                  src={achievement.studentPhotoUrl}
                  alt={`${achievement.studentName} photo`}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <img
                  src={achievement.companyLogoUrl}
                  alt={`${achievement.companyName} logo`}
                  className="h-8 w-24 object-contain"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">{achievement.studentName}</h3>
              <p className="text-sm text-gray-600">{achievement.role}</p>
              <div className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-black">
                {achievement.packageLpa}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {achievement.companyName} · {achievement.location}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
