const suggestions = [
  'Explain recursion with real examples',
  'Create my 4-week DSA revision plan',
  'Prepare me for HR interview questions',
];

export default function BrokodPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-black">BroKod AI Assistant</h1>
        <p className="mt-2 text-gray-600">Ask coding doubts, get study plans, and prepare for interviews with contextual help.</p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Try asking:</p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((q) => (
              <li key={q} className="rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
