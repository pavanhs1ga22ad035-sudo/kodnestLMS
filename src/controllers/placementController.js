const prisma = require('../config/prisma');

async function getAvailableJobs(_req, res) {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        role: true,
        packageLpa: true,
        location: true,
        eligibilityCriteria: true,
        jobDescription: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: jobs.map((job) => ({
        ...job,
        packageLabel: `${job.packageLpa.toString()} LPA`,
        rulesAndResponsibilities: job.eligibilityCriteria,
      })),
    });
  } catch (error) {
    console.error('Job board fetch error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch job postings' });
  }
}

async function applyToJob(req, res) {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const jobPosting = await prisma.jobPosting.findUnique({ where: { id: jobId } });
    if (!jobPosting || jobPosting.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Job is unavailable' });
    }

    const application = await prisma.jobApplication.upsert({
      where: {
        userId_jobPostingId: {
          userId,
          jobPostingId: jobId,
        },
      },
      update: {
        status: 'APPLIED',
      },
      create: {
        userId,
        jobPostingId: jobId,
        status: 'APPLIED',
      },
      include: {
        jobPosting: {
          select: {
            companyName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Application submitted for ${application.jobPosting.role} at ${application.jobPosting.companyName}`,
      data: {
        id: application.id,
        status: application.status,
        jobPostingId: application.jobPostingId,
      },
    });
  } catch (error) {
    console.error('Job apply error:', error);
    return res.status(500).json({ success: false, message: 'Unable to apply for this job' });
  }
}

module.exports = {
  getAvailableJobs,
  applyToJob,
};
