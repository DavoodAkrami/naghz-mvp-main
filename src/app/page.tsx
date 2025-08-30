"use client"
import { GiHiveMind } from "react-icons/gi";
import { ImClock2 } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { MdPsychologyAlt } from "react-icons/md";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { links } from  "@/routes/routes";
import { TbMessageChatbot } from "react-icons/tb";
import ChallengPopUp from "@/components/ChallengPopUp";
import ChatBot from "@/components/ChatBot";
import clsx from "clsx";
import { fetchUserProgress } from "@/store/slices/userProgressSlice";


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
    // const [selectedGuide, setSelectedGuide] = useState<number>(1);
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
    const [linkCarry, setLinkCarry] = useState<string>(links.signUp);
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
    const [isChallengPopUpOpen, setIsChallengPopUpOpen] = useState<boolean>(false);
    const [isChatBotOpen, setIsChatBotOpen] = useState<boolean>(false);
    const [shouldPopUpOpen, setShouldPopUpOpen] = useState<boolean>(false);
    const { userProgress } = useSelector((state: RootState) => state.userProgress);
    const dispatch = useDispatch<AppDispatch>();


    // const handleNavigation = (guidedPath: number) => {
    //     setSelectedGuide(guidedPath);
    // }




    const handlePopupClose = () => {
        if (isPopUpOpen) {
            setIsPopUpOpen(false);
        } else if (isChallengPopUpOpen) {
            setIsChallengPopUpOpen(false);
        }
    }

    const handlePopupAccept = () => {
        setIsPopUpOpen(false);
        const timer = setTimeout(() => {
            setIsChallengPopUpOpen(true)
        }, 2000);
        return () => clearTimeout(timer);
    }

    const handlePopUpSubmit = () => {
        setIsChallengPopUpOpen(false);
        const today = new Date().toDateString();
        localStorage.setItem("hasPopupOpen", "true");
        localStorage.setItem("popupDate", today);
    }

    useEffect(() => {
        if (isAuthenticated) {
            setLinkCarry('courses/clear-communication');
        } else {
            setLinkCarry(links.signUp);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserProgress(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        const popupDate = localStorage.getItem("popupDate");
        const today = new Date().toDateString();
        const currentHour = new Date().getHours();
        

        if (popupDate && popupDate !== today) {
            localStorage.setItem("hasPopupOpen", "false");
            localStorage.setItem("popupDate", today);
        }
        

        if (popupDate != today) {
            localStorage.setItem("hasPopupOpen", "false");
        }
    }, []);

    useEffect(() => {
        const shouldShowPopup = localStorage.getItem("hasPopupOpen");
        
        if (isAuthenticated && shouldShowPopup !== "true") {
            const timer = setTimeout(() => {
                setIsPopUpOpen(true);
            }, 4000); 

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);


    useEffect((courseId="4930ad6d-aa59-4061-87aa-1b255d6355bf") => {
        setShouldPopUpOpen(!!userProgress.find(course => course.course_id === courseId))
    }, [userProgress])

    return (
        <AnimatePresence>
            <div className="bg-gradient-to-t from-blue-50 to-[var(--bg-color)]" dir="rtl"> 
                <section
                    className="flex flex-col items-center"
                >
                    <div 
                        className="my-0 px-[4vw] mx-auto flex justify-center items-center"
                    >
                        <video 
                            src="/Landing-first/landing-first-laptop.webm"
                            className="max-md:hidden scale-[0.9] w-[90%] mx-auto"
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                        />
                        <video 
                            src="/Landing-first/landing-first-mobile.webm" 
                            className="md:hidden"
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                        />
                    </div>
                    <Button
                        buttonType="button-primary"
                        classname="rounded-full mt-[2rem] shadow max-md:scale-[1.3] mb-[10vh] scale-[1.8]"
                    >
                        <Link href={linkCarry}
                            className="block w-[100%] h-[100%]"
                        >
                            نغز شو!
                        </Link>
                    </Button>
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
                <section
                    className="bg-[url(/social-proof-background.svg)] h-[80vh] bg-[var(--section-color)] text-[var(--text-secondary)]"
                >
                    <motion.div 
                        initial={{ y: 90, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="min-h-[80vh] flex flex-col justify-center items-center"
                    >
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
                    </motion.div>
                </section>
                <section
                    className="bg-[var(--primary-color4)] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[85vh] relative" 
                >
                    <div className="absolute top-[13vh] left-[5vw] w-4/5 max-md:w-full max-w-[40vw] flex items-center max-md:max-w-[90vw] max-md:mt-[25vh]">
                        <img src="/landing/landing1.jpg" alt="concepts that click" className="w-full h-auto object-contain max-[1100px]:object-cover rounded-3xl" />
                    </div>
                    <motion.div
                        initial={{ x: 90, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="px-8 flex flex-col justify-center col-start-2 col-end-5 max-md:w-[130%] mb-[7vh]"
                    >
                        <h1
                            className="h1 max-w-[45vw] max-[1300px]:max-w-[45vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw]"
                        >
                            رایگان. سرگرم کننده. موثر
                        </h1>
                        <p
                            className="text-[1.6rem] max-md:text-[1.2rem] max-w-[70%]"
                        >
                            یادگیری با نغز، نغزه و تحقیقات نشون میده که این نوع یادگیری واقعا کار میکنه!<br />
                            با آموزش های <span className="font-bold">میکرو و گیمیفیکیشن</span>، مهارتهای نرم رو بصورت <span className="font-bold">تعاملی و کاربردی</span> یاد میگیری.
                        </p>
                    </motion.div>
                </section>
                <section
                    className="grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[85vh] relative" 
                >
                    <div className="absolute top-[13vh] right-[5vw] w-4/5 max-md:w-full max-w-[40vw] flex items-center max-md:max-w-[90vw] max-md:mt-[25vh]">
                        <img src="/landing/landing2.jpg" alt="concepts that click" className="w-full h-auto object-contain max-[1100px]:object-cover rounded-3xl" />
                    </div>
                    <motion.div 
                        initial={{ x: -90, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="px-8 flex flex-col justify-center col-start-5 col-end-8 max-md:w-[90%] z-2 mb-[8vh]"
                    >
                        <h1
                            className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw] max-md:mt-[5vh]"
                        >
                            پشتیبانی توسط علم
                        </h1>
                        <p
                            className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[70%]"
                        >
                            ما ترکیبی از <span className="font-bold">متد های اموزشی</span> که تحقیقات زیادی را پشت سر گذاشتن و محتوای لذت بخش رو برای ساختن مسیر های یادگیری که مهارتهای حیاتی زندگی رو اموزش میدن استفاده میکنیم!
                        </p>
                    </motion.div>
                </section>
                <section
                    className="bg-[var(--primary-color4)] grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[85vh] relative" 
                >
                    <div className="absolute top-[13vh] left-[5vw] w-4/5 max-md:w-full max-w-[40vw] flex items-center max-md:max-w-[90vw] max-md:mt-[25vh]">
                        <img src="/landing/landing3.jpg" alt="concepts that click" className="w-full h-auto object-contain max-[1100px]:object-cover rounded-3xl" />
                    </div>
                    <motion.div 
                        initial={{ x: 90, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="px-8 flex flex-col justify-center col-start-2 col-end-5 max-md:w-[90%] mb-[8vh]"
                    >
                        <h1
                            className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw] max-md:mt-[5vh]"
                        >
                            انگیزه‌تو حفظ کن
                        </h1>
                        <p
                            className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                        >
                        ما با ویژگی‌های <span className="font-bold">شبیه بازی</span>، چالش‌های سرگرم‌کننده و یادآوری‌های مسکات دوست‌داشتنی‌مون، <span className="font-bold">Niro</span>،عادت یادگیری مهارتهای نرم رو براتون آسون می‌کنیم.
                        </p>
                    </motion.div>
                </section>
                <section
                    className="grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[80vh] relative" 
                >
                    <div className="absolute top-[13vh] right-[5vw] w-4/5 max-md:w-full max-w-[40vw] flex items-center max-md:max-w-[90vw] max-md:mt-[25vh]">
                        <img src="/landing/landing4.png" alt="concepts that click" className="w-full h-auto object-contain max-[1100px]:object-cover rounded-3xl" />
                    </div>
                    <motion.div
                        initial={{ x: -90, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}} 
                        className="px-8 flex flex-col justify-center col-start-5 col-end-8 max-md:w-[90%] z-2 mb-[5vh]"
                    >
                        <h1
                            className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw] max-md:mt-[5vh]"
                        >
                            برای زندگی‌های واقعی
                        </h1>
                        <p
                            className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                        >
                            اگه <span className="font-bold">۱۴ سالته، یا ۱۱۴</span>، اگه پرمشغله‌ای، خسته‌ای یا صرفاً کنجکاوی— <span className="font-bold">مهم نیست کی هستی، کجای راهی</span>.<br />
                            نغز طوری طراحی شده که از جایی که هستی، باهات همراه بشه و تا اخرش کنارت باشه.
                        </p>
                    </motion.div>
                </section>
                {/* <section
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
                        whileInView={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="transition-all duration-300"
                    >
                        {GuidedPaths.find(guidedPath => guidedPath.id === selectedGuide)?.component}
                    </motion.div>
                </section> */}
                                <section
                    className="bg-[var(--primary-color4)] grid grid-cols-[5%_1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[85vh] relative" 
                >
                    <div className="absolute top-[13vh] left-[5vw] w-4/5 max-md:w-full max-w-[40vw] flex items-center max-md:max-w-[90vw] max-md:mt-[50vh]">
                        <img src="/landing/landing5.png" alt="concepts that click" className="w-full h-auto object-contain max-[1100px]:object-cover rounded-3xl" />
                    </div>
                    <motion.div 
                        initial={{ x: 90, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{  delay: 0.5, duration: 0.6}}
                        className="px-8 flex flex-col justify-center col-start-2 col-end-5 max-md:w-[90%] "
                    >
                        <h1
                            className="h1 max-w-[40vw] max-[1300px]:max-w-[60vw] max-[550px]:max-w-[80vw] max-[400px]:max-w-[80vw] max-md:mt-[5vh]"
                        >
                            🌿 نغز فقط یه محصول نیست
                        </h1>
                        <p
                            className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                        >
                            یه جور دیدنه، یه جور ساختنه… با حوصله، با عشق، با دقت
                            <br />
                            اینجا جاییه که آدمای شبیه تو جمع میشن — کسایی که میخوان کار، زندگی و یادگیری‌شون نغز باشه
                            <br />
                            اینجا حرف از عجله و کامل‌بودن نیست
                            حرف از قدمای کوچیکیه که باهم برمی‌داریم
                            از لحظه‌هایی که یاد می‌گیریم، تجربه می‌کنیم و رشد می‌کنیم
                            <br />
                            اگه بخش نغزت هنوز زندست
                            اینجا می‌تونی باهاش وقت بگذرونی، پرورش بدی و با جمعی شبیه خودت، نغزتر بشی
                        </p>
                        <Button
                            buttonType="button-primary"
                            classname="rounded-full mt-[3rem] w-[50%] scale-[1.2] mr-[1rem]"
                            onClick={() => window.open('https://t.me/naghzed')}
                        >
                            جامعه نغز
                        </Button>
                    </motion.div>
                </section>
                <section
                    className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
                >
                    <div 
                        className="min-h-[80vh] flex flex-col justify-center items-center"
                    >
                        <motion.h2 
                            initial={{ y: -90, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            viewport={{ once: true }}
                            transition={{  delay: 0.5, duration: 0.6}}
                            className="font-[750] text-[4rem] max-[1200px]:font-[700] max-md:text-[2.4rem] text-center py-[10vh] text-[var(--primary-color4)] max-w-[90%]"
                        >
                            با اولین قطره شروع کن، این‌طوریه که اقیانوس ساخته میشه  
                        </motion.h2>
                        <motion.p
                            initial={{ y: -90, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            viewport={{ once: true }}
                            transition={{  delay: 0.5, duration: 0.6}}
                            className="text-[2.2rem] max-w-[80%] mx-auto max-md:text-[1.6rem] text-center font-[600] mb-[1rem]"
                        >
                            تغییر نیاز به هیاهو نداره و از همون لحظه‌ای آغاز می‌شود که تصمیم می‌گیری.
                            آروم، ساده، اما واقعی
                        </motion.p>
                        <motion.div
                            initial={{ y: -90, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            viewport={{ once: true }}
                            transition={{  delay: 0.5, duration: 0.6}}
                        >
                            <Button
                                buttonType="button-primary"
                                classname="rounded-full mt-[5vh] shadow-lg md:scale-[1.5] max-md:scale-[1.3] mb-[10vh] min-w-[15vw]"
                            >
                                <Link href={linkCarry}
                                    className="block w-[100%] h-[100%]"
                                >
                                    ادامه ماجرا
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
                <ChallengPopUp 
                    type="text"
                    text="چالش امروزتو انجام بده!"
                    openPopUp={true}
                    onClose={handlePopupClose}
                />
                {/* <ChallengPopUp 
                    type="form"
                    question="پس درباره‌ش برامون یه جمله بنویس:"
                    openPopUp={false}
                    onClose={handlePopupClose}
                    onSubmit={handlePopUpSubmit}
                /> */}
                <div
                    className="fixed bottom-[3vh] right-[4vh] p-4 bg-[var(--primary-color1)]/30 backdrop-blur-xl flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-[var(--primary-color1)]15 transition-all duration-200 max-md:text-[2rem] max-md:p-2 max-md:right-[2.5vw] max-md:bottom-[2vh]"
                    onClick={() => setIsChatBotOpen(!isChatBotOpen)}
                >
                    <Button
                        classname={clsx(
                            'transition-all duration-400',
                            isChatBotOpen && 'rotate-360'
                        )}
                    >
                        <TbMessageChatbot 
                            className="text-[3rem] max-md:text-[2.4rem] text-[white] cursor-pointer"
                        />
                    </Button>
                </div>
                <ChatBot 
                    isOpen={isChatBotOpen}
                />
            </div>
        </AnimatePresence>
    );
}

export default Home;
