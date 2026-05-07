import { auth } from "@/auth";
import Navbar from "@/components/nabvar/Navbar";
import Sidebar from "@/components/Sidebar";
import requireAuth from "@/lib/auth/require-auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await requireAuth();

    return (
        <div className="flex">
            <Sidebar session={session} />

            <div className="flex-1 flex flex-col">
                <Navbar session={session} />

                <main className="bg-gray-100 min-h-[calc(100%-66px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}