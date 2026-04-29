'use server'
import prisma from "@/lib/prisma"

// ------------------------------------dashboard page------------------------------------
const getCoursesCount = async (studentId: string) => {
    const coursesCount = await prisma.enrollment.count({
        where: {
            userId: studentId
        }
    })
    return coursesCount;
}


const getCompletedLessonsCount = async (studentId: string) => {
    const completedLessonsCount = await prisma.lessonCompleted.count({
        where: {
            userId: studentId
        }
    });
    return completedLessonsCount;
}

// ------------------------------------Browse Courses page------------------------------------
const getCourses = async () => {
    const courses = await prisma.course.findMany();
    return courses;
}

const createEnrollment = async (studentId: string, courseId: string) => {
    const enrollment = await prisma.enrollment.create({
        data: {
            userId: studentId,
            courseId,
        }
    });
    return enrollment;
}

// ------------------------------------My Courses page------------------------------------
const getStudentCourses = async (studentId: string) => {
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
const createLessonCompleted = async (studentId: string, lessonId: string) => {
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
            userId: studentId,
            lessonId
        }
    });
    return createdCompletedLesson;
};


// get next lesson | continue button
const getNextLessonToContinue = async (studentId: string, courseId: string) => {
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
    getCourses,
    createEnrollment,
    getStudentCourses,
    getNextLessonToContinue,
    createLessonCompleted
}