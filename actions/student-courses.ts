'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { createEnrollment, createLessonCompleted, getCompletedLessonsCount, getCourses, getCoursesCount, getNextLessonToContinue, getStudentCourses } from "@/services/student-courses"

const getCoursesCountAction = async (studentId: string) => {
    try {
        const coursesCount = getCoursesCount(studentId);
        return { success: true, coursesCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCompletedLessonsCountAction = async (studentId: string) => {
    try {
        const completedLessonsCount = getCompletedLessonsCount(studentId);
        return { success: true, completedLessonsCount }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCoursesAction = async () => {
    try {
        const courses = await getCourses();
        return { success: true, courses }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const createEnrollmentAction = async (studentId: string, courseId: string) => {
    try {
        const enrollment = await createEnrollment(studentId, courseId);
        return { success: true, enrollment }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getStudentCoursesAction = async (studentId: string) => {
    try {
        const courses = await getStudentCourses(studentId);
        return { success: true, courses }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const createLessonCompletedAction = async (studentId: string, lessonId: string) => {
    try {
        const createdCompletedLesson = await createLessonCompleted(studentId, lessonId);
        return { success: true, createdCompletedLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getNextLessonToContinueAction = async (studentId: string, courseId: string) => {
    try {
        const nextLesson = await getNextLessonToContinue(studentId, courseId);
        return { success: true, nextLesson }
    } catch (error: any) {
        return errorHandler(error);
    }
}

export {
    getCoursesCountAction,
    getCompletedLessonsCountAction,
    getCoursesAction,
    createEnrollmentAction,
    getStudentCoursesAction,
    createLessonCompletedAction,
    getNextLessonToContinueAction,
}