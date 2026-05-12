import React from 'react'

export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-black animate-spin" />

                <p className="text-lg text-gray-500 animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    )
}