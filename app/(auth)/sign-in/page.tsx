import LoginForm from '@/components/auth/loginForm'
import Link from 'next/link'

const SignIn = async () => {

    return (
        <section className='text-black min-h-screen'>
            <main className='p-5 flex justify-center items-center gap-10 min-h-screen text-center'>
                <article className="w-120 mx-auto p-8 rounded-xl border border-gray-200 shadow-sm bg-linear-to-b from-black/5 to-white">
                    <h1 className='text-3xl tracking-tight font-semibold mb-5'>Sign In to Learnifya</h1>
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