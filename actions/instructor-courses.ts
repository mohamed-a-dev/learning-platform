'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { createCourseSchema, editCourseSchema } from "@/lib/validation/courses-validation";
import { createCourse, deleteCourse, deleteLesson, editCourse, editLesson, getCourses, getCoursesCount, getLessonsCount, getStudentsCount } from "@/services/instructor-courses"
import { CreateCourse, EditCourse, EditLesson } from "@/types/course";

const getCoursesCountAction = async (instructorId: string) => {
    try {
        const coursesCount = await getCoursesCount(instructorId);
        return { success: true, coursesCount };
    } catch (error: any) {
        return errorHandler(error); // default case in errorHandler
    }
}

const getStudentsCountAction = async (instructorId: string) => {
    try {
        const studentsCount = await getStudentsCount(instructorId);
        return { success: true, studentsCount };
    } catch (error: any) {
        return errorHandler(error); // default case in errorHandler
    }
}

const getLessonsCountAction = async (instructorId: string) => {
    try {
        const lessonsCount = await getLessonsCount(instructorId);
        return { success: true, lessonsCount };
    } catch (error: any) {
        return errorHandler(error); // default case in errorHandler
    }
}

const createCourseAction = async (course: CreateCourse) => {
    const result = createCourseSchema.safeParse(course);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    try {
        const createdCourse = await createCourse(course);
        return { success: true, createdCourse };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCoursesAction = async (instructorId: string) => {
    try {
        const courses = await getCourses(instructorId);
        return { success: true, courses }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const editCourseAction = async (instructorId: string, courseId: string, course: EditCourse) => {
    const result = editCourseSchema.safeParse(course);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    try {
        const editedCourse = await editCourse(instructorId, courseId, course);
        return { success: true, editedCourse }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteCourseAction = async (instructorId: string, courseId: string) => {
    try {
        const deletedCourse = await deleteCourse(instructorId, courseId);
        return { success: true, deletedCourse };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteLessonAction = async (instructorId: string, lessonId: string) => {
    try {
        const deletedLesson = await deleteLesson(instructorId, lessonId);
        return { success: true, deletedLesson };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const editLessonAction = async (instructorId: string, lessonId: string, data: EditLesson) => {
    const result = editCourseSchema.safeParse(data);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    try {
        const editedLesson = await editLesson(instructorId, lessonId, data);
        return { success: true, editedLesson };
    } catch (error: any) {
        return errorHandler(error);
    }
}

export {
    getCoursesCountAction,
    getStudentsCountAction,
    getLessonsCountAction,
    createCourseAction,
    getCoursesAction,
    editCourseAction,
    deleteCourseAction,
    deleteLessonAction,
    editLessonAction,
}