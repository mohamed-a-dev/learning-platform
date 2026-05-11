'use server'
import { auth } from "@/auth";
import { errorHandler } from "@/lib/prismaErrors";
import { createCourseSchema, createLessonSchema, editCourseSchema, editLessonSchema } from "@/lib/validation/courses-validation";
import { getCourse } from "@/services/course-services";
import { createCourse, createLesson, deleteCourse, deleteLesson, editCourse, editLesson, getCourses, getCoursesCount, getCoursesEnrollments, getLessonsCount, getStudents, getStudentsCount, getStudentsGrowth } from "@/services/instructor-courses-services"
import { CreateLesson, EditCourse, EditLesson } from "@/types/course";
import { revalidatePath } from "next/cache";

const getCoursesCountAction = async () => {
    try {
        const coursesCount = await getCoursesCount();
        return { success: true, message: coursesCount };
    } catch (error: any) {
        return errorHandler(error); // default case in errorHandler
    }
}

const getStudentsCountAction = async () => {
    try {
        const studentsCount = await getStudentsCount();
        return { success: true, message: studentsCount };
    } catch (error: any) {
        return errorHandler(error); // default case in errorHandler
    }
}

const getLessonsCountAction = async () => {
    try {
        const lessonsCount = await getLessonsCount();
        return { success: true, message: lessonsCount };
    } catch (error: any) {
        return errorHandler(error);
    }
}


const getStudentsGrowthAction = async () => {
    try {
        const studentsGrowthList = await getStudentsGrowth();
        return { success: true, message: studentsGrowthList };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCoursesEnrollmentsAction = async () => {
    try {
        const coursesEnrollmentsList = await getCoursesEnrollments();
        return { success: true, message: coursesEnrollmentsList };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const createCourseAction = async (formData: FormData) => {
    const course = {
        title: String(formData.get('title')),
        description: String(formData.get('description')),
        instructorId: String(formData.get('instructorId')),
    };

    const result = createCourseSchema.safeParse(course);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", "), timestamp: Date.now() };

    try {
        const createdCourse = await createCourse(course);
        return { success: true, message: 'created successfully', timestamp: Date.now() };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getInstructorCoursesAction = async () => {
    try {
        const courses = await getCourses();
        return { success: true, message: courses, timestamp: Date.now() }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getCourseAction = async (courseId: string) => {
    try {
        const course = await getCourse(courseId);
        return { success: true, message: course, timestamp: Date.now() }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const getStudentsAction = async () => {
    try {
        const students = await getStudents();
        return { success: true, message: students }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const editCourseAction = async (courseId: string, course: EditCourse) => {
    const result = editCourseSchema.safeParse(course);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    try {
        const editedCourse = await editCourse(courseId, course);
        revalidatePath('/my-courses')
        return { success: true, message: editedCourse, timestamp: Date.now() }
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteCourseAction = async (courseId: string) => {
    try {
        const deletedCourse = await deleteCourse(courseId);
        revalidatePath("/my-courses");
        return { success: true, message: deletedCourse };
    } catch (error: any) {
        return errorHandler(error);
    }
}

// const getCourseLessonsAction = async (courseId: string) => {
//     try {
//         const lessons = await getCourseLessons(courseId);
//         return { success: true, message: lessons };
//     } catch (error) {
//         return errorHandler(error);
//     }
// }

const createLessonAction = async (lessonData: CreateLesson) => {
    const result = createLessonSchema.safeParse(lessonData);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    try {
        const lesson = await createLesson(lessonData);
        revalidatePath('/my-courses')
        return { success: true, message: lesson };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const deleteLessonAction = async (lessonId: string) => {
    try {
        const deletedLesson = await deleteLesson(lessonId);
        revalidatePath('/my-courses')
        return { success: true, message: deletedLesson };
    } catch (error: any) {
        return errorHandler(error);
    }
}

const editLessonAction = async (lessonId: string, data: EditLesson) => {
    const result = editLessonSchema.safeParse(data);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", ") };

    const session = await auth();
    const { id: instructorId } = session?.user!;


    try {
        const editedLesson = await editLesson(lessonId, data);
        revalidatePath('/my-courses');
        return { success: true, editedLesson };
    } catch (error: any) {
        return errorHandler(error);
    }
}

export {
    getCoursesCountAction,
    getStudentsCountAction,
    getLessonsCountAction,
    getStudentsGrowthAction,
    getCoursesEnrollmentsAction,
    getStudentsAction,
    createCourseAction,
    getInstructorCoursesAction,
    getCourseAction,
    editCourseAction,
    deleteCourseAction,
    // getCourseLessonsAction,
    createLessonAction,
    deleteLessonAction,
    editLessonAction,
}