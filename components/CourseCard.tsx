import React from 'react'
import CourseCardActions from './my-courses/CourseCardActions'
import { Course } from '@/types/course'

type Props = {
    role: string,
    course: Course,
    isEnrolled: boolean
}

export default function CourseCard({ course, role, isEnrolled }: Props) {
    return (

        <div
            key={course.id}
            className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-lg duration-300"
        >
            <h2 className="text-lg font-semibold mb-1 capitalize">
                {course.title}
            </h2>

            {/* student */}
            {
                role === 'student' &&
                <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Instructor: </span>
                    <span className="text-gray-500 capitalize">
                        {course.instructor?.name || "Unknown"}
                    </span>
                </p>
            }

            <p className="text-black/80 mb-4 line-clamp-3 capitalize">
                {course.description}
            </p>

            <div className="mb-3 flex justify-between items-center">
                <span className="text-sm text-black/70">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                </span>

                <span className="text-sm text-black/70">
                    Updated: {new Date(course.updatedAt).toLocaleDateString()}
                </span>
            </div>


            {/* Hybrid */}
            <CourseCardActions course={course} role={role!} isEnrolled={isEnrolled
                
            } />
        </div>
    )
}
