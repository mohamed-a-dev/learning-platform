'use client'
import { displayError } from '@/lib/toast';
import { loginSchema } from '@/lib/validation/auth-validation';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const LoginForm = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInput = (e: any) => {
        setForm((preForm) => ({ ...preForm, [e.target.name]: e.target.value }));
    }

    const hanleSubmit = async (e: any) => {
        e.preventDefault();
        // validation before calling db
        const result = loginSchema.safeParse(form);
        if (!result.success) {
            const message = result.error.issues.map(err => err.message).join(", ");
            return displayError(message, 'LoginForm');
        }

        setLoading(true);

        const response = await signIn("credentials", {
            ...form,
            redirect: false
        });

        setLoading(false);

        if (!response.error)
            router.push('/');

        if (response.code === "credentials")
            displayError('Wrong credentials', 'LoginForm')
    }

    return (
        <form className="space-y-4 w-100" onSubmit={hanleSubmit}>
            <input
                name="email"
                type="email"
                placeholder="Email"
                className="border border-black/30 rounded p-2 w-full"
                onChange={handleInput}
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                className="border border-black/30 rounded p-2 w-full"
                onChange={handleInput}
            />

            <button
                type="submit"
                // disabled={pending}
                className="px-8 py-2 w-full rounded bg-blue-600 text-white cursor-pointer"
            >
                Sign In
                <span className={`${loading ? 'opacity-100' : 'opacity-0'}`}>...</span>
            </button>
        </form>
    )
}

export default LoginForm