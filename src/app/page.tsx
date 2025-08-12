"use client"
import { GiHiveMind } from "react-icons/gi";
import { ImClock2 } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { MdPsychologyAlt } from "react-icons/md";
import React, { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { homeMetadata } from "@/config/metadata";


export const metadata = homeMetadata;


interface GuidedPathsType {
    id: number;
    name: string;
    component?: React.ReactNode;
    alt?: string;
}

const GuidedPaths: GuidedPathsType[] = [
    {
        id: 1,
        name: "مدیریت‌زمان",
        component: <></>,
        alt: "Time management"
    },
    {
        id: 2,
        name: "کارتیمی",
        component: <></>
    },
    {
        id: 3,
        name: "حل‌مسئله",
        component: <></>,
        alt: "Problem solving"
    },
    {
        id: 4,
        name: "ارتباط",
        component: <></>
    }
]


const Home = () => {
    const [selectedGuide, setSelectedGuide] = useState<number>(1);

    const handleNavigation = (guidedPath: number) => {
        setSelectedGuide(guidedPath);
    }

    return (
        <div className="h-[200vh]" dir="rtl">
            <section
                className="flex flex-col items-center mb-[5vh]"
            >
                <div 
                    className="my-[4vh] px-[4vw]"
                >
                    <video 
                        src="/naghz-landing-do-it.webm"
                        className="max-md:hidden"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                    />
                    <video 
                        src="/naghz-landing-do-it-mobile.webm" 
                        className="md:hidden"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
                <p
                    className="text-[1.6rem] max-w-[80%] mx-auto max-md:text-[1.2rem] text-center font-[600] mb-[1rem]"
                >
                     گاهی فقط چند دقیقه سکوت،
                    کافی‌ست تا چیزی درونت تکان بخورد.
                    تمرین‌هایی ساده، کوتاه، اما اثرگذار.
                    نه برای یاد گرفتن—برای دگرگون شدن.
                     تجربه‌اش کن
                </p>
                <button
                    className="button-primary rounded-full mt-[2rem] shadow md:scale-[1.5] max-md:scale-[1.3] mb-[10vh]"
                >
                    <Link href="/auth/sign-up"
                        className="block w-[100%] h-[100%]"
                    >
                        شروع کن
                    </Link>
                </button>
                <hr className="self-stretch border-t border-[var(--text-desable)] opacity-80" />
                <div
                    className="flex justify-between gap-[1rem] w-[80%] pt-[5vh] max-[1200px]:scale-[0.9] max-[1200px]:w-[100%] max-md:scale-[0.8] max-md:w-[115%] max-[500px]:justify-around"
                >   
                    <div className="flex gap-[0.5rem] items-center max-md:gap-[0.5rem]">
                        <GiHiveMind
                            className="text-[3rem] text-[var(--secondary-color1)] max-md:text-[2rem]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">ارتباطات</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center">
                        <ImClock2 
                            className="text-[2.8rem] text-[var(--secondary-color2)] max-md:text-[2rem]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">مدیریت زمان</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center max-[500px]:hidden max-md:text-[2rem]">
                        <FaUsers 
                            className="text-[3rem] text-[var(--secondary-color3)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">کارتیمی</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center max-[580px]:hidden max-md:text-[2rem]">
                        <MdPsychologyAlt 
                            className="text-[3rem] text-[var(--accent-color2)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">حل مسئله</span>
                    </div>
                </div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh]">
                    <h2 className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.6rem] text-center py-[10vh] text-[var(--primary-color4)]">
                        وقتی آگاهی، حرکت می‌شود
                    </h2>
                    <p
                        className="text-[2.2rem] max-w-[80%] mx-auto max-md:text-[1.6rem] text-center font-[600] mb-[1rem]"
                    >
                    خیلی چیزها را می‌دانیم.
                    اما دانستن کافی نیست،
                    اگر جایی در رفتارمان پیدا نشود.
                    نغز کمک می‌کند آنچه در ذهن داری،
                    در انتخاب‌ها و واکنش‌هایت جان بگیرد.
                    </p>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 left-0 w-4/5 max-md:w-full ml-[-30vw] max-[1100px]:ml-0">
                    <img src="/concepts-that-click.svg" alt="concepts that click" className="w-full h-auto object-contain object-bottom max-[1100px]:object-cover" />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-2 col-end-5 max-md:w-[90%]"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        جزءبه‌جزء، اما معنا‌دار
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        در نغز، مهارت‌های بزرگ زندگی
                        تبدیل می‌شوند به تمرین‌هایی کوچک، دقیق و عمیق.
                        یاد می‌گیری که چطور یاد بگیری—
                        کاربردی، شخصی‌سازی‌شده و بازی‌گونه.
                        هر چیزی در جای خودش، به وقت خودش.
                    </p>
                </div>
            </section>
            <section
                className="grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 right-0 w-4/5 max-md:w-full mr-[-30vw] max-md:mr-0">
                    <img src="lohp-learn-at-your-level.svg" alt="concepts that click" className="w-full h-auto object-contain object-bottom max-[1100px]:object-cover" />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-5 col-end-8 max-md:w-[90%] z-2"
                >
                    <h1
                        className="h1 max-w-[255vw] max-[1300px]:max-w-[30vw] max-[550px]:max-w-[35vw] max-[400px]:max-w-[45vw]"
                    >
                        امتحان کن. فکر کن. جلوتر برو
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                    >
                        هر جلسه یه نقطه‌ی مکثه.
                        یه جا برای دیدن، عمل کردن، تغییر دادن.
                        کم‌کم چیزهایی که فقط شنیده بودی، می‌شن بخشی از خودت.
                        از فهمیدن، به جا افتادن می‌رسی—آروم، بی‌سروصدا.
                    </p>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 left-0 w-4/5 max-md:w-full ml-[-30vw] max-[1100px]:ml-0">
                    <img src="/stay-motivated-v3.svg" alt="concepts that click" className="w-full h-auto object-contain object-bottom max-[1100px]:object-cover" />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-2 col-end-5 max-md:w-[90%]"
                >
                    <h1
                        className="h1 max-w-[25vw] max-[1300px]:max-w-[30vw] max-[550px]:max-w-[35vw] max-[400px]:max-w-[45vw]"
                    >
                        کوچیک شروع کن، ادامه بده، فرقش رو حس کن
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        روزی فقط چند دقیقه.
                        با حس واقعیِ پیشرفت،‌ بدون عجله، بدون فشار.
                        هر قدم، گامی‌ست به‌سوی خودت—
                        آرام، ولی ماندگار.
                    </p>
                </div>
            </section>
            <section
                className="grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 right-0 w-4/5 max-md:w-full mr-[-30vw] max-md:mr-[-20vw]">
                    <img src="/lohp-guided-bite-sized.svg" alt="concepts that click" className="w-full h-auto object-contain object-bottom max-[1100px]:object-cover" />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-5 col-end-8 max-md:w-[90%] z-2"
                >
                    <h1
                        className="h1 max-w-[25vw] max-[1300px]:max-w-[30vw] max-[550px]:max-w-[40vw] max-[400px]:max-w-[45vw]"
                    >
                        مهم نیست کی هستی، کجای راهی
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                    >
                        اگه ۱۴ سالته، یا ۱۱۴،
                        اگه پرمشغله‌ای، خسته‌ای یا صرفاً کنجکاوی—
                        نبض طوری طراحی شده که از جایی که هستی، باهات همراه بشه.
                        ساده، انسانی، بدون عجله.
                    </p>
                </div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh]">
                    <h2 className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.6rem] text-center py-[10vh] text-[var(--primary-color4)]">
                        فقط یک شروع کافیه   
                    </h2>
                    <p
                        className="text-[2.2rem] max-w-[80%] mx-auto max-md:text-[1.6rem] text-center font-[600] mb-[1rem]"
                    >
                        هیاهو لازم نیست.
                        تغییر از همان لحظه‌ای آغاز می‌شود که تصمیم می‌گیری.
                        آرام، ساده، اما واقعی.
                        قدم اول را بردار.
                    </p>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <h2 className="font-[750] text-[var(--text-primary)] text-[5rem] max-[1200px]:font-[700] max-md:text-[3rem] text-center py-[10vh]">
                    راهنمایی هر مسیر
                </h2>
                <nav
                    className="w-[100%]"
                >
                    <ul 
                        className="flex justify-center items-center p-2 gap-[1.6rem] bg-[var(--primary-color3)] w-fit mx-auto rounded-[1rem] max-md:text-[0.8rem] max-md:gap-[0rem]"
                    >
                        {GuidedPaths.map((guidedPath, index) => (  
                            <div 
                                key={index}
                                className="flex items-center justify-center" 
                                title={guidedPath.alt}   
                            >
                                <li 
                                    onClick={e => handleNavigation(guidedPath.id)}
                                    className={clsx(
                                        "cursor-pointer font-[650] py-4 px-6 rounded-[0.8rem] transition-all duration-300 max-md:px-4",
                                        selectedGuide === guidedPath.id 
                                            ? "bg-[var(--primary-color4)] text-[var(--text-primary)] shadow-lg"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-color)]"
                                    )}
                                >
                                    {guidedPath.name}
                                </li>
                            </div>
                        ))}
                    </ul>
                </nav>
                <motion.div
                    key={selectedGuide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="transition-all duration-300"
                >
                    {GuidedPaths.find(guidedPath => guidedPath.id === selectedGuide)?.component}
                </motion.div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh] flex flex-col items-center">
                    <h2 className="font-[750] text-[var(--primary-color3)] text-[5rem] max-[1200px]:font-[700] max-md:text-[3rem] text-center py-[10vh]">
                        مسیرتو شروع کن
                    </h2>
                    <button
                        className="button-primary rounded-full mt-[2rem] shadow-lg md:scale-[1.5] max-md:scale-[1.3] mb-[10vh] min-w-[15vw]"
                    >
                        <Link href="/auth/sign-up"
                            className="block w-[100%] h-[100%]"
                        >
                            شروع کن
                        </Link>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;
