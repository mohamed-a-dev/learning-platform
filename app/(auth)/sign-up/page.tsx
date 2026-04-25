import RegisterForm from '@/components/auth/registerForm'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SignUp = async () => {

    return (
        <section className='text-black min-h-screen'>
            <main className='flex justify-center items-center gap-10 min-h-screen text-center'>
                <article className='p-5 border border-black'>
                    <h1 className='text-3xl mb-5'>Sign Up</h1>
                    <RegisterForm />
                    <Link href={'/sign-in'} className='mt-2 inline-block underline opacity-70'>Have an account</Link>
                </article>

                {/* <article className='relative h-100 w-200 rounded overflow-hidden bg-red-100'> */}
                {/* <Image src={'/courses.webp'} fill alt='courses' /> */}
                {/* </article> */}
            </main>
        </section>
    )
}

export default SignUp