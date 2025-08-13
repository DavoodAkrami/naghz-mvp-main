"use client"
import routes from "@/routes/routes";
import { dashboardPages } from "@/routes/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import clsx from "clsx";
import SideBar from "./SideBar";
import { FaArrowRight } from "react-icons/fa6";




const Header = () => {
    const pathName = usePathname();
    const router = useRouter();
    const headerPage = routes.find(route => route.path === pathName)?.header ?? false; 
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [pathName]);

    
    if (showSkeleton && headerPage) {
        return (
            <header className="top-0 sticky shadow-lg bg-[var(--primary-color4)] z-1000">
                <div className="py-[1.8rem] flex items-center justify-between w-[80%] max-lg:w-[90%] mx-auto max-md:py-[1.2rem]">
                    <div className="h-12 w-32 bg-gray-200 rounded animate-pulse max-md:w-24 max-md:h-8" />
                    <div className="flex gap-[1rem] max-md:gap-[0.2rem]">
                        <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse max-md:h-8" />
                        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse max-md:hidden" />
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
                            <Link href="/">
                                Naghz
                            </Link>
                        </h1>
                        {!isAuthenticated ? (
                            <div
                                className="flex gap-[1rem] max-md:gap-[0.2rem]"
                            >
                                <Link
                                    className="max-[400px]:hidden button-secondary rounded-full"
                                    href="/auth/sign-in"
                                >
                                    وارد شوید
                                </Link>
                                <Link
                                    className="button-primary rounded-full"
                                    href="/auth/sign-up"
                                >
                                    شروع کنید
                                </Link>
                            </div>
                        ) : (
                            <div
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                    <Link 
                                        className="flex items-center gap-[0.6rem] p-2 hover:bg-[var(--hover-color)] rounded-lg"
                                        href="/dashboard/profile"
                                    >
                                        <MdOutlineKeyboardArrowUp 
                                            className={clsx(
                                                "max-md:hidden text-[1.8rem] transition-all ease-in-out duration-400",
                                                dropdownOpen ? "rotate-[180deg]" : "rotate-0"
                                            )}
                                        />
                                        <CgProfile 
                                            className="text-[3rem] max-md:text-[2rem]"
                                        />
                                    </Link>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            dir="rtl"
                                            initial={{ height: 0}}
                                            animate={{ height: 'auto'}}
                                            transition={{ duration: 0.3 }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden absolute right-0 rounded-md min-w-[20vw] shadow-lg z-50 bg-[var(--bg-color)] max-lg:hidden"
                                        >
                                            <ul 
                                                className=""
                                            >
                                                {routes.filter(route => route.profilePage === true).map((route, index) => (
                                                    <li
                                                        className="text-[1.4rem] max-md:text-[1.2rem] font-bold px-6 py-4 hover:bg-[var(--hover-color)] hover:cursor-pointer"
                                                        key={index}
                                                    >
                                                        <Link
                                                            className="block w-[100%] h-[100%]"
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
                    className="top-0 shadow-lg sticky bg-[var(--bg-color)] z-1000 px-[1.8rem] py-[1rem] flex items-center justify-between"
                >
                    <IoArrowBackCircleOutline 
                        onClick={() => router.back()}
                        className="text-[4rem] text-[var(--accent-color1)] rounded-full hover:bg-[var(--accent-color1)] hover:text-[var(--primary-color4)] cursor-pointer transition-all duration-300"
                    />
                    {pathName.includes("/dashboard") &&
                         <div 
                            className="flex md:hidden flex-col gap-[6px] cursor-pointer p-[5px] transition-transform duration-300 ease-out"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                         <span
                            className="block w-[25px] h-[3px] bg-[var(--primary-color1)] transition-all duration-300 ease-out origin-center"
                         />
                        <span
                            className="block w-[25px] h-[3px] bg-[var(--primary-color1)] transition-all duration-300 ease-out origin-center"
                        />
                        <span
                            className="block w-[25px] h-[3px] bg-[var(--primary-color1)] transition-all duration-300 ease-out origin-center"
                        />
                        </div>
                    }
                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2}}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="fixed left-0 top-0 h-[100vh] w-[25vw] bg-white/10 backdrop-blur-[4px] z-40"
                                />
                                <motion.div
                                    className="fixed right-0 top-0 bg-[var(--bg-color-secondary)] h-[100vh] w-[75vw] z-50"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: '75vw', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3}}
                                >
                                    <SideBar routes={dashboardPages} classname="h-[100%] w-[100%]" />
                                    {isMenuOpen && (
                                        <FaArrowRight 
                                            className="absolute top-[1rem] left-[1rem] text-[1.6rem] cursor-pointer text-[var(--text-primary)]"
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                    )}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </header>
            )}
        </>
    )
}

export default Header;
