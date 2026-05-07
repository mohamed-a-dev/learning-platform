'use server'
import { getSessionUserInfo } from "@/lib/authorization";
import prisma from "@/lib/prisma"

// ------------------------------------dashboard page------------------------------------
const getCoursesCount = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const coursesCount = await prisma.enrollment.count({
        where: {
            userId: studentId
        }
    })
    return coursesCount;
}


const getCompletedLessonsCount = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const completedLessonsCount = await prisma.lessonCompleted.count({
        where: {
            userId: studentId
        }
    });
    return completedLessonsCount;
}

// ------------------------------------Browse Courses page------------------------------------
const getBrowseCourses = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const courses = await prisma.course.findMany({
        where: {
            enrollments: {
                none: {
                    userId: studentId
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true
                }
            },
        }
    });

    return courses;
};

const createEnrollment = async (courseId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollment = await prisma.enrollment.create({
        data: {
            userId: studentId!,
            courseId,
        }
    });
    return enrollment;
}

const getEnrollment = async (courseId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: studentId!,
            courseId,
        }
    });

    if (!enrollment)
        return { isEnrolled: false }
    return { isEnrolled: true };
}

const deleteEnrollment = async (courseId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollment = await prisma.enrollment.delete({
        where: {
            userId_courseId: {
                userId: studentId!,
                courseId,
            }
        }
    });

    return enrollment;
}

// ------------------------------------My Courses page------------------------------------
const getStudentCourses = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: studentId
        }
        ,
        include: {
            course: true
        }
    });
    return enrollments.map((obj) => obj.course);
}

// ------------------------------------Course page------------------------------------
// set lesson as completed
const createLessonCompleted = async (lessonId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
    });

    if (!lesson) {
        throw { code: 'P2025' };
    }

    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            userId: studentId,
            courseId: lesson.courseId
        }
    });

    if (!isEnrolled)
        throw { code: "FORBIDDEN", message: "User not enrolled in this course" };

    const createdCompletedLesson = await prisma.lessonCompleted.create({
        data: {
            userId: studentId!,
            lessonId
        }
    });
    return createdCompletedLesson;
};


// get next lesson | continue button
const getNextLessonToContinue = async (courseId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const lessons = await prisma.lesson.findMany({
        where: { courseId },
        orderBy: { position: "asc" }
    });

    const completedLessons = await prisma.lessonCompleted.findMany({
        where: {
            userId: studentId,
            lesson: {
                courseId
            }
        },
        select: {
            lessonId: true
        }
    });

    const completedLessonsSet = new Set(completedLessons.map(l => l.lessonId));

    const nextLesson = lessons.find(lesson => !completedLessonsSet.has(lesson.id));

    return nextLesson;
};

export {
    getCoursesCount,
    getCompletedLessonsCount,
    getBrowseCourses,
    createEnrollment,
    getEnrollment,
    deleteEnrollment,
    getStudentCourses,
    getNextLessonToContinue,
    createLessonCompleted
}