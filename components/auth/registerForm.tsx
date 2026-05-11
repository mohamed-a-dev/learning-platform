"use client";
import { registerUser } from "@/actions/auth-actions";
import { displaySuccess, displayError } from "@/lib/toast";
import { startTransition, useActionState, useEffect, useRef } from "react";

export default function RegisterForm() {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [state, formAction, pending] = useActionState(registerUser, { success: false, message: '', timestamp: Date.now() });

    const handleSubmit = function (e: any) {
        e.preventDefault();

        startTransition(() => {
            formAction(new FormData(e.target));
        });
    }

    useEffect(() => {
        if (state.message && !state.success)
            displayError(state.message, 'RegisterUser')

        if (state.success) {
            displaySuccess('Created Successfully', 'RegisterUser')
            formRef.current?.reset();
        }

    }, [state.timestamp])

    return (
        <form ref={formRef} className="space-y-5 w-100" onSubmit={handleSubmit}>

            <div className='flex flex-col items-start gap-1'>
                <label htmlFor="title" className='font-semibold'>Name</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                />
            </div>


            <div className='flex flex-col items-start gap-1'>
                <label htmlFor="title" className='font-semibold'>Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                />
            </div>


            <div className='flex flex-col items-start gap-1'>
                <label htmlFor="title" className='font-semibold'>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out'
                />
            </div>

            <select defaultValue={'role'} name="role" className="p-2 className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out">
                <option className="text-black" value="role" disabled hidden>Role</option>
                <option className="text-black" value="student">Student</option>
                <option className="text-black" value="instructor">Instructor</option>
            </select>

            <select defaultValue={'gender'} name="gender" className="p-2 className='px-3 py-2 w-full border border-black/20 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150 ease-in-out">
                <option className="text-black" value="gender" disabled hidden>Gender</option>
                <option className="text-black" value="male">Male</option>
                <option className="text-black" value="female">Female</option>
            </select>

            <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center items-center gap-1 cursor-pointer duration-150 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white rounded-lg"
            >
                <p>Sign Up</p>
                {
                    pending &&
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                }

            </button>
        </form>
    );
}