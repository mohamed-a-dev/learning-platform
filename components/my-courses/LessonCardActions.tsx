'use client'
import React, { useState } from 'react'
import EditLessonModal from './EditLessonModal';
import { Lesson } from '@/types/course';
import { displayError, displaySuccess } from '@/lib/toast';
import { deleteLessonAction } from '@/actions/instructor-courses-actions';
import WatchVideoModal from './WatchVideoModal';

export default function LessonCardActions({ lesson, role }: { lesson: Lesson, role: string }) {
    const [open, setOpen] = useState(false);
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const [pending, setPending] = useState(false);

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
            displayError(message, message);
        else
            displaySuccess('Deleted', 'DeleteLesson');

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
                    &&
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
                }
            </div>
            <EditLessonModal open={open} onClose={() => setOpen(false)} lesson={lesson} />
            <WatchVideoModal openVideoModal={openVideoModal} onClose={() => setOpenVideoModal(false)} videoId={getYouTubeId()} title={lesson.title} />
        </>
    )
}
