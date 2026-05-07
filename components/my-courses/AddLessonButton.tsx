'use client'
import { FaPlus } from 'react-icons/fa'
import AddLessonModal from './AddLessonModal'
import { useState } from 'react'

export default function AddLessonButton({courseId}:{courseId:string}) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="mt-5 md:mt-0 w-full md:w-auto active:scale-90 px-4 py-2 flex justify-center items-center gap-1 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 duration-150"
            >
                <span><FaPlus /></span> Add Lesson
            </button>
            <AddLessonModal open={open} onClose={() => setOpen(false)} courseId={courseId} />
        </>
    )
}
