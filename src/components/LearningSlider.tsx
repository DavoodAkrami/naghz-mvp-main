"use client"
import React, { useEffect, useMemo, useState } from "react"
import { MdKeyboardArrowLeft } from "react-icons/md";
import Learning from "./Learning";
import { LearningPropsType } from "./Learning";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/config/supabase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ButtonLoading from "./ButtonLoading";
import { IoHeartSharp } from "react-icons/io5";
import { fetchUserHearts } from "@/store/slices/heartSlice";
import { RxCross2 } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import Modal from "./Modal";
import Button from "./Button";



type DbPage = {
  id: string;
  page_number: number;
  page_type: "text" | "test" | "testNext";
  name?: string;
  title?: string;
  content?: string;
  question?: string;
  test_type?: "Default" | "Multiple" | "Sequential" | "Pluggable" | "Input";
  test_grid?: "col" | "grid-2" | "grid-row";
  correct_answer?: number[];
  image?: string;
  why?: string | null;
  ai_enabled?: boolean;
  give_feedback?: boolean;
  give_point?: boolean;
  give_point_by_ai?: boolean;
  score_threshold?: number;
  low_score_page_id?: string | null;
  high_score_page_id?: string | null;
  tip?: string;
  system_prompt?: string;
};

type DbOption = {
  id: string;
  page_id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name?: string;
  next_page_id?: string | null;
};

interface LearningSliderProps extends LearningPropsType {
  preloadedPages?: DbPage[];
  preloadedOptions?: Record<string, DbOption[]>;
  skipDatabase?: boolean;
  challengePage?: boolean;
}

