import React, { useEffect, useMemo, useState } from "react"
import { MdKeyboardArrowLeft } from "react-icons/md";
import Learning from "./Learning";
import { LearningPropsType } from "./Learning";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/config/supabase";

type DbPage = {
  id: string;
  page_number: number;
  page_type: "text" | "test";
  title?: string;
  content?: string;
  question?: string;
  test_type?: "Default" | "Multiple" | "Sequential" | "Pluggable";
  test_grid?: "col" | "grid-2" | "grid-row";
  correct_answer?: number[];
  image?: string;
};

type DbOption = {
  id: string;
  page_id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name?: string;
};

const LearningSlider: React.FC<LearningPropsType> = (props: LearningPropsType) => {
  const [currentIndex, setCurrentIndex] = useState<number>(props.page_number - 1);
  const [pages, setPages] = useState<DbPage[]>([]);
  const [optionsByPageId, setOptionsByPageId] = useState<Record<string, DbOption[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const loadPages = async () => {
      if (!supabase) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("course_pages")
        .select("*")
        .eq("course_id", props.course_id)
        .order("page_number");
      if (!error && data) {
        setPages(data as DbPage[]);
        // Preload options for the initial page
        const initial = (data as DbPage[])[props.page_number - 1];
        if (initial) await loadOptionsForPage(initial.id);
      }
      setLoading(false);
    };
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.course_id]);

  const loadOptionsForPage = async (pageId: string) => {
    if (optionsByPageId[pageId]) return; // cached
    if (!supabase) return;
    const { data } = await supabase
      .from("page_options")
      .select("*")
      .eq("page_id", pageId)
      .order("option_order");
    setOptionsByPageId(prev => ({ ...prev, [pageId]: (data || []) as DbOption[] }));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < (pages.length || props.pageLength) - 1;

  const handleNext = async () => {
    if (!canGoNext) return;
    const nextIndex = currentIndex + 1;
    setDirection(1);
    setCurrentIndex(nextIndex);
    const page = pages[nextIndex];
    if (page) await loadOptionsForPage(page.id);
  };

  const handlePrevious = async () => {
    if (!canGoPrev) return;
    const prevIndex = currentIndex - 1;
    setDirection(-1);
    setCurrentIndex(prevIndex);
    const page = pages[prevIndex];
    if (page) await loadOptionsForPage(page.id);
  };

  const currentTransformed: LearningPropsType | null = useMemo(() => {
    if (!pages.length) return null;
    const page = pages[currentIndex];
    if (!page) return null;
    const opts = optionsByPageId[page.id] || [];
    return {
      id: page.id,
      page_type: page.page_type,
      header: page.title,
      text: page.content,
      test_type: page.test_type,
      test_grid: page.test_grid,
      question: page.question,
      options: opts.map(o => ({ id: parseInt(o.id), text: o.option_text, isCorrect: o.is_correct, icon_name: o.icon_name })),
      correct_answer: page.correct_answer,
      course_id: props.course_id,
      page_number: currentIndex + 1,
      pageLength: pages.length || props.pageLength,
      image: page.image,
    };
  }, [pages, currentIndex, optionsByPageId, props.course_id, props.pageLength]);

  const variants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  if (loading || !currentTransformed) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]" dir="rtl">
        <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color2)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)] text-lg">
            در حال بارگذاری...
        </p>
        </div>
        </div>
  )

  return (
    <div className="">
      <div dir="ltr" className="flex items-center justify-center w-[70%] mx-auto py-[3vh] max-md:w-[95%] mb-0">
        <button onClick={handlePrevious} disabled={!canGoPrev} className="disabled:opacity-40">
            <MdKeyboardArrowLeft 
                className="text-[2rem] cursor-pointer"
            />
        </button>
        <div className="w-[70%] max-md:w-[85%] mx-auto bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-[var(--accent-color1)] h-3 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / (pages.length || props.pageLength)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentTransformed.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.25 }}
        >
          <Learning
            {...currentTransformed}
            handleNext={handleNext}
            handlePrev={handlePrevious}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LearningSlider;