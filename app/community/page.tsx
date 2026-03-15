const channels = [
  { name: 'Frontend Circle', members: '1,240 learners', status: 'Active now' },
  { name: 'Placement Prep Squad', members: '890 learners', status: 'New threads today' },
  { name: 'Mock Interview Room', members: '430 learners', status: 'Mentor online' },
];

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Community</h1>
        <p className="mt-2 text-gray-600">Collaborate with peers, post doubts, and learn with mentor guidance.</p>
      </header>

      <div className="space-y-3">
        {channels.map((channel) => (
          <article key={channel.name} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-black">{channel.name}</h2>
              <p className="text-sm text-gray-600">{channel.members}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-yellow-700">{channel.status}</p>
              <button type="button" className="mt-2 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-gray-900">
                Join
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
