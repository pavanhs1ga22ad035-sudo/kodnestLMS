import Link from 'next/link';

const highlights = [
  { title: 'Career-Focused Learning', desc: 'Structured paths from fundamentals to interview readiness.' },
  { title: 'Live Mentorship', desc: 'Daily mentor touchpoints, coding reviews, and doubt-clearing sessions.' },
  { title: 'Placement Pipeline', desc: 'Track opportunities, eligibility, and applications from one dashboard.' },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-gray-200 bg-gradient-to-r from-white via-yellow-50 to-gray-50 p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-700">KodNest LMS</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Learn. Build. Get Placed.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700">
          A complete EdTech workspace for students: self-paced courses, live classes, compiler practice, interview prep,
          and placement support — all in one unified platform.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/home" className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-yellow-300 hover:bg-gray-900">
            Go to Dashboard
          </Link>
          <Link href="/courses" className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
            Explore Courses
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-black">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
