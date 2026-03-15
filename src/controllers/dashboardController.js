const prisma = require('../config/prisma');

function formatCourseProgress(enrollment) {
  const topics = enrollment.course?.modules?.flatMap((moduleItem) => moduleItem.topics || []) || [];
  const totalTopics = topics.length;

  if (totalTopics === 0) {
    return {
      progressPercent: 0,
      completedTopics: 0,
      totalTopics: 0,
    };
  }

  const topicIds = topics.map((topic) => topic.id);
  const completedTopicCount = enrollment.user.topicProgress.filter(
    (progress) => topicIds.includes(progress.topicId) && progress.status === 'COMPLETED'
  ).length;

  const progressPercent = Math.min(100, Math.round((completedTopicCount / totalTopics) * 100));

  return {
    progressPercent,
    completedTopics: completedTopicCount,
    totalTopics,
  };
}

async function getHomeDashboard(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    topics: true,
                  },
                },
              },
            },
          },
        },
        topicProgress: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const enrolledCourses = user.enrollments.map((enrollment) => {
      const progress = formatCourseProgress({
        ...enrollment,
        user,
      });

      return {
        enrollmentId: enrollment.id,
        courseId: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        type: enrollment.course.type,
        status: enrollment.status,
        ...progress,
      };
    });

    const liveSessions = [
      {
        id: 'ls-1',
        title: 'DSA Power Hour',
        mentor: 'Priya Nair',
        startsAt: 'Today, 07:00 PM',
        topic: 'Binary Search & Patterns',
      },
      {
        id: 'ls-2',
        title: 'System Design Essentials',
        mentor: 'Arjun Rao',
        startsAt: 'Tomorrow, 08:00 PM',
        topic: 'Scalable API Design',
      },
      {
        id: 'ls-3',
        title: 'Placement Interview Drill',
        mentor: 'Sneha Iyer',
        startsAt: 'Fri, 06:30 PM',
        topic: 'Behavioral + HR Simulation',
      },
      {
        id: 'ls-4',
        title: 'Aptitude Sprint',
        mentor: 'Rahul Menon',
        startsAt: 'Sat, 10:00 AM',
        topic: 'Speed Math & Logical Reasoning',
      },
    ];

    const placementAchievementsRaw = await prisma.jobApplication.findMany({
      where: {
        status: 'SHORTLISTED',
      },
      take: 6,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            currentCity: true,
          },
        },
        jobPosting: {
          select: {
            companyName: true,
            role: true,
            packageLpa: true,
          },
        },
      },
    });

    const placementAchievements = placementAchievementsRaw.map((item) => ({
      id: item.id,
      studentName: item.user.name,
      studentPhotoUrl: `https://i.pravatar.cc/120?u=${item.user.id}`,
      companyName: item.jobPosting.companyName,
      companyLogoUrl: `https://logo.clearbit.com/${item.jobPosting.companyName
        .toLowerCase()
        .replace(/\s+/g, '')}.com`,
      role: item.jobPosting.role,
      packageLpa: `${item.jobPosting.packageLpa.toString()} LPA`,
      location: item.user.currentCity || 'India',
    }));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        hero: {
          title: `Welcome back, ${user.name.split(' ')[0]} 👋`,
          subtitle: 'Continue your coding journey, join live sessions, and accelerate your placement prep.',
          ctaLabel: 'Chat with BroKod',
          ctaHref: '/brokod',
        },
        liveSessions,
        enrolledCourses,
        placementAchievements,
      },
    });
  } catch (error) {
    console.error('Home dashboard fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch dashboard data',
    });
  }
}

module.exports = {
  getHomeDashboard,
};
