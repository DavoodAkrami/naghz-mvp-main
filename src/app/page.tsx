"use client"
import { GiHiveMind } from "react-icons/gi";
import { ImClock2 } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { MdPsychologyAlt } from "react-icons/md";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { links } from  "@/routes/routes";


interface GuidedPathsType {
    id: number;
    name: string;
    component?: React.ReactNode;
    alt?: string;
}

const GuidedPaths: GuidedPathsType[] = [
    {
        id: 1,
        name: "نظم و تعهد شخصی",
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
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const [linkCarry, setLinkCarry] = useState<string>(links.signUp);


    const handleNavigation = (guidedPath: number) => {
        setSelectedGuide(guidedPath);
    }

    useEffect(() => {
        if (isAuthenticated) {
            setLinkCarry(links.courses);
        } else {
            setLinkCarry(links.signUp);
        }
    }, [isAuthenticated]);

    return (
        <div className="" dir="rtl">
            <section
                className="flex flex-col items-center"
            >
                <div 
                    className="my-[2vh] px-[4vw]"
                >
                    <video 
                        src="/naghz-landing-do-it.webm"
                        className="max-md:hidden scale-[0.9] w-[90%] mx-auto"
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
                <h1
                    className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.4rem] text-center py-[5vh] text-[var(--text-proimary)] max-w-[90%]"
                >
                    با میکرو تمرین‌های 10 دقیقه‌ای — وضوح، تمرکز و آرامش بساز
                </h1>
                <p
                    className="text-[1.6rem] max-w-[70%] mx-auto max-md:text-[1.2rem] text-center  mb-[1rem]"
                >
                    گاهی فقط چند دقیقه سکوت،
                    کافیه تا چیزی درونت تکون بخوره
                    تمرین‌هایی ساده، کوتاه، و اثرگذار.
                    با نغز فقط یاد نمی‌گیری — تغییر می‌کنی.
                </p>
                <button
                    className="button-primary rounded-full mt-[2rem] shadow md:scale-[1.5] max-md:scale-[1.3] mb-[10vh]"
                >
                    <Link href={linkCarry}
                        className="block w-[100%] h-[100%]"
                    >
                        تجربه‌اش کن
                    </Link>
                </button>
                <hr className="self-stretch border-t border-[var(--text-desable)] opacity-80" />
                <div
                    className="flex justify-between gap-[1rem] w-[80%] py-[5vh] max-[1200px]:scale-[0.9] max-[1200px]:w-[100%] max-md:scale-[0.8] max-md:w-[115%] max-[500px]:justify-around"
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
            {/* <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh] flex flex-col justify-center items-center ">
                    <h2 className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.4rem] text-center pt-[10vh] pb-[5vh] text-[var(--primary-color4)] max-w-[90%]">
                        از دونستن تا زندگی کردن: وقتی آگاهی به رفتار میاد
                    </h2>
                    <p
                        className="text-[2.2rem] max-w-[70%] mx-auto max-md:text-[1.6rem] text-center font-[600] mb-[1rem]"
                    >
                        خیلی چیزها رو می‌دونیم
                        اما صرفا دونستن کافی نیست،
                        <span className="block">  
                            نغز کمک می‌کنه آنچه در ذهن داری،
                            در انتخاب‌ها و واکنش‌هات جان بگیره
                        </span>
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
                        className="h1 max-w-[450vw] max-[1300px]:max-w-[45vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw]"
                    >
                        روش نَغز: تدریجی، اما معنا‌دار
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        در نغز، مهارت‌های بزرگ زندگی
                        تبدیل میشن به تمرین‌هایی کوچیک، عمیق و تاثیرگذار.
                        اینجا این مهارتهارو بصورت 
                        <span className="font-bold"> تعاملی، شخصی‌سازی‌شده و بازی‌گونه </span>
                        یاد میگیری
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
                        className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw]"
                    >
                        تلاشی که تغییرت میده: تمرین، تامل، تکرار
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[70%]"
                    >
                        هر قدم یک نقطه عطفه
                        <span className="block">
                        اون لحظه‌ی «آها!» که همه‌چیز رو برات روشن می‌کنه.
                        </span>
                        <span className="block">
                        با نغز از فهمیدن، به جا افتادن می‌رسی—
                        <span className="font-bold">
                        آروم، بی‌سروصدا
                        </span>
                        </span>
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
                        className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw]"
                    >
                        انگیزه‌ای که پایداره:  کوچیک شروع کن، ادامه بده، فرقش رو حس کن        
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                    روزی فقط چند دقیقه<br />
                    <span className="font-bold">با حس واقعیِ پیشرفت،‌</span> بدون عجله، بدون فشار<br />
                    هر قدم، گامیه به‌سوی خودت — 
                    آروم، ولی ماندگار
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
                        className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw]"
                    >
                        برای زندگی‌های واقعی:  مهم نیست کی هستی، کجای راهی
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                    >
                        اگه 
                        <span className="font-bold"> ۱۴ سالته، یا ۱۱۴، </span>
                        اگه پرمشغله‌ای، خسته‌ای یا صرفاً کنجکاوی—
                        نغز طوری طراحی شده که از جایی که هستی، باهات همراه بشه و تا اخرش بمونه
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
                        className="flex justify-center items-center p-2 gap-[1.6rem] bg-[var(--primary-color3)] w-fit mx-auto rounded-[1rem] max-md:text-[0.8rem] max-md:gap-[0.2rem]"
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
                <div className="min-h-[80vh] flex flex-col justify-center items-center">
                    <h2 className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.4rem] text-center py-[10vh] text-[var(--primary-color4)] max-w-[90%]">
                        با اولین قطره شروع کن، این‌طوریه که اقیانوس ساخته میشه  
                    </h2>
                    <p
                        className="text-[2.2rem] max-w-[80%] mx-auto max-md:text-[1.6rem] text-center font-[600] mb-[1rem]"
                    >
                        تغییر نیاز به هیاهو نداره و از همون لحظه‌ای آغاز می‌شود که تصمیم می‌گیری.
                        آروم، ساده، اما واقعی
                    </p>
                    <button
                        className="button-primary rounded-full mt-[5vh] shadow-lg md:scale-[1.5] max-md:scale-[1.3] mb-[10vh] min-w-[15vw]"
                    >
                        <Link href="/auth/sign-up"
                            className="block w-[100%] h-[100%]"
                        >
                            قدم اولو بردار
                        </Link>
                    </button>
                </div>
            </section> */}
        </div>
    );
}

export default Home;
