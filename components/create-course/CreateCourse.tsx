'use client'
import { createCourseAction } from '@/actions/instructor-courses-actions';
import { displayError, displaySuccess } from '@/lib/toast';
import { Session } from 'next-auth';
import { useRef, useState } from 'react';

export default function CreateCourse({ session }: { session: Session }) {
    const [pending, setPending] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);
    const { id: instructorId } = session.user;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setPending(true);

        const formData = new FormData(e.target);
        formData.append('instructorId', instructorId!);

        const response = await createCourseAction(formData);
        const { success, message } = response;

        if (!success) {
            setPending(false);
            displayError(message, 'updateUser');
            return;
        }

        formRef.current?.reset();
        displaySuccess('Created Successfully', 'createCourse');
        setPending(false);
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='bg-white p-10 rounded-lg w-90 sm:w-150 shadow-xl space-y-5'
        >
            <h1 className='text-2xl font-bold tracking-tight'>Create New Course</h1>

            <main className='space-y-4'>
                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="title" className='font-semibold'>Course Title</label>
                    <input
                        id='title'
                        type="text"
                        name="title"
                        disabled={pending}
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                        placeholder='Title'
                    />
                </div>

                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="description" className='font-semibold'>Course Description</label>
                    <textarea
                        id='description'
                        name="description"
                        disabled={pending}
                        rows={4}
                        className='px-3 py-2 w-full border border-black/20 rounded-lg resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                        placeholder='Write course description...'
                    />
                </div>
            </main>

            <button
                type='submit'
                disabled={pending}
                className='w-full mt-5 cursor-pointer px-3 py-2 rounded-lg text-white text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed transition-colors duration-300'
            >
                Create Course
                <span className={`${pending ? 'inline-block ml-2 animate-pulse' : 'hidden'}`}>...</span>
            </button>
        </form>
    );
}