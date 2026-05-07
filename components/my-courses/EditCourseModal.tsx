'use client';
import { useState } from "react";
import { Course } from "@/types/course";
import { editCourseAction } from "@/actions/instructor-courses-actions";
import { displayError, displaySuccess } from "@/lib/toast";

export default function EditCourseModal({ open, onClose, course }: { open: Boolean, onClose: () => void, course: Course }) {
    const [pending, setPending] = useState(false);
    const { title, description, id: courseId, instructorId } = course;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);

        const formData = new FormData(e.currentTarget);
        const editCourseData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        }

        const { success, message } = await editCourseAction(courseId, editCourseData);

        if (success) {
            onClose();
            displaySuccess('Updated', 'updateCourse');
        }
        else
            displayError(message, message);

        setPending(false);
    }

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">

                    <div className="bg-white w-90 sm:w-120 p-5 rounded-lg shadow-lg">

                        <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Title */}
                            <div className='flex flex-col items-start gap-1'>
                                <label htmlFor="title" className='font-semibold'>Course Title</label>
                                <input
                                    name="title"
                                    defaultValue={title}
                                    placeholder="Course title"
                                    className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                                />
                            </div>

                            {/* Description */}

                            <div className='flex flex-col items-start gap-1'>
                                <label htmlFor="description" className='font-semibold'>Course Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={description}
                                    placeholder="Course description"
                                    rows={4}
                                    className='px-3 py-2 w-full border border-black/20 resize-none rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 cursor-pointer duration-150 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="flex-1 cursor-pointer duration-150 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white rounded-lg"
                                >
                                    Save<span className={`${pending ? 'visible' : 'invisible'}`}>...</span>
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </>
    );
}