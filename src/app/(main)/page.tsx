"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { Timeline } from "@/components/ui/timeline";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const app = useStackApp();

  // Get user role from Stack Auth clientMetadata
  const userRole = (user?.clientMetadata?.role as string) || 'student';

  const testimonials = [
    {
      id: 1,
      name: "Maria Garcia",
      role: "NZCEL Level 4 Student",
      company: "Auckland University",
      content:
        "The AI Speaking Coach helped me improve my pronunciation dramatically. I went from struggling with conversations to confidently presenting in my university classes. The real-time feedback was invaluable!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Chen Wei",
      role: "General English Learner",
      company: "IT Professional",
      content:
        "I've tried many English learning platforms, but this one is different. The CEFR-aligned practice helped me progress from B1 to B2 in just 6 months. The personalized feedback from AI is like having a private tutor!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "NZCEL Level 5 Graduate",
      company: "Healthcare Professional",
      content:
        "The comprehensive NZCEL preparation materials were exactly what I needed. I passed Level 5 on my first attempt and secured my nursing registration. The practice questions matched the actual exam perfectly!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
  ];

  // Student timeline data
  const studentTimelineData = [
    {
      title: "AI Speaking Coach",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Practice real-time voice conversation with AI coach. Natural dialogue with instant feedback and pronunciation assessment across all CEFR levels.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/ai-speaking-coach.svg"
                alt="AI Speaking Coach"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/speaking") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => user ? router.push("/student/dashboard") : router.push("/register")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "NZCEL Exam Prep",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Comprehensive preparation for New Zealand Certificates in English Language. Complete pathway from Foundation to Level 6 covering all skills and university requirements.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/nzcel-exam-prep.svg"
                alt="NZCEL Exam Preparation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/practice/nzcel") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Prep
            </Button>
            <Button
              onClick={() => user ? router.push("/student/dashboard") : router.push("/register")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "General Practice",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            CEFR-aligned English practice across all proficiency levels. Systematic skill development from Elementary A1 to Proficiency C2 with adaptive difficulty.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/general-practice.svg"
                alt="General English Practice"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/practice/general") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => user ? router.push("/student/dashboard") : router.push("/register")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Scenario Learning",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Context-based English practice for real-world situations. Workplace communication, travel scenarios, academic discussions, and social interactions.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center opacity-60">
              <img
                src="/images/illustrations/scenario-learning.svg"
                alt="Scenario-based Learning"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              disabled
              className="flex-1 md:flex-initial"
            >
              Coming Soon
            </Button>
          </div>
        </div>
      ),
    },
  ];

  // Teacher timeline data
  const teacherTimelineData = [
    {
      title: "Class Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Manage your classes, track student enrollment, and monitor overall class performance with comprehensive analytics and insights.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/class-management.svg"
                alt="Class Management"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/teacher/classes")}
              className="flex-1 md:flex-initial"
            >
              Manage Classes
            </Button>
            <Button
              onClick={() => router.push("/teacher/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Assignment Creation",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Create and distribute assignments to your students. Track submission status, provide feedback, and monitor completion rates.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/assignment-creation.svg"
                alt="Assignment Creation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/teacher/assignments")}
              className="flex-1 md:flex-initial"
            >
              Create Assignment
            </Button>
            <Button
              onClick={() => router.push("/teacher/assignments")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Assignments
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Student Progress Tracking",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Monitor individual student performance across all learning modules. View detailed analytics and identify areas for improvement.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/student-tracking.svg"
                alt="Student Progress Tracking"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/teacher/students")}
              className="flex-1 md:flex-initial"
            >
              View Students
            </Button>
            <Button
              onClick={() => router.push("/teacher/analytics")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Analytics
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Teaching Resources",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Access teaching materials, lesson plans, and educational resources. Share resources with colleagues and collaborate effectively.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/teaching-resources.svg"
                alt="Teaching Resources"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/teacher/resources")}
              className="flex-1 md:flex-initial"
            >
              Browse Resources
            </Button>
            <Button
              onClick={() => router.push("/teacher/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              Dashboard
            </Button>
          </div>
        </div>
      ),
    },
  ];

  // Parent timeline data
  const parentTimelineData = [
    {
      title: "Children's Progress",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Monitor your children's learning progress across all subjects. View detailed reports and track improvements over time.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/children-progress.svg"
                alt="Children's Progress"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/parent/children")}
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
            <Button
              onClick={() => router.push("/parent/reports")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Reports
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Assignment Monitoring",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Keep track of your children's assignments, due dates, and completion status. Ensure they stay on top of their studies.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/assignment-monitoring.svg"
                alt="Assignment Monitoring"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/parent/assignments")}
              className="flex-1 md:flex-initial"
            >
              View Assignments
            </Button>
            <Button
              onClick={() => router.push("/parent/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              Dashboard
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Teacher Communication",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Stay connected with teachers. Receive feedback about your children's performance and collaborate on their educational journey.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/teacher-communication.svg"
                alt="Teacher Communication"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/parent/feedback")}
              className="flex-1 md:flex-initial"
            >
              View Feedback
            </Button>
            <Button
              onClick={() => router.push("/parent/messages")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              Messages
            </Button>
          </div>
        </div>
      ),
    },
  ];

  // Admin timeline data (for school-admin, department-head, system-admin)
  const adminTimelineData = [
    {
      title: "Organization Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Manage organizational structure, departments, and system-wide settings. Oversee all educational operations.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/organization-management.svg"
                alt="Organization Management"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                const adminRoute = userRole === 'system_admin' ? '/system-admin/organizations' :
                                  userRole === 'school_admin' ? '/school-admin/departments' :
                                  '/department/dashboard';
                router.push(adminRoute);
              }}
              className="flex-1 md:flex-initial"
            >
              Manage Organization
            </Button>
            <Button
              onClick={() => {
                const dashRoute = userRole === 'system_admin' ? '/system-admin/dashboard' :
                                 userRole === 'school_admin' ? '/school-admin/dashboard' :
                                 '/department/dashboard';
                router.push(dashRoute);
              }}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              Dashboard
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "User Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Manage users, assign roles, and control access permissions. Ensure proper system access for all stakeholders.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/user-management.svg"
                alt="User Management"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                const userRoute = userRole === 'system_admin' ? '/system-admin/users' :
                                 userRole === 'school_admin' ? '/school-admin/users' :
                                 '/department/teachers';
                router.push(userRoute);
              }}
              className="flex-1 md:flex-initial"
            >
              Manage Users
            </Button>
            <Button
              onClick={() => {
                const dashRoute = userRole === 'system_admin' ? '/system-admin/permissions' :
                                 userRole === 'school_admin' ? '/school-admin/settings' :
                                 '/department/dashboard';
                router.push(dashRoute);
              }}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              {userRole === 'system_admin' ? 'Permissions' : 'Settings'}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Analytics & Reports",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Access comprehensive analytics and generate reports. Make data-driven decisions to improve educational outcomes.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/images/illustrations/analytics-reports.svg"
                alt="Analytics & Reports"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                const analyticsRoute = userRole === 'system_admin' ? '/system-admin/audit' :
                                      userRole === 'school_admin' ? '/school-admin/analytics' :
                                      '/department/analytics';
                router.push(analyticsRoute);
              }}
              className="flex-1 md:flex-initial"
            >
              View Analytics
            </Button>
            <Button
              onClick={() => {
                const reportRoute = userRole === 'system_admin' ? '/system-admin/database' :
                                   userRole === 'school_admin' ? '/school-admin/reports' :
                                   '/department/reports';
                router.push(reportRoute);
              }}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              Generate Reports
            </Button>
          </div>
        </div>
      ),
    },
  ];

  // Guest/non-logged in timeline data - same as student but with different buttons
  const guestTimelineData = studentTimelineData.map(item => ({
    ...item,
    content: (
      <div>
        {item.content.props.children[0]}
        {item.content.props.children[1]}
        <div className="flex gap-4">
          <Link href="/register">
            <Button className="flex-1 md:flex-initial">
              Get Started
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="flex-1 md:flex-initial">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>
    ),
  }));

  // Select timeline data based on user role
  const timelineData = !user ? guestTimelineData :
                       userRole === 'teacher' ? teacherTimelineData :
                       userRole === 'parent' ? parentTimelineData :
                       ['school_admin', 'department_head', 'system_admin'].includes(userRole) ? adminTimelineData :
                       studentTimelineData;

  return (
    <div className="min-h-screen">
      <WelcomeTour />
      {/* Hero Section with Background Circles */}
      <BackgroundCircles variant="octonary">
        <div className="flex flex-col gap-4 items-center justify-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white text-center">
            Master English with AI
          </h1>

          <p className="text-xl md:text-2xl text-black/70 dark:text-white/70 py-4 text-center max-w-3xl">
            AI-powered practice, exam prep, and speaking coaching for all levels
          </p>

          {user ? (
            // Logged in user - show Go to Dashboard (role-based redirect)
            <Button
              onClick={() => {
                const dashboardPath =
                  userRole === "teacher" ? "/teacher/dashboard" :
                  userRole === "parent" ? "/parent/dashboard" :
                  userRole === "school_admin" ? "/school-admin/dashboard" :
                  userRole === "department_head" ? "/department/dashboard" :
                  userRole === "system_admin" ? "/system-admin/dashboard" :
                  "/student/dashboard";
                router.push(dashboardPath);
              }}
              size="lg"
              className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </Button>
          ) : (
            // Guest user - show Get Started (leads to registration with invitation code)
            <Link href="/register">
              <Button
                size="lg"
                className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
              >
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </BackgroundCircles>

      {/* Learning Paths Section - Timeline Design */}
      <Timeline data={timelineData} />

      {/* Student Success Stories */}
      <AnimatedTestimonials
        title="Student Success Stories"
        subtitle="Join thousands of learners who have achieved their English language goals with our AI-powered platform."
        badgeText="Trusted by students worldwide"
        testimonials={testimonials}
        autoRotateInterval={7000}
        trustedCompanies={[
          {
            name: "College Board - Advanced Placement",
            logoPath: "/images/accreditations/AP.svg",
            description: "Accredited by the College Board to offer Advanced Placement (AP) curriculum."
          },
          {
            name: "Cambridge International School",
            logoPath: "/images/accreditations/Cambridge-International-School.svg",
            description: "Registered Cambridge International School."
          },
          {
            name: "Pearson Edexcel",
            logoPath: "/images/accreditations/Pearson-Edexcel.svg",
            description: "Accredited by Pearson Edexcel to offer International GCSEs and A Levels."
          },
          {
            name: "NCEA",
            logoPath: "/images/accreditations/NCEA.svg",
            description: "Offering NCEA Levels 1-3 in flexible online and in-person settings."
          },
          {
            name: "Western Association of Schools and Colleges",
            logoPath: "/images/accreditations/Western-Association-of-Schools-and-Colleges.svg",
            description: "Accredited by WASC, the largest global accrediting schooling body."
          },
          {
            name: "Council of British International Schools",
            logoPath: "/images/accreditations/Council-of-British-International-Schools.svg",
            description: "COBIS accredited member, a benchmark for top international schools."
          },
          {
            name: "NCAA",
            logoPath: "/images/accreditations/NCAA.svg",
            description: "Offering accredited NCAA courses to support student athletes."
          },
          {
            name: "Florida Department of Education",
            logoPath: "/images/accreditations/Florida-Department-of-Education.svg",
            description: "Registered in Florida as a private school with the Department of Education."
          },
        ]}
        trustedCompaniesTitle="International and Local Accreditations and Qualifications"
      />
    </div>
  );
}
