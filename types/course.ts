export interface CreateCourse {
    title: string;
    description: string;
    instructorId: string;
}

export interface EditCourse {
    title: string;
    description: string;
}

export interface CreateLesson {
    title: string;
    videoUrl: string;
    courseId: string;
}


export interface EditLesson {
    title: string;
    videoUrl: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    instructorId: string;
    // optional
    instructor?: {
        name: string;
    };

    _count?: {
        lessons: number;
    };
}

export interface Lesson {
    id: string;
    title: string;
    videoUrl: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: string;
    // populated
    courseTitle: string;
}