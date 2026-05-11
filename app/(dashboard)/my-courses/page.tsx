import { getInstructorCoursesAction } from "@/actions/instructor-courses-actions";
import { getEnrollmentAction, getStudentCoursesAction } from "@/actions/student-courses-actions";
import CourseCard from "@/components/CourseCard";
import CourseCardActions from "@/components/my-courses/CourseCardActions";
import PageHeader from "@/components/PageHeader";
import { getSessionUserInfo } from "@/lib/authorization";
import { Course } from "@/types/course";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default async function Page() {
    const { role } = await getSessionUserInfo();

    const { success, message } = role === 'instructor' ? await getInstructorCoursesAction() : await getStudentCoursesAction();

    const courses: Course[] = success ? message : [];

    const enrollments = role === 'student' ?
        await Promise.all(
            courses.map(async (course: Course) => {
                const { success, message } = await getEnrollmentAction(course.id);
                return {
                    courseId: course.id,
                    isEnrolled: success ? message.isEnrolled : false
                };
            })
        )
        :
        [];

    const enrollmentMap = new Map(
        enrollments.map(e => [e.courseId, e.isEnrolled])
    );


    return (
        <section className="p-5 h-full space-y-5">
            {!success && (
                <p className="text-red-500 mb-4 text-4xl">{message}</p>
            )}


            {/* instructor */}
            {
                role === 'instructor'
                &&
                <main className="mb-5 flex flex-col gap-1 md:gap-0 md:flex-row items-center justify-between">
                    <PageHeader title="Courses" description={`You have ${courses.length} ${courses.length === 1 ? "course" : "courses"}`} />

                    <Link
                        href={'/create-course'}
                        className=" md:mt-0 w-full active:scale-90 md:w-auto px-4 py-2 flex justify-center items-center gap-1 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-150"
                    >
                        <span><FaPlus /></span> Add Course
                    </Link>
                </main>
            }


            {
                role === 'student' &&
                <PageHeader title="My Courses" description="Continue your learning journey and access all your enrolled courses in one place." />
            }

            {
                role === 'student' && courses.length === 0 &&
                <PageHeader title="No courses yet" description="You have not enrolled in any course yet." />
            }


            {/* Hybrid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {
                    courses.map((course) =>
                        <CourseCard key={course.id} course={course} role={role!} isEnrolled={enrollmentMap.get(course.id)} />
                    )
                }
            </div>
        </section>
    );
}