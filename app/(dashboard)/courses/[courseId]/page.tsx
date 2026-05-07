import { getCourseAction } from "@/actions/course-actions";
import { getEnrollmentAction } from "@/actions/student-courses-actions";
import AddLessonButton from "@/components/my-courses/AddLessonButton";
import CourseEnrollToggleButton from "@/components/my-courses/CourseEnrollToggleButton";
import LessonsSection from "@/components/my-courses/LessonsSection";
import { getSessionUserInfo } from "@/lib/authorization";
import { Course } from "@/types/course";

export default async function page({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    const { role } = await getSessionUserInfo();

    const [courseResponse, enrollmentResponse] = await Promise.all([getCourseAction(courseId), getEnrollmentAction(courseId)]);

    const { success: courseResSuccess, message: courseResMessage } = courseResponse;
    const { success: enrollmentResSuccess, message: enrollmentResMessage } = enrollmentResponse;
    
    // course res
    const course: Course = courseResponse.success ? courseResponse.message : {};
    const { id, title, description, createdAt, updatedAt, _count } = course;

    // enrollment res
    const isEnrolled = enrollmentResSuccess ? enrollmentResMessage.isEnrolled : false;


    return (
        <>
            {!courseResSuccess ?
                <section className="h-full flex justify-center items-center">
                    <h1 className="text-4xl capitalize">{courseResMessage}</h1>
                </section>
                :
                <section className="p-5 h-full">

                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* HEADER */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start">

                            <div className="md:w-3/4 shrink-0">
                                <h1 className="capitalize text-3xl font-bold text-gray-900">
                                    {title}
                                </h1>

                                <p className="capitalize text-gray-600 mt-2">
                                    {description}
                                </p>

                                <div className="text-md text-gray-700 mt-3">
                                    Lessons Count: {_count?.lessons}
                                </div>
                            </div>

                            {/* Hybrid */}
                            {/* ADD LESSON BUTTON */}
                            {
                                role === 'instructor'
                                    ?
                                    <div className="w-full flex items-center justify-end">
                                        <AddLessonButton courseId={courseId} />
                                    </div>
                                    :
                                    <div className="w-full flex items-center justify-end">
                                        <CourseEnrollToggleButton courseId={courseId} isEnrolled={isEnrolled} />
                                    </div>
                            }

                        </div>

                        {/* INFO CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm">Created At</p>
                                <p className="font-medium">
                                    {new Date(createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm">Last Updated</p>
                                <p className="font-medium">
                                    {new Date(updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                        </div>

                        {/* LESSONS SECTION */}
                        <LessonsSection courseId={courseId} />
                    </div>
                </section>
            }
        </>

    )
}
