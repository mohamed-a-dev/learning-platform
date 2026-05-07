import Link from 'next/link'
import { FaGraduationCap } from "react-icons/fa6";

export default function Logo() {
    return (
        <Link href={'/dashboard'} className='mb-10 w-full text-3xl flex items-center justify-center gap-3'>
            <span className='text-5xl text-red-600'>
                <FaGraduationCap />
            </span>
            Learnifya
        </Link>
    )
}
