import { getCoursesCountAction, getLessonsCountAction, getStudentsCountAction } from "@/actions/instructor-courses-actions";
import { auth } from "@/auth";
import EnrollmentsBarChart from "@/components/Dashboard/CourseEnrollmentChart";
import StatCard from "@/components/Dashboard/StatCard";
import StudentsLineChart from "@/components/Dashboard/StudentsGrowsChart";

export default async function Dashboard() {
    const session = await auth();
    const instructorId = session?.user?.id!;

    const [students, courses, lessons] = await Promise.all([
        getStudentsCountAction(instructorId),
        getCoursesCountAction(instructorId),
        getLessonsCountAction(instructorId),
    ]);

    return (
        <section className="p-5 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Instructor Overview
                </h1>
                <p className="text-gray-500 mt-2">
                    A quick summary of your courses, students, and lessons
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Students" value={students.message} />
                <StatCard title="Courses" value={courses.message} />
                <StatCard title="Lessons" value={lessons.message} />
            </div>

            <article className="flex flex-col md:flex-row gap-3 md:items-center">
                <StudentsLineChart />
                <EnrollmentsBarChart />
            </article>
        </section>
    );
}