"use client"
import React from "react";
import { routesType } from "@/routes/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


interface sideBarTypes {
    routes: routesType[];
    classname?: string
}

const SideBar: React.FC<sideBarTypes> = ({routes, classname}) => {
    const pathname = usePathname();
    const {user, loading} = useSelector((state: RootState) => state.auth);

    return (
        <nav 
            className={clsx("sticky top-[5vh] bg-[var(--primary-color4) shadow-lg min-h-[80vh] border-[1.8px] border-[var(--accent-color1)] rounded-xl px-[5px]", classname)}
        >
            <h2
                className="text-[3rem] max-md:text-[1.8rem] text-center my-[3vh] w-90%"
            >
                داشبورد
            </h2>
            <hr className="text-[var(--accent-color1)]" />
            <ul className="p-2">
                {user?.user_metadata?.role === "admin" ? routes.map((route, index) => (
                    <li 
                        key={index}
                        className={clsx(
                            "cursor-pointer rounded-lg transition-all duration-200 text-[1.2rem] text-[var(--text-primary)] mb-1 font-bold",
                            pathname === route.path 
                                ? "bg-[var(--primary-color1)] text-[var(--primary-color4)] shadow-md" 
                                : "hover:bg-[var(--hover-color)]"
                        )}
                    >
                        <Link 
                            href={route.path}
                            className="block w-full h-full p-4 rounded-lg"    
                        >
                            {route.name}
                        </Link>
                    </li>
                )) : routes.filter(route => !route.adminRequaire).map((route, index) => (
                    <li 
                        key={index}
                        className={clsx(
                            "cursor-pointer rounded-lg transition-all duration-200 text-[1.2rem] text-[var(--text-primary)] mb-1 font-bold",
                            pathname === route.path 
                                ? "bg-[var(--primary-color1)] text-[var(--primary-color4)] shadow-md" 
                                : "hover:bg-[var(--hover-color)]"
                        )}
                    >
                        <Link 
                            href={route.path}
                            className="block w-full h-full p-4 rounded-lg"    
                        >
                            {route.name}
                        </Link>
                    </li>
                ))
                }
            </ul>
        </nav>
    )
} 

export default SideBar;