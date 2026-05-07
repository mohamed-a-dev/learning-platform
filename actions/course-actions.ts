'use server'

import { errorHandler } from "@/lib/prismaErrors";
import { getCourse, getCourseLessons } from "@/services/course-services"

const getCourseAction = async (courseId: string) => {
    try {
        const course = await getCourse(courseId);
        return { success: true, message: course };
    } catch (error) {
        return errorHandler(error)
    }
}

const getCourseLessonsAction = async (courseId: string) => {
    try {
        const lessons = await getCourseLessons(courseId);
        return { success: true, message: lessons };
    } catch (error) {
        return errorHandler(error);
    }
}

export { getCourseAction, getCourseLessonsAction };