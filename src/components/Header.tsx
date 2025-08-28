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
import { IoMenu } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";
import NaghzLogo from "./NaghzLogo";




interface navMenuOptionsType {
    id: number;
    title: string;
    action?: ((optionId?: number) => void | null) | (() => void | string);
    canOpen?: boolean;
    openedOption?: navMenuOptionsType[];
}

const Header = () => {
    const pathName = usePathname();
    const router = useRouter();
    const headerPage = routes.find(route => route.path === pathName)?.header ?? false; 
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
    const [isCanOpenMenuId, setIsCanMenuId] = useState<number | null>(null);

    const navMenuOptions: navMenuOptionsType[] = [
        {
            id: 1,
            title: "خانه",
            action: () => router.push("/")
        },
        {
            id: 2,
            title: "پروفایل",
            action: () => router.push("/dashboard/profile")
        },
        {
            id: 3,
            title: "دوره‌ها",
            action: () => router.push("/courses")
        },
        {
            id: 4,
            title: "کامیونیتی ما",
            action: (optionId?: number) => setIsCanMenuId(optionId || null),
            canOpen: true,
            openedOption: [
                {
                    id: 1,
                    title: "تلگرام",
                    action: () => { window.open('https://t.me/naghzed', '_blank'); }
                },
                {
                    id: 2,
                    title: "اینستاگرام",
                    action: () => { window.open('https://www.instagram.com/naghz.io?igsh=aW1nMDdwOTNhZmFo', '_blank'); }
                },
                {
                    id: 3,
                    title: "لینکدین",
                    action: () => { window.open('https://www.linkedin.com/company/naghz/', '_blank'); } 
                }
            ]
        }
    ]

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const parts = pathName.split('/').filter(Boolean);
    const hideHeader = parts[0] === 'courses' && parts.length > 1;


    useEffect(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [pathName]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            const navMenu = document.querySelector('[data-nav-menu]');
            
            if (isNavMenuOpen && navMenu && !navMenu.contains(target)) {
                setIsNavMenuOpen(false);
            }
        };

        if (isNavMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isNavMenuOpen]);

    const handleNavMenuOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsNavMenuOpen(!isNavMenuOpen);
    }

    
    if (showSkeleton && headerPage) {
        return (
            <header className="top-[2.5vh] py-[0.4vh] pt-[1.4vh] rounded-full w-[90%] mx-auto sticky shadow-lg bg-[var(--primary-color1)]/40 backdrop-blur-xl z-1000 max-md:py-0 max-md:pt-[0.3rem]">
                <div className="py-[1.8rem] flex items-center justify-between w-[80%] max-lg:w-[90%] mx-auto max-md:py-[1.2rem]">
                    <div className="h-12 w-32 bg-gray-200 rounded animate-pulse max-md:w-24 max-md:h-8" />
                    <div className="flex gap-[1rem] max-md:gap-[0.2rem]">
                        <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse max-md:h-8" />
                        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse max-md:hidden" />
                    </div>
                </div>
            </header>
        );
    }

    if (hideHeader) return null;

    return (
        <>
            {headerPage ? (
                <header
                    className="top-[2.5vh] py-[0.4vh] pt-[1.4vh] rounded-full w-[90%] mx-auto sticky shadow-lg bg-[var(--primary-color1)]/40 backdrop-blur-xl z-1000 max-md:py-0 max-md:pt-[0.3rem] max-md:mb-[2rem] text-[var]"
                >
                    <div
                        className="py-[1rem] flex items-center justify-between w-[80%] max-lg:w-[90%] mx-auto"
                    >
                        <h1
                            className="h1"
                        >
                            <Link href="/" className="flex items-center gap-[0.4rem] text-[#000]">
                                <NaghzLogo size="header" className="max-md:hidden" />
                                <NaghzLogo size="sm" className="md:hidden" />
                                <span className="pt-[0.2rem] max-md:pt-[0rem]">Naghz</span>
                            </Link>
                        </h1>
                        {!isAuthenticated ? (
                            <div
                                className="flex gap-[1rem] max-md:gap-[0.2rem]"
                            >
                                <Link
                                    className="max-[450px]:hidden button-secondary rounded-full"
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
                                className="flex items-center gap-[1.6rem] max-md:gap-[0.6rem]"
                            >
                                <div
                                    className="relative"
                                    onMouseEnter={() => !isNavMenuOpen && setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                        <Link 
                                            className={clsx(
                                                "flex items-center gap-[0.6rem] p-2 hover:bg-[var(--primary-color4)]/50 rounded-lg",
                                                dropdownOpen && "bg-[var(--primary-color4]"
                                            )}
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
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto'}}
                                                transition={{ duration: 0.3 }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden absolute right-0 rounded-2xl min-w-[20vw] shadow-lg z-50 max-lg:hidden"
                                            >
                                                <ul 
                                                    className=""
                                                >
                                                    {routes.filter(route => route.profilePage === true).map((route, index) => (
                                                        <li
                                                            className="text-[1.4rem] max-md:text-[1.2rem] font-bold max-md:font-normal hover:cursor-pointer bg-[var(--primary-color4)]/50 hover:bg-[var(--primary-color4)]/65"
                                                            key={index}
                                                        >
                                                            <Link
                                                                className="block w-[100%] h-[100%] backdrop-blur-2xl px-4 py-3"
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
                                <div
                                    onClick={handleNavMenuOpen}
                                    className={clsx(
                                        "relative p-1 hover:bg-[var(--primary-color4)]/50 active:bg-[var(--primary-color4)]/50 rounded-lg cursor-pointer",
                                        isNavMenuOpen && "bg-[var(--primary-color4]"
                                    )}
                                >
                                    <IoMenu 
                                        className="text-[3rem] max-md:text-[2rem] "
                                    />
                                </div>
                                <AnimatePresence>
                                    {isNavMenuOpen && (
                                        <>
                                            <motion.div
                                                data-nav-menu
                                                dir="rtl"
                                                initial={{ opacity: 0, y: -120, scale: 0, x: 130 }}
                                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                                exit={{ opacity: 0, y: -120, scale: 0, x: 130 }}
                                                className="overflow-hidden absolute right-[140px] select-none top-[90px] mt-2 rounded-3xl min-w-[20vw] max-md:w-[70vw] max-md:top-[60px] max-md:right-[5vw] shadow-lg z-50  bg-[var(--primary-color4)]/60 backdrop-blur-2xl"
                                            >
                                                {navMenuOptions.map(option => (
                                                    <ul
                                                        key={option.id}
                                                    >
                                                        <li
                                                            onClick={() => {
                                                                if (option.canOpen) {
                                                                    setIsCanMenuId(isCanOpenMenuId === option.id ? null : option.id);
                                                                } else if (option.action && typeof option.action === 'function') {
                                                                    option.action();
                                                                    setIsNavMenuOpen(false);
                                                                    setIsCanMenuId(null);
                                                                }
                                                            }}
                                                            className={clsx(
                                                                "flex items-center justify-between text-[1.4rem] max-md:text-[1.2rem] max-md:font-normal font-bold hover:cursor-pointer hover:bg-[var(--primary-color4)]/80 px-4 py-3 backdrop-blur-2xl",
                                                                option.id !== navMenuOptions.length && "border-b border-[var(--text-primary)]/20 max-md:border-[var(--text-primary)]/30"
                                                            )}
                                                        >
                                                            {option.title}
                                                            {option.canOpen &&
                                                                <MdKeyboardArrowLeft 
                                                                    className={clsx(
                                                                        "text-[1.6rem] transition-all ease-in-out duration-200",
                                                                        isCanOpenMenuId ? "rotate-[-90deg]" : "rotate-0"
                                                                    )}
                                                                />
                                                            }
                                                        </li>
                                                        <AnimatePresence>
                                                            {option.canOpen && isCanOpenMenuId === option.id &&
                                                                <motion.ul
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    
                                                                    {option.openedOption?.map((subOption: navMenuOptionsType) => (
                                                                        <li
                                                                            key={subOption.id}
                                                                            onClick={() => {
                                                                                if (subOption.action) {
                                                                                    if (typeof subOption.action === 'function') {
                                                                                        subOption.action();
                                                                                    }
                                                                                }
                                                                            }}
                                                                            className={clsx(
                                                                                "text-[1.4rem] max-md:text-[1.2rem] font-bold max-md:font-normal hover:cursor-pointer hover:bg-[var(--primary-color4)]/80 px-6 py-3 backdrop-blur-3xl",
                                                                                subOption.id !== navMenuOptions.length && "border-b border-[var(--text-primary)]/20"
                                                                            )}
                                                                        >
                                                                            {subOption.title}
                                                                        </li>
                                                                    ))}
                                                                </motion.ul>
                                                            }
                                                        </AnimatePresence>
                                                    </ul>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                    {/* <hr className="text-[var(--text-desable)] opacity-[0.8]" /> */}
                </header>
            ) : (
                <header
                    className="top-0 shadow-lg sticky bg-[var(--bg-color)]/40 backdrop-blur-xl z-1000 px-[1.8rem] py-[1rem] flex items-center justify-between"
                >
                    <IoArrowBackCircleOutline 
                        onClick={() => router.push("/")}
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
