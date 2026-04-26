'use server'
import prisma from "@/lib/prisma"
import { CreateCourse, EditCourse, EditLesson } from "@/types/course";

// ------------------------------------dashboard page------------------------------------
// count of all instrutor courses
const getCoursesCount = async (instructorId: string) => {
    const coursesCount = await prisma.course.count({
        where: {
            instructorId
        }
    });
    return coursesCount;
};

// count of all students enrolled in all instructor courses
const getStudentsCount = async (instructorId: string) => {
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
const getLessonsCount = async (instructorId: string) => {
    const studentsCount = await prisma.lesson.count({
        where: {
            course: {
                instructorId
            }
        }
    });
    return studentsCount;
};


// ------------------------------------Create Page------------------------------------
const createCourse = async (course: CreateCourse) => {
    const createdCourse = await prisma.course.create({ data: course });
    return createdCourse;
}

// ------------------------------------My Courses Page------------------------------------
const getCourses = async (instructorId: string) => {
    const courses = await prisma.course.findMany({
        where: {
            instructorId
        }
    })
    return courses;
}

const editCourse = async (instructorId: string, courseId: string, course: EditCourse) => {
    // if condition matched returns true
    // to make sure that course owned by instructir
    const isFound = await prisma.course.findFirst({
        where: {
            id: courseId,
            instructorId
        }
    });

    if (!isFound)
        throw new Error('Course not found');

    const editedCourse = await prisma.course.update({
        where: {
            id: courseId
        },
        data: course
    });
    return editedCourse;
}

const deleteCourse = async (instructorId: string, courseId: string) => {
    const isFound = await prisma.course.findFirst({
        where: {
            id: courseId,
            instructorId
        }
    });

    if (!isFound)
        throw new Error('Course not found');

    const deletedCourse = await prisma.course.delete({
        where: {
            id: courseId
        }
    })
    return deletedCourse;
}

// ------------------------------------Course page | lesson page ------------------------------------
// user --> course --> lesson
const deleteLesson = async (instructorId: string, lessonId: string) => {
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
        throw new Error('Lesson not found');

    if (lesson.course.instructorId !== instructorId)
        throw new Error("Not authorized to delete this lesson");

    const deletedLesson = await prisma.lesson.delete({
        where: {
            id: lessonId
        }
    })

    return deletedLesson;
}


const editLesson = async (instructorId: string, lessonId: string, data: EditLesson) => {
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
        throw new Error("Not authorized to edit this lesson");

    const editedLesson = await prisma.lesson.update({
        where: {
            id: lessonId
        },
        data: data,
    });

    return editedLesson;
}


export { getCoursesCount, getStudentsCount, getLessonsCount, createCourse, getCourses, editCourse, deleteCourse, deleteLesson, editLesson }