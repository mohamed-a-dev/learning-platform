import { auth } from "@/auth";
import { redirect } from "next/navigation";

const requireAuth = async () => {
    const session = await auth();
    
    if (!session)
        redirect('/sign-in');

    return session;
}

export default requireAuth