"use client"
import React from "react";
import { routesType } from "@/routes/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
    FiUser, 
    FiSettings, 
    FiBookOpen, 
    FiGrid,
    FiHome,
    FiShield,
    FiUsers
} from "react-icons/fi";
import { MdModelTraining } from "react-icons/md";


interface sideBarTypes {
    routes: routesType[];
    classname?: string
}

const SideBar: React.FC<sideBarTypes> = ({routes, classname}) => {
    const pathname = usePathname();
    const {user, loading} = useSelector((state: RootState) => state.auth);

    // Icon mapping for routes
    const getRouteIcon = (routeName: string) => {
        switch (routeName) {
            case "پروفایل":
                return <FiUser className="w-5 h-5" />;
            case "اطلاعات اکانت":
                return <FiSettings className="w-5 h-5" />;
            case "دوره‌های من":
                return <FiBookOpen className="w-5 h-5" />;
            case "مدیریت دوره‌ها":
                return <FiGrid className="w-5 h-5" />;
            case "کاربران":
                return <FiUsers className="w-5 h-5" />;
            case "چالش ها":
                return <MdModelTraining className="w-5 h-5" />;
            default:
                return <FiHome className="w-5 h-5" />;
        }
    };

    return (
        <nav className={clsx(
            "sticky top-[15vh] bg-[var(--primary-color4)] shadow-2xl min-h-[80vh] border-[1.8px] border-[var(--accent-color1)] rounded-xl px-[5px]",
            classname
        )}>
            <div className="text-center my-[3vh]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-color1)] rounded-2xl flex items-center justify-center shadow-lg">
                    <FiShield className="w-8 h-8 text-[var(--primary-color4)]" />
                </div>
                <h2 className="text-[2.5rem] max-md:text-[1.5rem] font-bold text-[var(--text-primary)] bg-[var(--primary-color1)] bg-clip-text">
                    داشبورد
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                    {user?.user_metadata?.role === "admin" ? "مدیر سیستم" : "کاربر"}
                </p>
            </div>

            <ul className="p-2">
                {user?.user_metadata?.role === "admin" ? routes.map((route, index) => (
                    <li 
                        key={index}
                        className={clsx(
                            "cursor-pointer rounded-lg transition-all duration-300 text-[1.2rem] text-[var(--text-primary)] mb-1 font-bold group relative overflow-hidden",
                            "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                            pathname === route.path 
                                ? "bg-[var(--primary-color1)] text-[var(--text-primary)] shadow-lg" 
                                : "hover:bg-[var(--accent-color1)]/10 hover:text-[var(--primary-color1)]"
                        )}
                    >
                        <Link 
                            href={route.path}
                            className="flex items-center gap-3 p-4 rounded-lg w-full h-full"    
                        >
                            <div className={clsx(
                                "p-2 rounded-lg transition-all duration-300",
                                pathname === route.path 
                                    ? "bg-[var(--primary-color4)]/20 text-[var(--primary-color4)]" 
                                    : "bg-[var(--accent-color1)]/10 text-[var(--accent-color1)] group-hover:bg-[var(--primary-color1)]/20 group-hover:text-[var(--primary-color1)]"
                            )}>
                                {getRouteIcon(route.name)}
                            </div>
                            
                            <span>{route.name}</span>
                        </Link>
                    </li>
                )) : routes.filter(route => !route.adminRequaire).map((route, index) => (
                    <li 
                        key={index}
                        className={clsx(
                            "cursor-pointer rounded-lg transition-all duration-300 text-[1.2rem] text-[var(--text-primary)] mb-1 font-bold group relative overflow-hidden",
                            "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                            pathname === route.path 
                                ? "bg-gradient-to-r from-[var(--primary-color1)] to-[var(--primary-color2)] text-[var(--primary-color4)] shadow-lg" 
                                : "hover:bg-[var(--accent-color1)]/10 hover:text-[var(--primary-color1)]"
                        )}
                    >
                        <Link 
                            href={route.path}
                            className="flex items-center gap-3 p-4 rounded-lg w-full h-full"    
                        >
                            <div className={clsx(
                                "p-2 rounded-lg transition-all duration-300",
                                pathname === route.path 
                                    ? "bg-[var(--primary-color4)]/20 text-[var(--primary-color4)]" 
                                    : "bg-[var(--accent-color1)]/10 text-[var(--accent-color1)] group-hover:bg-[var(--primary-color1)]/20 group-hover:text-[var(--primary-color1)]"
                            )}>
                                {getRouteIcon(route.name)}
                            </div>

                            <span>{route.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-[var(--accent-color1)]/20 mx-4">
                <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-[var(--primary-color1)] rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-[var(--primary-color4)]" />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                        {user?.email || "کاربر"}
                    </p>
                </div>
            </div>
        </nav>
    )
} 

export default SideBar;