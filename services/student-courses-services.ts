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

const getCompletedCoursesCount = async () => {
    const { id: userId } = await getSessionUserInfo();

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    lessons: true,
                },
            },
        },
    });

    const completedLessons = await prisma.lessonCompleted.findMany({
        where: { userId },
    });

    const completedSet = new Set(
        completedLessons.map((l) => l.lessonId)
    );


    const completedCoursesCount = enrollments.filter((enrollment) => {
        const courseLessons = enrollment.course.lessons;

        if (courseLessons.length === 0) return false;

        return courseLessons.every((lesson) =>
            completedSet.has(lesson.id)
        );
    }).length;

    return completedCoursesCount;
};

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

    const [deletedEnrollment, deletedCompletedLessons] = await prisma.$transaction([
        prisma.enrollment.delete({
            where: {
                userId_courseId: {
                    userId: studentId!,
                    courseId,
                },
            },
        }),

        prisma.lessonCompleted.deleteMany({
            where: {
                userId: studentId,
                lesson: {
                    courseId,
                },
            },
        }),
    ]);
    return deletedEnrollment;
}

// ------------------------------------My Courses page------------------------------------
const getStudentCourses = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: studentId
        },

        orderBy: {
            createdAt: 'desc'
        },

        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    const courses = enrollments.map((obj) => obj.course);

    return courses;
};

// ------------------------------------Course page------------------------------------
// mark lesson as completed
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

// mark lesson as uncompleted
const deleteLessonCompleted = async (lessonId: string) => {
    const { id: studentId } = await getSessionUserInfo();
    const unCompletedLesson = await prisma.lessonCompleted.deleteMany({
        where: {
            userId: studentId!,
            lessonId,
        },
    });

    return unCompletedLesson;
};

// get all lessons completeion status
const getLessonsCompletionStatus = async (courseId: string) => {
    const { id: studentId } = await getSessionUserInfo();

    const completedLessons = await prisma.lessonCompleted.findMany({
        where: {
            userId: studentId!,
            lesson: {
                courseId,
            },
        },
        select: {
            lessonId: true,
        },
    });

    const lessonCompletionMap: Record<string, boolean> = {};

    completedLessons.forEach((l) => {
        lessonCompletionMap[l.lessonId] = true;
    });

    return lessonCompletionMap;
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
    getCompletedCoursesCount,
    getBrowseCourses,
    createEnrollment,
    getEnrollment,
    deleteEnrollment,
    getStudentCourses,
    createLessonCompleted,
    deleteLessonCompleted,
    getLessonsCompletionStatus,
    getNextLessonToContinue,
}