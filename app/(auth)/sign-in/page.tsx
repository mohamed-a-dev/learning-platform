import LoginForm from '@/components/auth/loginForm'
import Link from 'next/link'

const SignIn = async () => {
    
    return (
        <section className='text-black min-h-screen'>
            <main className='flex justify-center items-center gap-10 min-h-screen text-center'>
                <article className='p-5 border border-black'>
                    <h1 className='text-3xl mb-5'>Sign In</h1>
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