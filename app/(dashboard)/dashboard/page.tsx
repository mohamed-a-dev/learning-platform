import { getCoursesCountAction, getLessonsCountAction, getStudentsCountAction } from "@/actions/instructor-courses-actions";
import { getCompletedCoursesCountAction, getCompletedLessonsCountAction, getStudentCoursesCountAction } from "@/actions/student-courses-actions";
import EnrollmentsBarChart from "@/components/Dashboard/CourseEnrollmentChart";
import StatCard from "@/components/Dashboard/StatCard";
import StudentsLineChart from "@/components/Dashboard/StudentsGrowsChart";
import { getSessionUserInfo } from "@/lib/authorization";

export default async function Dashboard() {
    const { role } = await getSessionUserInfo();

    let stats;

    if (role === 'instructor') {
        const [students, courses, lessons] = await Promise.all([
            getStudentsCountAction(),
            getCoursesCountAction(),
            getLessonsCountAction(),
        ]);

        stats = {
            students,
            courses,
            lessons,
        }
    }


    if (role === 'student') {
        const [courses, completedCourses, completedLessons] = await Promise.all([
            getStudentCoursesCountAction(),
            getCompletedCoursesCountAction(),
            getCompletedLessonsCountAction(),
        ]);

        stats = {
            completedCourses,
            courses,
            completedLessons,
        }
    }



    const cards = role === 'instructor' ?
        [
            { title: "Students", value: stats?.students?.message },
            { title: "Courses", value: stats?.courses?.message },
            { title: "Lessons", value: stats?.lessons?.message },
        ]
        : [
            { title: "Enrolled Courses", value: stats?.courses?.message },
            { title: "Completed Courses", value: stats?.completedCourses?.message },
            { title: "Completed Lessons", value: stats?.completedLessons?.message },
        ];



    return (
        <section className="p-5 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {role === 'instructor' ? "Instructor Overview" : "Student Overview"}
                </h1>
                <p className="text-gray-500 mt-2">
                    {
                        role === 'instructor' ?
                            "A quick summary of your courses, students, and lessons"
                            :
                            "A quick summary of your courses, and lessons"
                    }
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {
                    cards.map((card, i) =>
                        <StatCard key={i} title={card.title} value={card.value} />
                    )
                }
            </div>




            <article className="flex flex-col md:flex-row gap-3 md:items-center">
                <StudentsLineChart />
                <EnrollmentsBarChart />
            </article>
        </section>
    );
}