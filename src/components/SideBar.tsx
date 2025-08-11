"use client"
import React from "react";
import { routesType } from "@/routes/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";


interface sideBarTypes {
    routes: routesType[];
}

const SideBar: React.FC<sideBarTypes> = ({routes}) => {
    const pathname = usePathname();

    return (
        <nav 
            className="sticky top-[5vh] bg-[var(--primary-color4) shadow-lg min-h-[80vh] border-[1.8px] border-[var(--accent-color1)] rounded-xl px-[5px]"
        >
            <h2
                className="text-[3rem] max-md:text-[2rem] text-center my-[3vh]"
            >
                داشبورد
            </h2>
            <hr className="text-[var(--accent-color1)]" />
            <ul className="p-2">
                {routes.map((route, index) => (
                    <li 
                        key={index}
                        className={clsx(
                            "cursor-pointer rounded-lg transition-all duration-200 text-[1.2rem] text-[var(--text-primary)] mb-1",
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
                ))}
            </ul>
        </nav>
    )
} 

export default SideBar;