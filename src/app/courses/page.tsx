"use client"
import { useState, useEffect } from "react";
import CourseCard from "@/components/courseCard";
import { CurseCardProps, CourseCardOpen } from "@/components/courseCard";
import { LuBrain } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import * as LuIcons from "react-icons/lu";

const getIconComponent = (iconName?: string) => {
    if (!iconName) return LuIcons.LuBrain;
    return (LuIcons as any)[iconName] || LuIcons.LuBrain;
};

const CursesArray: CurseCardProps[] = [
    {
        courseId: "python",
        title: "شکستن سدهای ذهن",
        description: `«گاهی مانع، همان راه است.»
        درون هر کدام از ما صدایی هست که پیش از هر حرکت، زمزمه می‌کند: «نکن... هنوز وقتش نیست... آماده نیستی.»
        این مسیر، سفری کوتاه و عمیق است برای شنیدن آن صدا، دیدنش بی‌پرده، و تبدیلش به چراغ راه.
        اینجا یاد می‌گیری که به جای انتظار برای انگیزه، با یک حرکت کوچک جرقه بزنی.
        نه برای اینکه همه‌چیز کامل باشد، بلکه برای اینکه جریان زندگی دوباره جاری شود.
        دو مهارت را در دست می‌گیری: شکست سدهای ذهنی، و عمل کردن در همان لحظه‌ای که ذهن می‌گوید «صبر کن».
        این‌ها کلیدهایی‌اند که قفلِ شروع و ادامه‌دادن را با هم باز می‌کنند.

        نغز، جایی است که مانع‌ها تبدیل به پله می‌شوند، و تردید، آغاز حرکت است.`,
        icon: LuBrain,
        layoutId: "breaking-Mind",
        isActive: true,
    },
    {
        title: "مدیریت احساسات زیر فشار",
        description: `فشار، مثل آتش است؛ می‌تواند بسوزاند یا شکل بدهد.
        در لحظه‌های پرتنش، واکنش ما آینده را می‌سازد.
        در این مسیر کوتاه، یاد می‌گیری احساساتت را در لحظه‌های فشار بشناسی، از واکنش‌های شتاب‌زده فاصله بگیری، و پاسخ‌هایی آگاهانه و سازنده بدهی.
        نغز، جایی است که آتش فشار را به نورِ وضوح و قدرت تبدیل می‌کنیم.`,
        icon: LuBrain,
        layoutId: "managing-Under-Pressure",
        isActive: false,
    },
    {
        title: "تمرکز در دنیای پرحواس‌پرتی",
        description: `ذهن ما باغی است که هر لحظه، هزار بذرِ افکار و حواس‌پرتی در آن می‌افتد.
        تمرکز، یعنی انتخاب آگاهانهٔ آنچه باید رشد کند.
        در این سفر کوتاه، یاد می‌گیری حواس‌پرتی‌ها را تشخیص دهی، با چند حرکت ساده ذهن را به لحظه بازگردانی، و کاری را که آغاز کرده‌ای، به سرانجام برسانی.
        نغز، جایی است که از دل آشوبِ بیرون، سکوت و وضوحی می‌سازیم که مسیر را روشن می‌کند.`,
        icon: LuBrain,
        layoutId: "fucosing-while-overwhelmed",
        isActive: false,
    }
]

const Curses = () => {
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error } = useSelector((state: RootState) => state.course);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleModalOpen = (id: string | null) => {
        setIsModalOpen(id);
    }

    const handleStartOnClick = (slug: string) => {
        router.push(`/courses/${slug}`)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] text-lg">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    )
    if (error) return <div>Error: {error}</div>
    return (
        <div 
            dir="rtl"
            className="mt-[2rem] p-12"
        >
            <h1 className="text-center text-[4rem] font-bold maxx-md:text-[2rem] mb-[2rem]">دوره های آموزشی</h1>
            <div
                className="px-[15vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem]"
            >
                <AnimatePresence>
                    {courses.map((course) => (
                        <CourseCard 
                            key={course.id}
                            title={course.title}
                            description={course.description}
                            icon={getIconComponent(course.icon_name)}
                            layoutId={course.slug}
                            isActive={course.is_active}
                            onClick={() => handleModalOpen(course.id!)}
                        />
                    ))}
                </AnimatePresence>
                {isModalOpen !== null &&
                    <div className="fixed inset-0 z-50000 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => handleModalOpen(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />

                        <div className="relative z-10" onClick={e => e.stopPropagation()}>
                            {(() => {
                                const course = courses.find(course => course.id === isModalOpen);
                                if (!course) return null;
                                
                                return (
                                    <CourseCardOpen
                                        key={course.id}
                                        title={course.title}
                                        description={course.description}
                                        icon={getIconComponent(course.icon_name)}
                                        layoutId={course.slug}
                                        isActive={course.is_active}
                                        onClick={() => handleModalOpen(null)}
                                        startOnClick={course.slug ? () => handleStartOnClick(course.slug!) : undefined}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
} 

export default Curses;