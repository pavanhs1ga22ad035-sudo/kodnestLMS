'use client';

import { useEffect, useState } from 'react';

type Job = {
  id: string;
  companyName: string;
  role: string;
  packageLabel: string;
  location: string;
  jobDescription: string;
  rulesAndResponsibilities: string;
};

const fallbackJobs: Job[] = [
  {
    id: 'j1',
    companyName: 'Infosys',
    role: 'Software Engineer',
    packageLabel: '9.5 LPA',
    location: 'Bengaluru',
    jobDescription: 'Build and maintain scalable web products in agile teams.',
    rulesAndResponsibilities: 'Strong DSA, OOPs, communication, and coding round readiness.',
  },
  {
    id: 'j2',
    companyName: 'Accenture',
    role: 'Associate Developer',
    packageLabel: '7.2 LPA',
    location: 'Hyderabad',
    jobDescription: 'Develop backend services and support cloud-native deployments.',
    rulesAndResponsibilities: 'Problem solving, DB basics, and teamwork in delivery pods.',
  },
];

export default function PlacementsPage() {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/placements/jobs');
        if (!response.ok) throw new Error('Failed to load jobs');
        const json = await response.json();
        if (json?.data?.length) {
          setJobs(json.data);
        }
      } catch (_e) {
        setJobs(fallbackJobs);
      }
    }

    fetchJobs();
  }, []);

  async function handleApplyNow(jobId: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const response = await fetch(`/api/placements/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'Failed to apply');
      setApplyMessage(json.message || 'Application submitted successfully');
    } catch (error) {
      setApplyMessage(error instanceof Error ? error.message : 'Unable to apply now');
    }
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-black">Placements Job Board</h1>
      <p className="mt-2 text-gray-600">Explore active opportunities and apply instantly.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <button
            key={job.id}
            type="button"
            onClick={() => {
              setSelectedJob(job);
              setApplyMessage('');
            }}
            className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-yellow-400"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">{job.companyName}</p>
            <h2 className="mt-2 text-lg font-semibold text-black">{job.role}</h2>
            <p className="mt-1 text-sm text-gray-600">{job.location}</p>
            <span className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-black">{job.packageLabel}</span>
          </button>
        ))}
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition ${selectedJob ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setSelectedJob(null)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ${
          selectedJob ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedJob && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">{selectedJob.companyName}</p>
                <h3 className="mt-1 text-xl font-bold text-black">{selectedJob.role}</h3>
                <p className="mt-1 text-sm text-gray-600">{selectedJob.location}</p>
              </div>
              <button type="button" onClick={() => setSelectedJob(null)} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">✕</button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-black">Package</h4>
                <p className="mt-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-black">{selectedJob.packageLabel}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-black">Job Description</h4>
                <p className="mt-2 text-sm leading-6 text-gray-700">{selectedJob.jobDescription}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-black">Rules & Responsibilities</h4>
                <p className="mt-2 text-sm leading-6 text-gray-700">{selectedJob.rulesAndResponsibilities}</p>
              </div>

              {applyMessage && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{applyMessage}</p>}
            </div>

            <div className="border-t border-gray-200 p-5">
              <button
                type="button"
                onClick={() => handleApplyNow(selectedJob.id)}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-yellow-300 hover:bg-gray-900"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
