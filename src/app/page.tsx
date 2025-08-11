"use client"
import { GiHiveMind } from "react-icons/gi";
import { ImClock2 } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { MdPsychologyAlt } from "react-icons/md";
import React, { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";



interface GuidedPathsType {
    name: string;
    component?: React.ReactNode;
}

const GuidedPaths: GuidedPathsType[] = [
    {
        name: "Time Management",
        component: <></>
    },
    {
        name: "Problem Solving",
        component: <></>
    },
    {
        name: "Teamwork",
        component: <></>
    },
    {
        name: "Communication",
        component: <></>
    }
]


const Home = () => {
    const [selectedGuide, setSelectedGuide] = useState<string>("Time Management");

    const handleNavigation = (guidedPath: string) => {
        setSelectedGuide(guidedPath);
    }

    return (
        <div className="h-[200vh]">
            <section
                className="flex flex-col items-center mb-[5vh]"
            >
                <div 
                    className="my-[4vh] px-[4vw]"
                >
                    <video 
                        src="/learn-by-doing.webm"
                        className="max-md:hidden"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                    />
                    <video 
                        src="/learn-by-doing-mobile.webm" 
                        className="md:hidden"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
                <p
                    className="text-[1.6rem] max-w-[80%] mx-auto max-md:text-[1.2rem]"
                >
                    Interactive problem solving that’s effective and fun. Get smarter in 15 minutes a day.
                </p>
                <button
                    className="button-primary rounded-full mt-[2rem] shadow md:scale-[1.5] max-md:scale-[1.3] mb-[10vh]"
                >
                    Get started
                </button>
                <hr className="self-stretch border-t border-[var(--text-desable)] opacity-80" />
                <div
                    className="flex justify-between gap-[1rem] w-[80%] pt-[5vh] max-[1200px]:scale-[0.9] max-[1200px]:w-[100%] max-md:scale-[0.8] max-md:w-[115%] max-[500px]:justify-around"
                >   
                    <div className="flex gap-[0.5rem] items-center max-md:gap-[0.5rem]">
                        <GiHiveMind
                            className="text-[3rem] text-[var(--secondary-color1)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">Commiunication</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center">
                        <ImClock2 
                            className="text-[2.8rem] text-[var(--secondary-color2)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">Time management</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center max-[500px]:hidden">
                        <FaUsers 
                            className="text-[3rem] text-[var(--secondary-color3)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">Teamwork</span>
                    </div>
                    <div className="flex gap-[0.8rem] items-center max-[580px]:hidden">
                        <MdPsychologyAlt 
                            className="text-[3rem] text-[var(--accent-color2)]"
                        />
                        <span className="text-[1.4rem] font-[650] max-lg:text-[1rem]">Problem solving</span>
                    </div>
                </div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh]">
                    <h2 className="font-[750] text-[3rem] max-[1200px]:font-[700] max-md:text-[2rem] text-center py-[10vh]">
                        Join over 10 million learners worldwide
                    </h2>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-1 max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 left-0 w-4/5 max-md:w-full ml-[-30vw] max-[1100px]:ml-0">
                    <img src="/concepts-that-click.svg" alt="concepts that click" className="w-full h-auto object-contain object-bottom max-[1100px]:object-cover" />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-4 col-end-7 max-md:w-[90%]"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        Concepts that click
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        Interactive lessons make even complex ideas easy to grasp. Instant, custom feedback accelerates your understanding.
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
                    className="px-8 flex flex-col justify-center col-start-2 col-end-6 max-md:w-[90%] z-2"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        Learn at your level
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                    >
                        Brush up on the basics or learn new skills. Designed for learners ages 13 to 113.
                    </p>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-[1fr] max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 w-5/6 max-md:w-full ml-[-30vw] max-[1100px]:ml-[-15vw] max-md:mr-[]">
                    <img src="/stay-motivated-v3.svg" alt="concepts that click" className="max-md:w-[100vw] w-full h-auto object-contain object-right " />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-4 col-end-7 max-md:w-[90%]"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        Concepts that click
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        Interactive lessons make even complex ideas easy to grasp. Instant, custom feedback accelerates your understanding.
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
                    className="px-8 flex flex-col justify-center col-start-2 col-end-6 max-md:w-[90%] z-2"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        Learn at your level
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] md:max-w-[60%]"
                    >
                        Brush up on the basics or learn new skills. Designed for learners ages 13 to 113.
                    </p>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] max-[1100px]:grid-cols-[1fr] max-md:grid-rows-[1fr_1fr] overflow-x-hidden min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <div className="absolute bottom-0 w-5/6 max-md:w-full ml-[-40vw] max-[1100px]:ml-[-20vw] max-md:mr-[]">
                    <img src="/more-effective-v3.svg" alt="concepts that click" className="max-md:w-[100vw] w-full h-auto object-contain object-right " />
                </div>
                <div 
                    className="px-8 flex flex-col justify-center col-start-4 col-end-7 max-md:w-[90%]"
                >
                    <h1
                        className="h1 max-w-[15vw] max-[1300px]:max-w-[20vw] max-[550px]:max-w-[30vw] max-[400px]:max-w-[40vw]"
                    >
                        Concepts that click
                    </h1>
                    <p
                        className="text-[1.6rem] max-md:text-[1.2rem] max-w-[85%]"
                    >
                        Interactive lessons make even complex ideas easy to grasp. Instant, custom feedback accelerates your understanding.
                    </p>
                </div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh]">
                    <h2 className="font-[750] text-[3rem] max-[1200px]:font-[700] max-md:text-[2rem] text-center py-[10vh]">
                        Join over 10 million learners worldwide
                    </h2>
                </div>
            </section>
            <section
                className="bg-[var(--primary-color4)] min-h-[80vh] max-md:min-h-[60vh] relative" 
            >
                <h2 className="font-[750] text-[var(--text-primary)] text-[5rem] max-[1200px]:font-[700] max-md:text-[3rem] text-center py-[10vh]">
                    Guided paths for every journey
                </h2>
                <nav>
                    <ul 
                        className="flex justify-center items-center p-2 gap-[1.6rem] bg-[var(--primary-color3)] w-fit mx-auto rounded-[1rem]"
                    >
                        {GuidedPaths.map((guidedPath, index) => (  
                            <div key={index}>
                                <li 
                                    onClick={e => handleNavigation(guidedPath.name)}
                                    className={clsx(
                                        "cursor-pointer font-[650] py-4 px-6 rounded-[0.8rem] transition-all duration-300",
                                        selectedGuide === guidedPath.name 
                                            ? "bg-[var(--primary-color4)] text-[var(--text-primary)]"
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
                    {GuidedPaths.find(guidedPath => guidedPath.name === selectedGuide)?.component}
                </motion.div>
            </section>
            <section
                className="bg-[url(/social-proof-background.svg)] bg-[var(--section-color)] text-[var(--text-secondary)]"
            >
                <div className="min-h-[80vh] flex flex-col items-center">
                    <h2 className="font-[750] text-[var(--primary-color3)] text-[5rem] max-[1200px]:font-[700] max-md:text-[3rem] text-center py-[10vh]">
                        Start your journey
                    </h2>
                    <button
                        className="button-primary rounded-full mt-[2rem] shadow-lg md:scale-[1.5] max-md:scale-[1.3] mb-[10vh] min-w-[15vw]"
                    >
                        Get started
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;
