'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { createEnrollment, createLessonCompleted, deleteEnrollment, getBrowseCourses, getCompletedLessonsCount, getCoursesCount, getEnrollment, getNextLessonToContinue, getStudentCourses } from "@/services/student-courses-services"
import { revalidatePath } from "next/cache";

const getCoursesCountAction = async () => {
    try {
        const coursesCount = getCoursesCount();
        return { success: true, message: coursesCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCompletedLessonsCountAction = async () => {
    try {
        const completedLessonsCount = getCompletedLessonsCount();
        return { success: true, completedLessonsCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const createEnrollmentAction = async (courseId: string) => {
    try {
        const enrollment = await createEnrollment(courseId);
        revalidatePath('/courses')
        return { success: true, message: enrollment }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getEnrollmentAction = async (courseId: string) => {
    try {
        const enrollment = await getEnrollment(courseId);
        return { success: true, message: enrollment }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteEnrollmentAction = async (courseId: string) => {
    try {
        const enrollment = await deleteEnrollment(courseId);
        revalidatePath('/courses')
        return { success: true, message: enrollment }
    } catch (error: any) {
        return errorHandler(error);
    }
}

// ----------------------------------- browse courses -------------------------------
const getBrowseCoursesAction = async () => {
    try {
        const courses = await getBrowseCourses();
        return { success: true, message: courses }
    } catch (error: any) {
        return errorHandler(error);
    }
}
// ------------------------ my-courses -----------------------------
const getStudentCoursesAction = async () => {
    try {
        const courses = await getStudentCourses();
        return { success: true, message: courses }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const createLessonCompletedAction = async (lessonId: string) => {
    try {
        const createdCompletedLesson = await createLessonCompleted(lessonId);
        return { success: true, createdCompletedLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getNextLessonToContinueAction = async (courseId: string) => {
    try {
        const nextLesson = await getNextLessonToContinue(courseId);
        return { success: true, nextLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

export {
    getCoursesCountAction,
    getCompletedLessonsCountAction,
    createEnrollmentAction,
    getEnrollmentAction,
    deleteEnrollmentAction,
    getBrowseCoursesAction,
    getStudentCoursesAction,
    createLessonCompletedAction,
    getNextLessonToContinueAction,
}