import { getBrowseCoursesAction } from "@/actions/student-courses-actions";
import CourseCard from "@/components/CourseCard";
import PageHeader from "@/components/PageHeader";
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
                    <PageHeader title="Browse Courses" description="Explore available courses and start learning something new today" />
            }

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} role={'student'} isEnrolled={false} />
                ))}
            </div>
        </section>
    );
}