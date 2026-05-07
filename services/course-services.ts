'use server'
import { getSessionUserInfo } from "@/lib/authorization";
import prisma from "@/lib/prisma"

const getCourse = async (courseId: string) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            instructor: {
                select: {
                    name: true,
                },
            },
            _count: {
                select: {
                    lessons: true,
                },
            },
        },
    });

    if (!course)
        throw { code: 'P2025' };

    return course;
}


const getCourseLessons = async (courseId: string) => {
    const { id: userId, role } = await getSessionUserInfo();

    const courseWithLessons = await prisma.course.findFirst({
        where: {
            id: courseId,
        },
        include: {
            lessons: true
        }
    });

    if (!courseWithLessons)
        throw { code: "P2025" };

    const lessons = courseWithLessons?.lessons.map((lesson) => ({ ...lesson, courseTitle: courseWithLessons.title }));

    // verify if lessons are owned by instructor
    if (role === 'instructor' && courseWithLessons.instructorId === userId)
        return lessons;

    // if role is student, verify that student enrolled 
    else if (role === 'student') {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId,
                courseId
            }
        });

        if (!enrollment)
            throw { code: 'FORBIDDEN', message: 'Not Enrolled' };

        return lessons;
    }

    throw { code: 'FORBIDDEN', message: 'Not authorized to access this course lessons' };

}


export {  getCourse, getCourseLessons }