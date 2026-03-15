require('dotenv').config();

const fs = require('fs');
const path = require('path');
const prisma = require('../src/config/prisma');

function readJobsFile() {
  const filePath = process.env.LINKEDIN_JOBS_FILE;
  if (!filePath) {
    throw new Error('LINKEDIN_JOBS_FILE is not configured');
  }

  const resolved = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`LinkedIn jobs file not found: ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf8');
  const jobs = JSON.parse(raw);

  if (!Array.isArray(jobs)) {
    throw new Error('LinkedIn jobs file must be a JSON array');
  }

  return jobs;
}

function mapJob(rawJob) {
  const companyName = rawJob.companyName || rawJob.company || 'Unknown Company';
  const role = rawJob.role || rawJob.title || 'Software Engineer';
  const packageLpa = Number(rawJob.packageLpa || rawJob.ctcLpa || 6);
  const location = rawJob.location || 'India';
  const eligibilityCriteria = rawJob.eligibilityCriteria || rawJob.rulesAndResponsibilities || 'As per company policy';
  const jobDescription = rawJob.jobDescription || rawJob.description || 'Refer company job details';
  const status = rawJob.status === 'CLOSED' ? 'CLOSED' : 'ACTIVE';

  return {
    companyName,
    role,
    packageLpa,
    location,
    eligibilityCriteria,
    jobDescription,
    status,
  };
}

async function upsertJob(job) {
  const existing = await prisma.jobPosting.findFirst({
    where: {
      companyName: job.companyName,
      role: job.role,
      location: job.location,
    },
  });

  if (existing) {
    return prisma.jobPosting.update({
      where: { id: existing.id },
      data: {
        packageLpa: job.packageLpa,
        eligibilityCriteria: job.eligibilityCriteria,
        jobDescription: job.jobDescription,
        status: job.status,
      },
    });
  }

  return prisma.jobPosting.create({ data: job });
}

async function main() {
  const jobsRaw = readJobsFile();
  let createdOrUpdated = 0;

  for (const rawJob of jobsRaw) {
    const mapped = mapJob(rawJob);
    await upsertJob(mapped);
    createdOrUpdated += 1;
  }

  console.log(`✅ LinkedIn jobs sync complete. Processed ${createdOrUpdated} records.`);
}

main()
  .catch((error) => {
    console.error('❌ LinkedIn jobs sync failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
