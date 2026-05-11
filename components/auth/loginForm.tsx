'use client'
import { displayError } from '@/lib/toast';
import { loginSchema } from '@/lib/validation/auth-validation';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const loadingStates = {
    SIGNIN: "signin",
    STUDENT: "student",
    INSTRUCTOR: "instructor",
} as const;

type LoadingState = "signin" | "student" | "instructor" | null;

const LoginForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState<LoadingState>(null);
    const router = useRouter();

    const handleInput = (e: any) => {
        setForm((preForm) => ({ ...preForm, [e.target.name]: e.target.value }));
    }

    const handleSignIn = async (email: string, password: string) => {
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false
        });


        if (!response.error)
            router.push('/');

        if (response.code === "credentials")
            displayError('Wrong credentials', 'LoginForm')
    }

    const hanleSubmit = async (e: any) => {
        e.preventDefault();
        // validation before calling db
        const result = loginSchema.safeParse(form);
        if (!result.success) {
            const message = result.error.issues.map(err => err.message).join(", ");
            return displayError(message, 'LoginForm');
        }

        setLoading(loadingStates.SIGNIN);

        await handleSignIn(form.email, form.password);

        setLoading(null);
    }


    const handleStudent = async () => {
        setLoading(loadingStates.STUDENT);
        await handleSignIn('user-1@gmail.com', '12345678');
        setLoading(null);
    }


    const handleInstructor = async () => {
        setLoading(loadingStates.INSTRUCTOR);
        await handleSignIn('mona@gmail.com', '12345678');
        setLoading(null);
    }

    return (
        <>
            <form className="space-y-5" onSubmit={hanleSubmit}>
                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="title" className='font-semibold'>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                        onChange={handleInput}
                    />
                </div>

                <div className='flex flex-col items-start gap-1'>
                    <label htmlFor="title" className='font-semibold'>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                        onChange={handleInput}
                    />
                </div>


                <button
                    type="submit"
                    disabled={loading === loadingStates.SIGNIN}
                    className="w-full flex justify-center items-center gap-1 cursor-pointer duration-150 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-lg"
                >
                    <p>Sign In</p>
                    {
                        loading === loadingStates.SIGNIN &&
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    }

                </button>

            </form>
            <div className='space-y-5 mt-5'>
                <button
                    type="button"
                    disabled={loading === loadingStates.STUDENT}
                    className="w-full flex justify-center items-center gap-2 cursor-pointer duration-200 px-3 py-2 text-sm font-medium bg-linear-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black disabled:from-slate-500 disabled:to-slate-700 disabled:cursor-not-allowed text-white shadow-md hover:shadow-xl rounded-lg"
                    onClick={handleStudent}
                >
                    <span>Student Demo</span>

                    {loading === loadingStates.STUDENT && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                </button>

                <button
                    type="button"
                    disabled={loading === loadingStates.INSTRUCTOR}
                    className="w-full flex justify-center items-center gap-2 cursor-pointer duration-150 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white rounded-lg"
                    onClick={handleInstructor}
                >
                    <span>Instructor Demo</span>

                    {loading === loadingStates.INSTRUCTOR && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                </button>
            </div>
        </>
    )
}

export default LoginForm