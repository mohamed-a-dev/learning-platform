"use client";
import { registerUser } from "@/actions/auth/auth-actions";
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
            displaySuccess('Registered Successfully', 'RegisterUser')
            formRef.current?.reset();
        }

    }, [state.timestamp])

    return (
        <form ref={formRef} className="space-y-4 w-100" onSubmit={handleSubmit}>

            <input
                name="name"
                placeholder="Full name"
                className="border border-black/30 rounded p-2 w-full"
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                className="border border-black/30 rounded p-2 w-full"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                className="border border-black/30 rounded p-2 w-full"
            />

            <select defaultValue={'role'} name="role" className="border border-black/30 rounded p-2 w-full">
                <option className="text-black" value="role" disabled hidden>Role</option>
                <option className="text-black" value="student">Student</option>
                <option className="text-black" value="instructor">Instructor</option>
            </select>

            <button
                type="submit"
                disabled={pending}
                className="px-8 py-2 rounded w-full bg-blue-600 text-white cursor-pointer"
            >
                Sign Up<span className={`${pending ? 'opacity-100' : 'opacity-0'}`}>...</span>
            </button>
        </form>
    );
}