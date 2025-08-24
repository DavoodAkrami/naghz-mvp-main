"use client"
import { FaInstagram } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import routes from "@/routes/routes";
import { usePathname } from "next/navigation";


const Footer = () => {
    const pathname = usePathname();
    const footerPages = routes.find(route => route.path === pathname)?.footer ?? false;
    

    if (!footerPages) return null;

    return (
        <footer
            dir="rtl"
            className="bg-[var(--foreground)] text-[white]/70 min-h-[20vh] flex flex-col justify-between py-[3vh]"
        >
            <div
                className="flex justify-center gap-[2rem] text-[3rem] max-md:text-[2rem]"
            >
                <a href="https://www.instagram.com/naghz.io?igsh=aW1nMDdwOTNhZmFo" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="cursor-pointer hover:text-[var(--accent-color1)] transition-colors duration-200" />
                </a>
                <a href="https://t.me/naghzed" target="_blank" rel="noopener noreferrer">
                    <FaTelegram className="cursor-pointer hover:text-[var(--accent-color1)] transition-colors duration-200" />
                </a>
                <a href="https://www.linkedin.com/company/naghz/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="cursor-pointer hover:text-[var(--accent-color1)] transition-colors duration-200" />
                </a>
                <a href="mailto:thenaghz.io@gmail.com">
                    <MdEmail className="cursor-pointer hover:text-[var(--accent-color1)] transition-colors duration-200" />
                </a>
            </div>
            <div
                className="w-[40%] max-md:w-[90%] flex justify-between items-center mx-auto py-[3vh] max-md:flex-col max-md:gap-[0.4rem]"
            >
                <div
                    className="flex items-center gap-[0.4rem] text-[1.2rem]"
                >
                    <span>
                        ایمیل ما: 
                    </span>
                    <a
                        href="mailto:thenaghz.io@gmail.com"
                        className="text-[var(--primary-color1)] hover:text-[var(--accent-color1)] hover:cursor-pointer"
                        
                    >
                        thenaghz.io@gmail.com
                    </a>
                </div>
                <div
                    className="flex items-center gap-[0.4rem] text-[1.2rem]"
                >
                    <span>
                        چنل تلگرام نغز: 
                    </span>
                    <a
                        href="https://t.me/naghzed"
                        className="text-[var(--primary-color1)] hover:text-[var(--accent-color1)] hover:cursor-pointer"
                    >
                        https://t.me/naghzed
                    </a>
                </div>
            </div>
            <div
                className="text-center text-[1.3rem] w-[80vw] mx-auto max-md:w-[90vw]"
            >
                <hr 
                    className="mb-[2vh] border-t border-white/20"
                />
                ساخته شده توسط تیم IO
            </div>
        </footer>
    )
}

export default Footer;