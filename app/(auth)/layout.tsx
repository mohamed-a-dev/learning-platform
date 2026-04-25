import redirectIfAuthenticated from '@/lib/auth/redirect-if-auth';
import React from 'react'

const layout = async ({ children }: any) => {
    await redirectIfAuthenticated();

    return (
        <div>{children}</div>
    )
}

export default layout