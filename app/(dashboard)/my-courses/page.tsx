import { getInstructorCoursesAction } from "@/actions/instructor-courses-actions";
import { getEnrollmentAction, getStudentCoursesAction } from "@/actions/student-courses-actions";
import CourseCardActions from "@/components/my-courses/CourseCardActions";
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
        <section className="p-5 h-full">
            {/* instructor */}
            {
                role === 'instructor'
                &&
                <main className="mb-5 flex flex-col gap-1 md:gap-0 md:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Courses</h1>

                        <p className="text-gray-500">
                            You have {courses.length} {courses.length === 1 ? "course" : "courses"}
                        </p>
                    </div>

                    <Link
                        href={'/create-course'}
                        className=" md:mt-0 w-full active:scale-90 md:w-auto px-4 py-2 flex justify-center items-center gap-1 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-150"
                    >
                        <span><FaPlus /></span> Add Course
                    </Link>
                </main>
            }



            {!success && (
                <p className="text-red-500 mb-4 text-4xl">{message}</p>
            )}

            {role === 'student' && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <p className="text-2xl font-semibold text-gray-700">
                        No courses yet
                    </p>

                    <p className="text-md text-gray-500 mt-1">
                        You have not enrolled in any course yet.
                    </p>
                </div>
            )}


            {/* Hybrid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {
                    courses.map((course) =>

                        <div
                            key={course.id}
                            className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-lg duration-300"
                        >
                            <h2 className="text-lg font-semibold mb-1 capitalize">
                                {course.title}
                            </h2>

                            {/* student */}
                            {
                                role === 'student' &&
                                <p className="text-sm text-gray-500 mb-2">
                                    <span className="font-medium text-gray-700">Instructor: </span>
                                    <span className="text-gray-500 capitalize">
                                        {course.instructor?.name || "Unknown"}
                                    </span>
                                </p>
                            }

                            <p className="text-black/80 mb-4 line-clamp-3 capitalize">
                                {course.description}
                            </p>

                            <div className="mb-3 flex justify-between items-center">
                                <span className="text-sm text-black/70">
                                    Created: {new Date(course.createdAt).toLocaleDateString()}
                                </span>

                                <span className="text-sm text-black/70">
                                    Updated: {new Date(course.updatedAt).toLocaleDateString()}
                                </span>
                            </div>


                            {/* Hybrid */}
                            <CourseCardActions course={course} role={role!} isEnrolled={enrollmentMap.get(course.id) || false} />
                        </div>
                    )

                }
            </div>
        </section>
    );
}