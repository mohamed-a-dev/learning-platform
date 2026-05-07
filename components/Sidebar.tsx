'use client'
import Link from 'next/link'
import { MdDashboard } from "react-icons/md";
import { FaBook, FaBookOpen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { closeSidebar, openSidebar } from '@/redux/features/sidebar/sidebarSlice';
import { useEffect } from 'react';



export default function Sidebar({ session }: { session: Session }) {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.sidebar.isOpen);
    const pathname = usePathname();
    const { role } = session.user;

    const instructorLinks = [
        { href: '/dashboard', name: 'dashboard', icon: <MdDashboard /> },
        { href: '/courses', name: 'my courses', icon: <FaBook /> },
        { href: '/create-course', name: 'create course', icon: <FaPlus /> },
        { href: '/settings', name: 'account settings', icon: <IoSettings /> },
    ]

    const studentLinks = [
        { href: '/dashboard', name: 'dashboard', icon: <MdDashboard /> },
        { href: '/browse-courses', name: 'browse courses', icon: <FaBookOpen /> },
        { href: '/courses', name: 'my courses', icon: <FaBook /> },
        { href: '/settings', name: 'account settings', icon: <IoSettings /> },
    ]

    const links = role === 'instructor' ? instructorLinks : studentLinks;

    const handleLink = () => {
        if (window.innerWidth < 1024) {
            dispatch(closeSidebar());
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                dispatch(closeSidebar());
            } else {
                dispatch(openSidebar());
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <aside className={`${isOpen ? 'w-full lg:w-64' : 'w-0'} fixed z-1 left-0 lg:sticky top-0 py-5 duration-200 whitespace-nowrap overflow-hidden
         h-screen flex flex-col justify-between
        bg-slate-900 text-white`}>
            <section>
                <Logo />
                <main className='flex flex-col justify-between'>
                    {
                        links.map((l, i) => {
                            const isActive = pathname.includes(l.href);
                            return (
                                <Link key={i} href={l.href}
                                    onClick={handleLink}
                                    className={`${isActive ? 'bg-white/15' : ''}
                                            group px-3 py-3 border-b border-white/20 flex gap-2
                                            items-center hover:bg-white/15 capitalize duration-300
                                            hover:pl-5
                                            `}
                                >
                                    <span className={`${isActive ? 'text-red-600' : ''} text-2xl`}>{l.icon}</span>
                                    {l.name}
                                </Link>
                            )
                        }
                        )
                    }
                </main>
            </section>

            <button onClick={() => signOut()} className='py-2 px-3 w-full lg:w-62 mx-auto flex justify-center  items-center hover:bg-white/20 duration-300 cursor-pointer gap-2 rounded-lg'>
                <span className='text-2xl'>
                    <AiOutlineLogout />
                </span>
                Sign Out
            </button>
        </aside>
    )
}