const LearningSlider: React.FC<LearningSliderProps> = (props: LearningSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(props.page_number - 1);
  const [pages, setPages] = useState<DbPage[]>([]);
  const [optionsByPageId, setOptionsByPageId] = useState<Record<string, DbOption[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const router = useRouter();
  const pathname = usePathname();
  const [isConfirmCloseModalOpen, setisConfirmCloseModalOpen] = useState(false);
  
  
  const { nextPageId } = useSelector((state: RootState) => state.ai);
  const { hearts, heartsLoading } = useSelector((state: RootState) => state.hearts);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserHearts(user?.id || ""));
  }, [currentIndex])

  useEffect(() => {
    const loadPages = async () => {
      // If we have preloaded data, use it instead of fetching from database
      if (props.preloadedPages && props.skipDatabase) {
        setPages(props.preloadedPages);
        if (props.preloadedOptions) {
          setOptionsByPageId(props.preloadedOptions);
        }
        setLoading(false);
        return;
      }

      // Original database loading logic
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
  }, [props.course_id, props.preloadedPages, props.skipDatabase]);

  const loadOptionsForPage = async (pageId: string) => {
    if (optionsByPageId[pageId]) return; // cached
    if (!supabase) return;
    const { data } = await supabase
      .from("page_options")
      .select("id,page_id,option_text,option_order,is_correct,icon_name,next_page_id")
      .eq("page_id", pageId)
      .order("option_order");
    setOptionsByPageId(prev => ({ ...prev, [pageId]: (data || []) as DbOption[] }));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < (pages.length || props.pageLength) - 1;

  const continueSound = useMemo(() => new Audio('/sounds/continue.mp3'), []);

  const handleNext = async () => {
    if (!canGoNext) return;
    const nextIndex = currentIndex + 1;
    continueSound.play();
    setDirection(1);
    setCurrentIndex(nextIndex);
    const page = pages[nextIndex];
    if (page) await loadOptionsForPage(page.id);
  };

  const pageIndexById = useMemo(() => {
    const map: Record<string, number> = {};
    pages.forEach((p, idx) => { map[p.id] = idx; });
    return map;
  }, [pages]);

  // Handle AI routing when nextPageId changes
  useEffect(() => {
    if (nextPageId && pageIndexById[nextPageId] !== undefined) {
      const targetIndex = pageIndexById[nextPageId];
      setDirection(1);
      setCurrentIndex(targetIndex);
      const page = pages[targetIndex];
      if (page) loadOptionsForPage(page.id);
    }
  }, [nextPageId, pageIndexById, pages]);

  const handleTestNextSelect = async (optionOrder: number) => {
    const page = pages[currentIndex];
    if (!page) return;
    const opts = optionsByPageId[page.id] || [];
    const opt = opts.find(o => o.option_order === optionOrder);
    const targetId = opt?.next_page_id || null;
    if (targetId && pageIndexById[targetId] !== undefined) {
      const nextIdx = pageIndexById[targetId];
      setDirection(1);
      setCurrentIndex(nextIdx);
      await loadOptionsForPage(pages[nextIdx].id);
    } else {
      await handleNext();
    }
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
      name: page.name || "",
      test_type: page.test_type,
      test_grid: page.test_grid,
      question: page.question,
      options: opts.map(o => ({ id: o.option_order, text: o.option_text, isCorrect: o.is_correct, icon_name: o.icon_name })),
      correct_answer: page.correct_answer,
      course_id: props.course_id,
      page_number: currentIndex + 1,
      pageLength: pages.length || props.pageLength,
      image: page.image,
      why: page.why || null,
      ai_enabled: page.ai_enabled || false,
      give_feedback: page.give_feedback || false,
      give_point: page.give_point || false,
      give_point_by_ai: page.give_point_by_ai ?? page.give_point ?? false,
      score_threshold: page.score_threshold || 50,
      low_score_page_id: page.low_score_page_id || null,
      high_score_page_id: page.high_score_page_id || null,
      tip: page.tip,
      system_prompt: page.system_prompt || ""
    };
  }, [pages, currentIndex, optionsByPageId, props.course_id, props.pageLength]);
  const allImages = useMemo(() => {
    return pages
      .map(page => page.image)
      .filter(Boolean) as string[];
  }, [pages]);

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
        <Button onClick={handlePrevious} disabled={!canGoPrev} classname="disabled:opacity-40">
            <MdKeyboardArrowLeft 
                className="text-[2rem] cursor-pointer"
            />
        </Button>
        <div className="w-[70%] max-md:w-[70%] mx-auto bg-gray-700 rounded-full h-4">
          <motion.div
            className="bg-[var(--accent-color1)] h-4 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / (pages.length || props.pageLength)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div
          className="flex gap-[10px] items-center justify-center"
        >
          <div>
            {heartsLoading ? (
              <ButtonLoading size="md" color="primary" />
            ) : (
              <div className="flex gap-[8px] max-md:scale-[0.8] max-md:gap-[4px] items-center text-[1.5rem]">
                <IoHeartSharp className="text-red-500 mb-[3px]"/>
                <span>
                  {hearts}
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => {
            setisConfirmCloseModalOpen(true);
          }}
        >
            <RxCross2 className="text-[1.5rem] ml-[10px] mb-[3px]"/>
        </div>
        <Modal
          onOpen={isConfirmCloseModalOpen}
          onClose={() => setisConfirmCloseModalOpen(false)}
        >
          <div>
            <h1
              className="h2 mb-[2rem]"
            >آیا می خواهید از درس خارج شوید؟</h1>
            <div
              className="flex gap-[10px] w-full"
            >
              <Button
                onClick={() => setisConfirmCloseModalOpen(false)}
                buttonType="button-secondary"
                classname="rounded-xl shadow-xl w-full"
              >
                خیر
              </Button>
              <Button
                onClick={() => {
                  const path = pathname || "/";
                  const segments = path.split("/").filter(Boolean);
                  const parent = segments.slice(0, -1).join("/");
                  const target = "/" + parent;
                  router.push(target === "/" ? "/" : target);
                }}
                buttonType="button-primary"
                classname="rounded-xl shadow-xl w-full"
              >
                بله
              </Button>
            </div>
          </div>
        </Modal>
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
            preloadedImages={allImages}
            onTestNextSelect={handleTestNextSelect}
            challengePage={props.challengePage || false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LearningSlider;