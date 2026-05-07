import { auth } from '@/auth';
import CreateCourse from '@/components/create-course/CreateCourse'

export default async function page() {
    const session = await auth();
    return (
        <section className='h-full flex flex-col justify-center items-center'>
            <CreateCourse session={session!} />
        </section>
    )
}
