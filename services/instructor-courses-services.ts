'use server'
import { auth } from "@/auth";
import { assertRole, getSessionUserInfo } from "@/lib/authorization";
import prisma from "@/lib/prisma"
import { CreateCourse, CreateLesson, EditCourse, EditLesson } from "@/types/course";

// ------------------------------------dashboard page------------------------------------
// count of all instrutor courses
const getCoursesCount = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const coursesCount = await prisma.course.count({
        where: {
            instructorId
        }
    });
    return coursesCount;
};

// count of all students enrolled in all instructor courses
const getStudentsCount = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    // 1. نجيب كل كورسات المدرس
    const courses = await prisma.course.findMany({
        where: { instructorId },
        select: { id: true },
    });

    const courseIds = courses.map(c => c.id);

    // enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: {
            courseId: {
                in: courseIds,
            },
        },
        select: {
            userId: true,
        },
    });

    // unique students
    const uniqueStudents = new Set(enrollments.map(e => e.userId));

    return uniqueStudents.size;
};

// count of all instructor lessons 
const getLessonsCount = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const lessonsCount = await prisma.lesson.count({
        where: {
            course: {
                instructorId
            }
        }
    });
    return lessonsCount;
};


const getStudentsGrowth = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const today = new Date();

    // نجيب بداية كل يوم من آخر 7 أيام
    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
    });

    // كل كورسات المدرس
    const courses = await prisma.course.findMany({
        where: {
            instructorId,
        },
        select: {
            id: true,
        },
    });

    const courseIds = courses.map((c) => c.id);

    // كل enrollments الخاصة بالكورسات دي
    const enrollments = await prisma.enrollment.findMany({
        where: {
            courseId: {
                in: courseIds,
            },
            createdAt: {
                gte: days[0],
            },
        },
        select: {
            createdAt: true,
        },
    });

    // نحسب لكل يوم
    const result = days.map((day, index) => {
        const nextDay = days[index + 1] || new Date();

        const count = enrollments.filter((enr) => {
            return (
                enr.createdAt >= day &&
                enr.createdAt < nextDay
            );
        }).length;

        const label = day.toLocaleDateString("en-US", {
            weekday: "short",
        });

        return {
            name: label,
            students: count,
        };
    });

    return result;

}

const getCoursesEnrollments = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const courses = await prisma.course.findMany({
        where: {
            instructorId,
        },
        include: {
            enrollments: true,
        },
    });

    return courses.map((course) => ({
        name: course.title,
        enrollments: course.enrollments.length,
    }));
};


