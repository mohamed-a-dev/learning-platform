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
    const studentsCount = await prisma.enrollment.count({
        where: {
            course: {
                instructorId
            }
        }
    });
    return studentsCount;
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
    createCourse,
    getCourses,
    editCourse,
    deleteCourse,
    // getCourse,
    // getCourseLessons,
    createLesson,
    deleteLesson,
    editLesson
}