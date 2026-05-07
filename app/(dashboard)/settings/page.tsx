import { auth } from '@/auth'
import UpdateForm from '@/components/settings/UpdateForm'

export default async function page() {
    const session = await auth();
    return (
        <section className='h-full flex flex-col justify-center items-center'>
            <UpdateForm session={session!} />
        </section>
    )
}
