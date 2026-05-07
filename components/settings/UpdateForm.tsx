'use client'
import { updateUserAction } from '@/actions/user-actions';
import { displayError, displaySuccess } from '@/lib/toast';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function UpdateForm({ session }: { session: Session }) {
    const { name, id: userId } = session.user;
    const [pending, setPending] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const { update } = useSession();
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setPending(true);

        const formData = new FormData(e.target);
        formData.append("userId", userId!);

        const response = await updateUserAction(formData);
        const { success, message } = response;

        if (!success) {
            setPending(false);
            displayError(message, 'updateUser');
            return;
        }

        formRef.current?.reset();

        const name = formData.get('name') as string;
        await updateSession(name);

        displaySuccess('Updated Successfully', 'updateUser');

        setPending(false);
    };

    const updateSession = async (name: string) => {
        await update({ name });
        router.refresh();
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='bg-white p-10 rounded-lg w-150 shadow-xl space-y-5'
        >
            <h1 className='text-2xl font-bold tracking-tight'>Update Account Info</h1>

            <main className='space-y-4'>
                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="name" className='font-semibold'>Name:</label>
                    <input
                        id='name'
                        type="text"
                        name="name"
                        disabled={pending}
                        defaultValue={name!}
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                    />
                </div>

                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="password" className='font-semibold'>Password:</label>
                    <input
                        id='password'
                        type="password"
                        name="password"
                        disabled={pending}
                        placeholder='New password'
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                    />
                </div>

                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="passwordConfirmation" className='font-semibold'>Confirm Password:</label>
                    <input
                        id='passwordConfirmation'
                        type="password"
                        name="passwordConfirmation"
                        disabled={pending}
                        placeholder='Confirm password'
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                    />
                </div>
            </main>

            <button
                type='submit'
                disabled={pending}
                className='w-full mt-5 px-3 py-2 rounded-lg text-white text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed transition-colors duration-300'
            >
                Confirm Changes
                <span className={`${pending ? 'inline-block ml-2 animate-pulse' : 'hidden'}`}>...</span>
            </button>
        </form>
    );
}