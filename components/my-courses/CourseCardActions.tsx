'use client'

import { deleteCourseAction } from "@/actions/instructor-courses-actions";
import { displayError, displaySuccess } from "@/lib/toast";
import { Course } from "@/types/course"
import { use, useState } from "react";
import EditCourseModal from "./EditCourseModal";
import Link from "next/link";
import CourseEnrollToggleButton from "./CourseEnrollToggleButton";

export default function CourseCardActions({ course, role, isEnrolled }: { course: Course, role: string, isEnrolled: Boolean }) {
    const [pending, setPending] = useState(false);
    const [open, setOpen] = useState(false); // for edit modal
    const { id: courseId } = course;

    const handleDelete = async () => {
        setPending(true);
        const response = await deleteCourseAction(courseId);
        const { success, message } = response;

        if (success)
            displaySuccess('Deleted', 'deleteCourse');
        else
            displayError(message, 'deleteCourse');

        setPending(false);
    }

    if (role === 'instructor')
        return (
            <div className="flex items-center gap-2 mt-auto">
                <Link
                    className="flex-1 active:scale-80 text-center cursor-pointer px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                    href={`/${courseId}`}
                >
                    View
                </Link>

                <button disabled={pending}
                    onClick={() => setOpen(true)}
                    className="flex-1 active:scale-80 cursor-pointer disabled:cursor-not-allowed px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900 text-white rounded-lg transition"
                >
                    Edit
                </button>

                <button disabled={pending} onClick={handleDelete}
                    className="flex-1 active:scale-80 cursor-pointer px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg transition"
                >
                    Delete
                </button>

                <EditCourseModal course={course} onClose={() => setOpen(false)} open={open} />
            </div>
        )

    else if (role === 'student')
        return (
            <div className="flex items-center gap-2 mt-auto">
                <Link
                    className="flex-1 active:scale-80 text-center cursor-pointer px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                    href={`/${courseId}`}
                >
                    View
                </Link>

                <CourseEnrollToggleButton courseId={courseId} isEnrolled={isEnrolled} />
            </div>
        )


    return <p className="text-4xl text-center">You are not authorized...</p>
}
