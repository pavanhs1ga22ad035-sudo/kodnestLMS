const tracks = [
  {
    title: 'Full Stack Web Development',
    level: 'Intermediate',
    duration: '16 Weeks',
    modules: '42 Topics',
    badge: 'Most Enrolled',
  },
  {
    title: 'Data Structures & Algorithms',
    level: 'Beginner → Advanced',
    duration: '12 Weeks',
    modules: '65 Topics',
    badge: 'Interview Core',
  },
  {
    title: 'System Design Fundamentals',
    level: 'Advanced',
    duration: '8 Weeks',
    modules: '28 Topics',
    badge: 'High Impact',
  },
];

export default function CoursesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Course Catalog</h1>
        <p className="mt-2 text-gray-600">Pick a learning path and continue from where you left off.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tracks.map((course) => (
          <article key={course.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-black">{course.badge}</span>
            <h2 className="mt-3 text-xl font-semibold text-black">{course.title}</h2>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>Level: {course.level}</p>
              <p>Duration: {course.duration}</p>
              <p>Coverage: {course.modules}</p>
            </div>
            <button type="button" className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-gray-900">
              View Curriculum
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
