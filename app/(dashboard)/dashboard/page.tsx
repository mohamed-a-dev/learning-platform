import { getCoursesCountAction, getCoursesEnrollmentsAction, getLessonsCountAction, getStudentsCountAction, getStudentsGrowthAction } from "@/actions/instructor-courses-actions";
import { getCompletedCoursesCountAction, getCompletedLessonsCountAction, getCourseProgressAction, getLessonsProgressAction, getStudentCoursesCountAction } from "@/actions/student-courses-actions";
import EnrollmentsBarChart from "@/components/Dashboard/instructor/CourseEnrollmentChart";
import StatCard from "@/components/Dashboard/StatCard";
import StudentsLineChart from "@/components/Dashboard/instructor/StudentsGrowsChart";
import ProgressChart from "@/components/Dashboard/student/ProgressCharts";
import RemainingLessonsChart from "@/components/Dashboard/student/RemainingLessonsChart";
import { getSessionUserInfo } from "@/lib/authorization";


const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
];

type CourseProgress = {
    courseId: string;
    title: string;
    progress: number;
};



export default async function Dashboard() {
    const { role } = await getSessionUserInfo();

    let stats;
    let coursesProgressData;
    let lessonsProgressData;
    let studentsGrowthData;
    let coursesEnrollmentsData;

    if (role === 'instructor') {
        const [students, courses, lessons, studentsGrowth, coursesEnrollments] = await Promise.all([
            getStudentsCountAction(),
            getCoursesCountAction(),
            getLessonsCountAction(),
            getStudentsGrowthAction(),
            getCoursesEnrollmentsAction()
        ]);

        stats = {
            students,
            courses,
            lessons,
        }

        studentsGrowthData = studentsGrowth.message;
        coursesEnrollmentsData = coursesEnrollments.message;
    }


    if (role === 'student') {
        const [courses, completedCourses, completedLessons, coursesProgress, lessonsProgress] = await Promise.all([
            getStudentCoursesCountAction(),
            getCompletedCoursesCountAction(),
            getCompletedLessonsCountAction(),
            getCourseProgressAction(),
            getLessonsProgressAction(),
        ]);

        stats = {
            completedCourses,
            courses,
            completedLessons,
        }

        coursesProgressData = coursesProgress.message.map((record: CourseProgress, i: number) => ({ ...record, fill: colors[i] }));
        lessonsProgressData = lessonsProgress.message;
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

            <article className="flex flex-col md:flex-row flex-wrap gap-5 md:items-center">
                {
                    role === 'instructor' ?
                        <>
                            <StudentsLineChart data={studentsGrowthData} />
                            <EnrollmentsBarChart data={coursesEnrollmentsData} />
                        </>

                        :
                        <>
                            <ProgressChart data={coursesProgressData} />
                            <RemainingLessonsChart data={lessonsProgressData} />
                        </>
                }
            </article>

        </section>
    );
}