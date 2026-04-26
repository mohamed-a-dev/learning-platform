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
    const completedCount = await prisma.lessonProgress.count({
        where: {
            userId: studentId
        }
    });
    return completedCount;
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

// set lesson as completed
const createLessonProgress = async (studentId: string, lessonId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            userId: studentId,
            courseId: lesson.courseId
        }
    });

    if (!isEnrolled) {
        throw new Error("User not enrolled in this course");
    }

    return await prisma.lessonProgress.create({
        data: {
            userId: studentId,
            lessonId
        }
    });
};


// get next lesson order(position)
const getNextLessonToContinue = async (studentId: string, courseId: string) => {
    const lessons = await prisma.lesson.findMany({
        where: { courseId },
        orderBy: { position: "asc" }
    });

    const completedLessons = await prisma.lessonProgress.findMany({
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

    const completedSet = new Set(completedLessons.map(l => l.lessonId));

    const nextLesson = lessons.find(lesson => !completedSet.has(lesson.id));

    return nextLesson;
};

export { getCoursesCount, getCompletedLessonsCount, getCourses, createEnrollment, getStudentCourses, getNextLessonToContinue, createLessonProgress }