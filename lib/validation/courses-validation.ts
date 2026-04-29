import { z } from "zod";

export const createCourseSchema = z.object({
    title: z.string().min(3, "Title too short").max(100, "Title too long"),
    description: z.string().min(10, "Description too short").max(500, "Description too long"),
    instructorId: z.uuid(),
});


export const editCourseSchema = z.object({
    title: z.string().min(3, "Title too short").max(100, "Title too long"),
    description: z.string().min(10, "Description too short").max(500, "Description too long"),
});


export const editLessonSchema = z.object({
    title: z.string().min(2, "Title too short").max(100, "Title too long"),
    videoUrl: z.url("Invalid video URL"),
});