'use client'
import { createEnrollmentAction, deleteEnrollmentAction } from '@/actions/student-courses-actions';
import { displayError, displaySuccess } from '@/lib/toast';
import { usePathname } from 'next/navigation';
import { useState } from 'react'


export default function CourseEnrollToggleButton({ courseId, isEnrolled }: { courseId: string, isEnrolled: Boolean }) {
    const [pending, setPending] = useState(false);
    const pathname = usePathname();

    const toggleButtonName = !isEnrolled
        ? (pending ? "Enrolling..." : "Enroll Course")
        : (pending ? "Withdrawing..." : "Withdraw Course");

    const enrollToggleButtonStyle = pathname === '/my-courses' || pathname === '/browse-courses' ?
        'flex-1 active:scale-80 px-3 py-1.5 text-sm flex justify-center items-center gap-2 cursor-pointer bg-blue-600 disabled:bg-blue-900 text-white rounded-lg hover:bg-blue-700 duration-150'
        :
        'mt-5 md:mt-0 w-full md:w-auto active:scale-80 px-4 py-2 flex justify-center items-center gap-2 cursor-pointer bg-blue-600 disabled:bg-blue-900 text-white rounded-lg hover:bg-blue-700 duration-150'


    const handleToggleEnrollment = async () => {
        setPending(true);

        const { success, message } = !isEnrolled ? await createEnrollmentAction(courseId) : await deleteEnrollmentAction(courseId);

        if (success)
            displaySuccess(!isEnrolled ? "Enrolled" : "Unenrolled", message);
        else
            displayError(message, message);

        setPending(false);
    }

    return (
        <>
            <button
                disabled={pending}
                onClick={handleToggleEnrollment}
                className={enrollToggleButtonStyle}
            >
                {
                    pending &&
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                }

                {toggleButtonName}
            </button>
        </>
    )
}
