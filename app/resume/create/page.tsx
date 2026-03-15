'use client';

import { useMemo, useState } from 'react';

type StepKey = 'personal' | 'education' | 'experience' | 'skills';

type EducationItem = {
  institute: string;
  degree: string;
  year: string;
};

type ExperienceItem = {
  company: string;
  role: string;
  duration: string;
  highlights: string;
};

type ResumeState = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    summary: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string;
};

const steps: { key: StepKey; label: string }[] = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
];

const initialState: ResumeState = {
  personal: {
    fullName: 'Your Name',
    email: 'you@example.com',
    phone: '+91 99999 99999',
    city: 'Bengaluru',
    summary: 'Aspiring software engineer with strong foundations in web development and data structures.',
  },
  education: [{ institute: 'ABC Institute of Technology', degree: 'B.E. in Computer Science', year: '2025' }],
  experience: [
    {
      company: 'Internship Company',
      role: 'Software Intern',
      duration: 'Jan 2024 - Jun 2024',
      highlights: 'Built reusable React components and collaborated with backend team to integrate REST APIs.',
    },
  ],
  skills: 'JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Prisma',
};

function A4Preview({ state }: { state: ResumeState }) {
  const skillsList = useMemo(
    () => state.skills.split(',').map((s) => s.trim()).filter(Boolean),
    [state.skills]
  );

  return (
    <div className="h-full overflow-auto rounded-2xl border border-gray-200 bg-gray-100 p-4">
      <div className="mx-auto min-h-[920px] w-full max-w-[680px] bg-white p-8 shadow-lg">
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-black">{state.personal.fullName || 'Your Name'}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {state.personal.email || 'email@example.com'} • {state.personal.phone || '+91 ...'} • {state.personal.city || 'City'}
          </p>
        </header>

        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Professional Summary</h2>
          <p className="mt-2 text-sm leading-6 text-gray-800">{state.personal.summary}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Education</h2>
          <div className="mt-2 space-y-3">
            {state.education.map((edu, idx) => (
              <article key={`edu-${idx}`} className="rounded-lg border border-gray-100 p-3">
                <p className="font-semibold text-black">{edu.degree || 'Degree'}</p>
                <p className="text-sm text-gray-700">{edu.institute || 'Institute'}</p>
                <p className="text-xs text-gray-500">{edu.year || 'Year'}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Experience</h2>
          <div className="mt-2 space-y-3">
            {state.experience.map((exp, idx) => (
              <article key={`exp-${idx}`} className="rounded-lg border border-gray-100 p-3">
                <p className="font-semibold text-black">{exp.role || 'Role'} • {exp.company || 'Company'}</p>
                <p className="text-xs text-gray-500">{exp.duration || 'Duration'}</p>
                <p className="mt-1 text-sm leading-6 text-gray-700">{exp.highlights || 'Highlights'}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {skillsList.map((skill, idx) => (
              <span key={`${skill}-${idx}`} className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-black">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ResumeCreatePage() {
  const [state, setState] = useState<ResumeState>(initialState);
  const [currentStep, setCurrentStep] = useState<StepKey>('personal');

  function updateEducation(index: number, key: keyof EducationItem, value: string) {
    setState((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, education: next };
    });
  }

  function updateExperience(index: number, key: keyof ExperienceItem, value: string) {
    setState((prev) => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, experience: next };
    });
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-black">Resume Generator</h1>
        <p className="mt-1 text-sm text-gray-600">Fill in your details on the left and see a real-time PDF-style resume preview on the right.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-10">
        <section className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            {steps.map((step) => (
              <button
                key={step.key}
                type="button"
                onClick={() => setCurrentStep(step.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentStep === step.key ? 'bg-black text-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {currentStep === 'personal' && (
            <div className="space-y-3">
              <Input label="Full Name" value={state.personal.fullName} onChange={(v) => setState((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} />
              <Input label="Email" value={state.personal.email} onChange={(v) => setState((p) => ({ ...p, personal: { ...p.personal, email: v } }))} />
              <Input label="Phone" value={state.personal.phone} onChange={(v) => setState((p) => ({ ...p, personal: { ...p.personal, phone: v } }))} />
              <Input label="City" value={state.personal.city} onChange={(v) => setState((p) => ({ ...p, personal: { ...p.personal, city: v } }))} />
              <TextArea label="Summary" rows={5} value={state.personal.summary} onChange={(v) => setState((p) => ({ ...p, personal: { ...p.personal, summary: v } }))} />
            </div>
          )}

          {currentStep === 'education' && (
            <div className="space-y-3">
              {state.education.map((edu, idx) => (
                <div key={`edu-form-${idx}`} className="rounded-xl border border-gray-200 p-3">
                  <Input label="Institute" value={edu.institute} onChange={(v) => updateEducation(idx, 'institute', v)} />
                  <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(idx, 'degree', v)} />
                  <Input label="Year" value={edu.year} onChange={(v) => updateEducation(idx, 'year', v)} />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setState((p) => ({ ...p, education: [...p.education, { institute: '', degree: '', year: '' }] }))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                + Add Education
              </button>
            </div>
          )}

          {currentStep === 'experience' && (
            <div className="space-y-3">
              {state.experience.map((exp, idx) => (
                <div key={`exp-form-${idx}`} className="rounded-xl border border-gray-200 p-3">
                  <Input label="Company" value={exp.company} onChange={(v) => updateExperience(idx, 'company', v)} />
                  <Input label="Role" value={exp.role} onChange={(v) => updateExperience(idx, 'role', v)} />
                  <Input label="Duration" value={exp.duration} onChange={(v) => updateExperience(idx, 'duration', v)} />
                  <TextArea label="Highlights" rows={4} value={exp.highlights} onChange={(v) => updateExperience(idx, 'highlights', v)} />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    experience: [...p.experience, { company: '', role: '', duration: '', highlights: '' }],
                  }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                + Add Experience
              </button>
            </div>
          )}

          {currentStep === 'skills' && (
            <div className="space-y-3">
              <TextArea
                label="Skills (comma separated)"
                rows={8}
                value={state.skills}
                onChange={(v) => setState((p) => ({ ...p, skills: v }))}
              />
            </div>
          )}
        </section>

        <section className="lg:col-span-5">
          <A4Preview state={state} />
        </section>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-yellow-400 focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-yellow-400 focus:outline-none"
      />
    </label>
  );
}
