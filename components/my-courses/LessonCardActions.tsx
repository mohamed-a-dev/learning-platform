'use client'
import React, { useState } from 'react'
import EditLessonModal from './EditLessonModal';
import { Lesson } from '@/types/course';
import { displayError, displaySuccess } from '@/lib/toast';
import { deleteLessonAction } from '@/actions/instructor-courses-actions';
import WatchVideoModal from './WatchVideoModal';
import { createLessonCompletedAction, deleteLessonCompletedAction } from '@/actions/student-courses-actions';

export default function LessonCardActions({ lesson, role, isCompleted }: { lesson: Lesson, role: string, isCompleted: boolean }) {
    const [open, setOpen] = useState(false);
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const [pending, setPending] = useState(false);
    const [completed, setCompleted] = useState(isCompleted);

    const getYouTubeId = () => {
        const regex =
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/;

        const match = lesson.videoUrl.match(regex);
        return match ? match[1] : null;
    }

    const handleDelete = async () => {
        setPending(true);

        const { success, message } = await deleteLessonAction(lesson.id);
        if (!success)
            displayError(message, lesson.id);
        else
            displaySuccess('Deleted', lesson.id);

        setPending(false);
    }

    const handleToggleCompleted = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPending(true);

        const checked = e.target.checked;

        const { success, message } = checked ? await createLessonCompletedAction(lesson.id) : await deleteLessonCompletedAction(lesson.id);

        if (!success)
            displayError(message, lesson.id);
        else {
            setCompleted(checked ? true : false);
            displaySuccess(`Lesson marked as ${checked ? 'Uncompleted' : 'Completed'}`, lesson.id);
        }

        setPending(false);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => setOpenVideoModal(true)}
                        className="cursor-pointer text-blue-600 text-sm font-medium hover:underline duration-300"
                    >
                        ▶ Watch Video
                    </button>
                </div>

                {
                    role === 'instructor'
                        ?
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setOpen(true)}
                                className="text-sm px-3 py-1.5 cursor-pointer rounded-md bg-blue-500 text-white hover:bg-blue-600 active:scale-80 duration-150"
                            >
                                Edit
                            </button>

                            <button
                                disabled={pending}
                                onClick={handleDelete}
                                className="text-sm px-3 py-1.5 cursor-pointer rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed active:scale-80 duration-150"
                            >
                                Delete
                            </button>
                        </div>
                        :
                        <div className="flex items-center justify-between  rounded border border-gray-200 bg-gray-50 px-3 py-1">

                            <div className="flex items-center gap-2">
                                <input
                                    id={lesson.id}
                                    checked={completed}
                                    type="checkbox"
                                    disabled={pending}
                                    className="h-4 w-4 accent-blue-600 cursor-pointer disabled:opacity-50"
                                    onChange={handleToggleCompleted}
                                />

                                <label
                                    htmlFor={lesson.id}
                                    className={`text-sm select-none ${pending ? "text-gray-400" : "text-gray-600 cursor-pointer"
                                        }`}
                                >
                                    Mark as completed
                                </label>
                            </div>

                            {/* Spinner */}
                            {pending && (
                                <div className="flex items-center ml-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                </div>
                            )}
                        </div>

                }
            </div>
            <EditLessonModal open={open} onClose={() => setOpen(false)} lesson={lesson} />
            <WatchVideoModal openVideoModal={openVideoModal} onClose={() => setOpenVideoModal(false)} videoId={getYouTubeId()} title={lesson.title} />
        </>
    )
}
