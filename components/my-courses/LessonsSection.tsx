import { Lesson } from "@/types/course";
import LessonCardActions from "./LessonCardActions";
import { getCourseLessonsAction } from "@/actions/course-actions";
import { getSessionUserInfo } from "@/lib/authorization";
import { getLessonsCompletionStatusAction } from "@/actions/student-courses-actions";

export default async function LessonsSection({ courseId }: { courseId: string }) {
    const { success, message } = await getCourseLessonsAction(courseId);

    // get all completed lessons map
    const { success: success2, message: lessonCompletionMap } = await getLessonsCompletionStatusAction(courseId);


    const lessons: Lesson[] = success && success2 ? message : [];
    const { role } = await getSessionUserInfo();



    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">

            <h2 className="text-xl font-semibold mb-4">
                Lessons
            </h2>
            {/* hybrid */}
            {
                role === 'student' && message === 'Not Enrolled' ?
                    <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">
                        You’re not enrolled yet. Enroll to access the lessons.
                    </div>
                    :

                    lessons.length === 0
                        ? (
                            <div className="text-gray-500 text-sm">
                                No lessons yet. Click "Add Lesson" to create one.
                            </div>
                        )
                        :
                        (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="border border-gray-300 rounded-xl p-4 bg-white hover:shadow-xl duration-300"
                                    >
                                        {/* Top Row */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
                                                    {lesson.title}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                                    {lesson.courseTitle}
                                                </p>
                                            </div>

                                            <span className="flex items-center justify-center min-w-8 h-8 px-2 text-xs font-bold bg-blue-500 text-white rounded-full">
                                                {lesson.position}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t my-3"></div>

                                        {/* Actions */}
                                        <LessonCardActions lesson={lesson} isCompleted={lessonCompletionMap[lesson.id] || false} role={role!} />
                                    </div>
                                ))}
                            </div>
                        )}
        </div>
    )
}
