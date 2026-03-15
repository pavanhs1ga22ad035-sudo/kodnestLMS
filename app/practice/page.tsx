const buckets = [
  { title: 'DSA Sheets', count: '180 Problems', tag: 'Coding' },
  { title: 'Aptitude Drills', count: '120 Quizzes', tag: 'Assessment' },
  { title: 'Mock Interviews', count: '35 Scenarios', tag: 'Interview' },
];

export default function PracticePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-black">Practice Hub</h1>
        <p className="mt-2 text-gray-600">Daily challenges and assessments tailored to your placement goals.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {buckets.map((bucket) => (
          <article key={bucket.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">{bucket.tag}</p>
            <h2 className="mt-2 text-xl font-semibold text-black">{bucket.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{bucket.count}</p>
            <button type="button" className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
              Start Practice
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
