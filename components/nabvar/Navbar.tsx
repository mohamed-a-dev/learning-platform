'use client'
import { useAppDispatch } from "@/redux/hooks";
import { toggleSidebar } from "@/redux/features/sidebar/sidebarSlice";
import { HiBars3 } from "react-icons/hi2";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLogout } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ session }: { session: Session }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useAppDispatch();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { name, email, role, gender } = session.user;
    const imageSrc = gender === 'male' ? '/man.webp' : '/woman.webp';

    // 👇 close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="px-5 py-2 sticky top-0 bg-white flex items-center justify-between">
            <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-1 text-4xl cursor-pointer hover:bg-blue-600 hover:text-white rounded duration-200"
            >
                <HiBars3 />
            </button>

            {/* button */}
            <button
                ref={buttonRef}
                onClick={() => setShowDropdown(prev => !prev)}
                className="flex gap-3 cursor-pointer"
            >
                <Image src={imageSrc} width={50} height={50} alt="user" />

                <div className="flex flex-col">
                    <p className="capitalize text-xl">{name}</p>
                    <span className="capitalize text-sm text-gray-500 font-semibold">{role}</span>
                </div>
            </button>

            {/* dropdown */}
            <main
                ref={dropdownRef}
                className={`${showDropdown ? 'visible opacity-100' : 'invisible opacity-0'} flex duration-300 absolute shadow-xl right-5 w-75 top-full bg-white flex-col rounded-b-lg overflow-hidden`}
            >
                <div className="py-3 px-3 mb-3 text-center border-b border-gray-300 bg-slate-200">
                    <p className="text-xl">{name}</p>
                    <p className="text-sm capitalize">{role}</p>
                    <span className="text-black/70 text-sm">{email}</span>
                </div>

                <Link href="/settings" onClick={() => setShowDropdown(false)} className="py-2 px-3 w-full hover:text-red-600 hover:bg-white/20 text-start flex items-center gap-2 duration-300">
                    <IoSettings className="text-xl" />
                   Account Settings
                </Link>

                <button
                    onClick={() => signOut()}
                    className="py-2 px-3 text-start flex items-center hover:text-red-600 hover:bg-white/20 cursor-pointer gap-2 duration-300"
                >
                    <AiOutlineLogout className="text-xl" />
                    Sign Out
                </button>
            </main>
        </nav>
    );
}