// ----------------- my-students page ---------------------
const getStudents = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const enrollments = await prisma.enrollment.findMany({
        where: {
            course: {
                instructorId,
            },
        },

        distinct: ["userId"],

        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    const students = enrollments.map((enrollment) => ({
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
    }));

    return students;
}

// ------------------------------------Create Page------------------------------------
const createCourse = async (course: CreateCourse) => {
    // check if user is instructor
    await assertRole('instructor');

    // يعني ممكن حد يبعت instructorId مختلف جوه course ويعمل hijack 😬
    // لازم تاخد الـ id من الـ session وتحقنه بنفسك
    const { id: instructorId } = await getSessionUserInfo();

    const createdCourse = await prisma.course.create({ data: { ...course, instructorId: instructorId! } });
    return createdCourse;
}

// ------------------------------------My Courses Page------------------------------------
const getCourses = async () => {
    const { id: instructorId } = await getSessionUserInfo();

    const courses = await prisma.course.findMany({
        where: {
            instructorId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return courses;
}

const editCourse = async (courseId: string, course: EditCourse) => {
    // if condition matched returns true
    // to make sure that course owned by instructor
    const { id: instructorId } = await getSessionUserInfo();

    const isFound = await prisma.course.findFirst({
        where: {
            id: courseId,
            instructorId
        }
    });

    console.log(isFound);


    if (!isFound)
        throw { code: "P2025" };

    const editedCourse = await prisma.course.update({
        where: {
            id: courseId
        },
        data: course
    });
    return editedCourse;
}

const deleteCourse = async (courseId: string) => {
    const { id: instructorId } = await getSessionUserInfo();

    const isFound = await prisma.course.findFirst({
        where: {
            id: courseId,
            instructorId
        }
    });

    if (!isFound)
        throw { code: "P2025" };

    const deletedCourse = await prisma.course.delete({
        where: {
            id: courseId
        }
    })
    return deletedCourse;
}

// ------------------------------------Course page | lesson page ------------------------------------
// user --> course --> lesson

// const getCourse = async (courseId: string) => {
//     const { id: instructorId } = await getSessionUserInfo();


//     const course = await prisma.course.findUnique({
//         where: {
//             id: courseId
//         },
//     });

//     if (!course)
//         throw { code: "P2025" };

//     if (course.instructorId !== instructorId)
//         throw { code: "FORBIDDEN", message: "Not authorized to watch this course" };

//     return course;
// }

// const getCourseLessons = async (courseId: string) => {
//     const { id: instructorId } = await getSessionUserInfo();

//     const courseWithLessons = await prisma.course.findFirst({
//         where: {
//             id: courseId,
//             instructorId,
//         },
//         include: {
//             lessons: true
//         }
//     });

//     if (!courseWithLessons)
//         throw { code: "P2025" };

//     const lessons = courseWithLessons?.lessons.map((lesson) => ({ ...lesson, courseTitle: courseWithLessons.title }));

//     return lessons;

// }

const createLesson = async (lessonData: CreateLesson) => {
    // check if user is instructor
    await assertRole('instructor');

    // يعني ممكن حد يبعت instructorId مختلف جوه course ويعمل hijack 😬
    // لازم تاخد الـ id من الـ session وتحقنه بنفسك
    const { id: instructorId } = await getSessionUserInfo();

    const { courseId } = lessonData;

    // make sure ownership to instructor
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            instructorId
        }
    });

    if (!course)
        throw { code: "FORBIDDEN", message: "Not authorized to create this lesson" };


    const lesson = await prisma.lesson.findFirst({
        where: {
            courseId,
        },
        select: {
            position: true
        },
        orderBy: {
            position: "desc"
        }
    });

    const maxPosition = lesson ? lesson.position : 0;
    const nextPosition = maxPosition + 1;

    const createdLesson = await prisma.lesson.create({
        data: {
            ...lessonData,
            position: nextPosition
        }
    });
    return createdLesson;

}

const deleteLesson = async (lessonId: string) => {
    const { id: instructorId } = await getSessionUserInfo();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select: {
            course: {
                select: {
                    instructorId: true
                }
            }
        }
    });

    if (!lesson)
        throw { code: "P2025" };

    if (lesson.course.instructorId !== instructorId)
        throw { code: "FORBIDDEN", message: "Not authorized to delete this lesson" };

    const deletedLesson = await prisma.lesson.delete({
        where: {
            id: lessonId
        }
    })

    return deletedLesson;
}

const editLesson = async (lessonId: string, data: EditLesson) => {
    const { id: instructorId } = await getSessionUserInfo();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select: {
            course: {
                select: {
                    instructorId: true
                }
            }
        }
    });

    if (!lesson)
        throw new Error('Lesson Not found');

    if (lesson.course.instructorId !== instructorId)
        throw { code: "FORBIDDEN", message: "Not authorized to edit this lesson" };

    const editedLesson = await prisma.lesson.update({
        where: {
            id: lessonId
        },
        data: data,
    });

    return editedLesson;
}



export {
    getCoursesCount,
    getStudentsCount,
    getLessonsCount,
    getStudentsGrowth,
    getCoursesEnrollments,
    getStudents,
    createCourse,
    getCourses,
    editCourse,
    deleteCourse,
    // getCourse,
    // getCourseLessons,
    createLesson,
    deleteLesson,
    editLesson,
}