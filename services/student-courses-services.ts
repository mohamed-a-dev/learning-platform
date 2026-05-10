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


const getCourseProgress = async () => {
    const { id: studentId } = await getSessionUserInfo();

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: studentId,
        },
        include: {
            course: {
                include: {
                    lessons: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });

    // 2. كل الدروس المكتملة للطالب مرة واحدة (performance optimization)
    const completedLessons = await prisma.lessonCompleted.findMany({
        where: {
            userId: studentId,
        },
        select: {
            lessonId: true,
        },
    });

    const completedSet = new Set(
        completedLessons.map((l) => l.lessonId)
    );

    // 3. حساب progress لكل كورس
    return enrollments.map((enrollment) => {
        const course = enrollment.course;

        const totalLessons = course.lessons.length;

        const completedCount = course.lessons.filter((lesson) =>
            completedSet.has(lesson.id)
        ).length;

        const progress =
            totalLessons === 0 ? 0 : (completedCount / totalLessons) * 100;

        return {
            name: course.title,
            progress: Number(progress.toFixed(2)),
        };
    });
}

const getLessonsProgress = async () => {
    const { id: studentId } = await getSessionUserInfo();

    // كل الكورسات اللي الطالب مشترك فيها
    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: studentId,
        },
        include: {
            course: {
                include: {
                    lessons: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    // كل الدروس المكتملة للطالب
    const completedLessons = await prisma.lessonCompleted.findMany({
        where: {
            userId: studentId,
        },
        select: {
            lessonId: true,
        },
    });

    const completedSet = new Set(
        completedLessons.map((l) => l.lessonId)
    );

    let totalLessons = 0;
    let completedCount = 0;

    enrollments.forEach((enrollment) => {
        const lessons = enrollment.course.lessons;

        totalLessons += lessons.length;

        completedCount += lessons.filter((l) =>
            completedSet.has(l.id)
        ).length;
    });

    const remainingCount = totalLessons - completedCount;

    return [
        {
            name: "Completed",
            value: completedCount,
        },
        {
            name: "Remaining",
            value: remainingCount,
        },
    ];
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
    getCourseProgress,
    getLessonsProgress,
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