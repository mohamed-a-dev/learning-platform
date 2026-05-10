'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { createEnrollment, createLessonCompleted, deleteEnrollment, deleteLessonCompleted, getBrowseCourses, getCompletedCoursesCount, getCompletedLessonsCount, getCourseProgress, getCoursesCount, getEnrollment, getLessonsCompletionStatus, getLessonsProgress, getStudentCourses } from "@/services/student-courses-services"
import { revalidatePath } from "next/cache";

const getStudentCoursesCountAction = async () => {
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
        return { success: true, message: completedLessonsCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCompletedCoursesCountAction = async () => {
    try {
        const completedCoursesCount = getCompletedCoursesCount();
        return { success: true, message: completedCoursesCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}


const getCourseProgressAction = async () => {
    try {
        const coursesProgressList = await getCourseProgress();
        return { success: true, message: coursesProgressList }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getLessonsProgressAction = async () => {
    try {
        const lessonsProgressList = await getLessonsProgress();
        return { success: true, message: lessonsProgressList }
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
        revalidatePath('/courses')
        return { success: true, message: createdCompletedLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteLessonCompletedAction = async (lessonId: string) => {
    try {
        const deletedLesson = await deleteLessonCompleted(lessonId);
        revalidatePath('/courses')
        return { success: true, message: deletedLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getLessonsCompletionStatusAction = async (courseId: string) => {
    try {
        const lessonCompletionMap = await getLessonsCompletionStatus(courseId);
        return { success: true, message: lessonCompletionMap }
    } catch (error: any) {
        return errorHandler(error);
    }
}

// const getNextLessonToContinueAction = async (courseId: string) => {
//     try {
//         const nextLesson = await getNextLessonToContinue(courseId);
//         return { success: true, nextLesson }
//     } catch (error: any) {
//         return errorHandler(error);
//     }
// }

export {
    getStudentCoursesCountAction,
    getCompletedLessonsCountAction,
    getCompletedCoursesCountAction,
    getCourseProgressAction,
    getLessonsProgressAction,
    createEnrollmentAction,
    getEnrollmentAction,
    deleteEnrollmentAction,
    getBrowseCoursesAction,
    getStudentCoursesAction,
    createLessonCompletedAction,
    deleteLessonCompletedAction,
    getLessonsCompletionStatusAction,
    // getNextLessonToContinueAction,
}