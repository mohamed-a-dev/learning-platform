import LoginForm from '@/components/auth/loginForm'
import Link from 'next/link'

const SignIn = async () => {

    return (
        <section className='text-black min-h-screen'>
            <main className='flex justify-center items-center gap-10 min-h-screen text-center'>
                <article className="w-120 mx-auto p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h1 className='text-3xl tracking-tight font-semibold mb-5'>Sign In</h1>
                    <LoginForm />
                    <Link href={'/sign-up'} className='mt-2 inline-block underline opacity-70'>Create Account</Link>
                </article>

                {/* <article className='relative h-100 w-200 rounded overflow-hidden bg-red-100'> */}
                {/* <Image src={'/courses.webp'} fill alt='courses' /> */}
                {/* </article> */}
            </main>
        </section>
    )
}

export default SignIn