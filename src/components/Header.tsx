"use client"
import routes from "@/routes/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";


const Header = () => {
    const pathName = usePathname();
    const router = useRouter();
    const headerPage = routes.find(route => route.path === pathName)?.header ?? false; 
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (showSkeleton && headerPage) {
        return (
            <header className="top-0 sticky shadow-lg bg-[var(--primary-color4)] z-1000">
                <div className="py-[1rem] flex items-center justify-between w-[80%] max-lg:w-[90%] mx-auto">
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-[1rem] max-md:gap-[0.2rem]">
                        <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
                <hr className="text-[var(--text-desable)] opacity-[0.8]" />
            </header>
        );
    }

    return (
        <>
            {headerPage ? (
                <header
                    className="top-0 sticky shadow-lg bg-[var(--primary-color4)] z-1000"
                >
                    <div
                        className="py-[1rem] flex items-center justify-between w-[80%] max-lg:w-[90%] mx-auto"
                    >
                        <h1
                            className="h1"
                        >
                            Naghz
                        </h1>
                        {!isAuthenticated ? (
                            <div
                                className="flex gap-[1rem] max-md:gap-[0.2rem]"
                            >
                                <Link
                                    className="max-[400px]:hidden button-secondary rounded-full"
                                    href="/auth/sign-in"
                                >
                                    sign-in
                                </Link>
                                <Link
                                    className="button-primary rounded-full"
                                    href="/auth/sign-up"
                                >
                                    Get started
                                </Link>
                            </div>
                        ) : (
                            <div
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                    <Link href="/dashboard/profile">
                                        <CgProfile 
                                            className="text-[3rem] max-md:text-[2rem]"
                                        />
                                    </Link>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            dir="rtl"
                                            initial={{ opacity: 0, height: 0}}
                                            animate={{ opacity: 1, height: 'auto'}}
                                            transition={{ duration: 0.3 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden absolute right-0 rounded-md min-w-[20vw] shadow-lg z-50 bg-[var(--bg-color)]"
                                        >
                                            <ul 
                                                className=""
                                            >
                                                {routes.filter(route => route.profilePage === true).map((route, index) => (
                                                    <li
                                                        className="text-[1.4rem] max-md:text-[1.2rem] px-6 py-4 hover:bg-[var(--hover-color)] hover:cursor-pointer"
                                                        key={index}
                                                    >
                                                        <Link
                                                            href={route.path}
                                                        >
                                                            {route.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                    <hr className="text-[var(--text-desable)] opacity-[0.8]" />
                </header>
            ) : (
                <header
                    className="top-0 sticky bg-[var(--bg-color)] z-1000 px-[1.8rem] py-[1rem]"
                >
                    <IoArrowBackCircleOutline 
                        onClick={() => router.back()}
                        className="text-[4rem] text-[var(--accent-color1)] rounded-full hover:bg-[var(--accent-color1)] hover:text-[var(--primary-color4)] cursor-pointer transition-all duration-300"
                    />
                </header>
            )}
        </>
    )
}

export default Header;