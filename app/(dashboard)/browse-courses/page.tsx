import { getBrowseCoursesAction } from "@/actions/student-courses-actions";
import CourseCardActions from "@/components/my-courses/CourseCardActions";
import { Course } from "@/types/course";



export default async function Page() {
    const { success, message } = await getBrowseCoursesAction();

    const courses: Course[] = success ? message : [];

    return (
        <section className="p-5 space-y-5 h-full">
            {!success && (
                <p className="text-red-500 mb-4 text-4xl">{message}</p>
            )}

            {
                courses.length === 0 ?
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <p className="text-2xl font-semibold text-gray-700">
                            No courses yet
                        </p>
                    </div>
                    :
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Browse Courses
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Explore available courses and start learning something new today
                        </p>
                    </div>
            }

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-lg duration-300"
                    >
                        <h2 className="text-lg font-semibold mb-2 capitalize">
                            {course.title}
                        </h2>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-medium text-gray-700">Instructor:</span>
                            <span className="text-gray-500">
                                {course.instructor?.name || "Unknown"}
                            </span>
                        </div>

                        <p className="text-black/80 mb-4 line-clamp-3 capitalize">
                            {course.description}
                        </p>

                        <div className="mb-3 flex justify-between items-center">
                            <span className="text-sm text-black/70 mb-4">
                                Created:{" "}
                                {new Date(course.createdAt).toLocaleDateString()}
                            </span>

                            <span className="text-sm text-black/70 mb-4">
                                Updated:{" "}
                                {new Date(course.updatedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <CourseCardActions course={course} role='student' isEnrolled={false} />
                    </div>
                ))}
            </div>
        </section>
    );
}