import { auth } from "@/auth";
import { redirect } from "next/navigation";

const redirectIfAuthenticated = async () => {
    const session = await auth();
    if (session)
        redirect('/dashboard');
}

export default redirectIfAuthenticated