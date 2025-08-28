"use client"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourses, fetchAllCourses } from "@/store/slices/courseSlice";
import { fetchFullCourses, createFullCourse, updateFullCourse, deleteFullCourse } from "@/store/slices/fullCourseSlice";
import { uploadPageImage } from "@/store/slices/coursePageSlice";
import { supabase } from "@/config/supabase";
import { FiPlus, FiEdit, FiTrash2, FiMove, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import Modal from "@/components/Modal";
import ButtonLoading from "@/components/ButtonLoading";
import { uploadFullCourseImage } from "@/store/slices/fullCourseSlice";


interface CourseFormData {
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  order_index: number;
  full_course_id?: string;
  order_within_full_course?: number;
}

interface FullCourseFormData {
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image?: string;
  is_active: boolean;
  order_index: number;
}

interface PageFormData {
  id?: string;
  page_number: number;
  page_type: 'text' | 'test' | 'testNext';
  name?: string;
  title: string;
  content: string;
  question: string;
  test_type: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input';
  test_grid: 'col' | 'grid-2' | 'grid-row';
  correct_answer: number[];
  page_length: number;
  order_index: number;
  image?: string;
  why?: string | null;
  ai_enabled: boolean;
  give_feedback: boolean;
  give_point: boolean;
  score_threshold: number;
  low_score_page_id?: string | null;
  high_score_page_id?: string | null;
  tip?: string;
}

interface OptionFormData {
  id?: string;
  page_id?: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name: string;
  next_page_id?: string | null;
}

export default function CourseManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, courseloading, error } = useSelector((state: RootState) => state.course);
  const { coursePageLoading } = useSelector((state: RootState) => state.coursePage)
  const { fullCourses, fullCourseLoading} = useSelector((state: RootState) => state.fullCourse);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Course management states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<unknown>(null);
  const [courseFormData, setCourseFormData] = useState<CourseFormData>({
    slug: '',
    title: '',
    description: '',
    icon_name: '',
    is_active: true,
    order_index: 0,
    full_course_id: '',
    order_within_full_course: 0
  });

  // Admin filter state
  const [showInactiveCourses, setShowInactiveCourses] = useState(false);

  // Full course management states
  const [showCreateFullCourseModal, setShowCreateFullCourseModal] = useState(false);
  const [showEditFullCourseModal, setShowEditFullCourseModal] = useState(false);
  const [showDeleteFullCourseModal, setShowDeleteFullCourseModal] = useState(false);
  const [selectedFullCourse, setSelectedFullCourse] = useState<unknown>(null);
  const [fullCourseFormData, setFullCourseFormData] = useState<FullCourseFormData>({
    slug: '',
    title: '',
    description: '',
    icon_name: '',
    image: '',
    is_active: true,
    order_index: 0
  });
  const [fullCourseImageFile, setFullCourseImageFile] = useState<File | null>(null);
  const [uploadingFullCourseImage, setUploadingFullCourseImage] = useState<boolean>(false);
  const [pages, setPages] = useState<PageFormData[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showPageModal, setShowPageModal] = useState(false);
  const [pageFormData, setPageFormData] = useState<PageFormData>({
    page_number: 1,
    page_type: 'text',
    name: '',
    title: '',
    content: '',
    question: '',
    test_type: 'Default',
    test_grid: 'col',
    correct_answer: [],
    page_length: 1,
    order_index: 0,
    image: '',
    why: null,
    ai_enabled: false,
    give_feedback: false,
    give_point: false,
    score_threshold: 0,
    low_score_page_id: null,
    high_score_page_id: null,
    tip: "",
  });
  const [optionsByPage, setOptionsByPage] = useState<Record<number, OptionFormData[]>>({});
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [originalPageIds, setOriginalPageIds] = useState<string[]>([]);
  const [imagesByPage, setImagesByPage] = useState<Record<number, File | null>>({});
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reorderPages, setReorderPages] = useState<PageFormData[]>([]);
  const [reorderOptionsByPage, setReorderOptionsByPage] = useState<Record<number, OptionFormData[]>>({});
  const [showReorderModal, setShowReorderModal] = useState(false);

  // Converts the UI's number[] into DB JSONB per test type
  const toDbCorrectAnswer = (
    testType: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input',
    values: number[]
  ): number | number[] | [number, number][] | null => {
    switch (testType) {
      case 'Default':
        return typeof values?.[0] === 'number' ? values[0] : null;
      case 'Multiple':
      case 'Sequential':
      case 'Input':
        return Array.isArray(values) ? values : [];
      case 'Pluggable': {
        const pairs: [number, number][] = [];
        for (let i = 0; i < values.length; i += 2) {
          if (typeof values[i] === 'number' && typeof values[i + 1] === 'number') {
            pairs.push([values[i], values[i + 1]]);
          }
        }
        return pairs;
      }
      default:
        return Array.isArray(values) ? values : [];
    }
  };

  // Converts DB JSONB back into UI number[] for editing
  const fromDbCorrectAnswer = (val: unknown): number[] => {
    if (typeof val === 'number') return [val];
    if (Array.isArray(val)) {
      if (val.length > 0 && Array.isArray(val[0])) {
        const flat: number[] = [];
        for (const pair of val as unknown[]) {
          if (Array.isArray(pair) && typeof pair[0] === 'number' && typeof pair[1] === 'number') {
            flat.push(pair[0], pair[1]);
          }
        }
        return flat;
      }
      return val as number[];
    }
    return [];
  };

  const getPageDisplayText = (page: PageFormData) => {
    if (page.name && page.name.trim()) {
      return page.name;
    }
    if (page.title && page.title.trim()) {
      return page.title;
    }
    if (page.question && page.question.trim()) {
      return page.question;
    }
    return `صفحه ${page.page_number}`;
  };

  const swapArrayItems = <T,>(arr: T[], i: number, j: number) => {
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };
  
  const swapObjKeys = <T extends Record<number, any>>(obj: T, i: number, j: number): T => {
    const copy: T = { ...obj };
    const ti = copy[i];
    const tj = copy[j];
    copy[i] = tj;
    copy[j] = ti;
    return copy;
  };
  
  const renumberPagesInPlace = (list: PageFormData[]) => {
    list.forEach((p, idx) => {
      p.page_number = idx + 1;
      p.order_index = idx;
    });
  };
  

  const movePageUp = (pageIndex: number) => {
    if (pageIndex === 0) return;
  
    const newPages = swapArrayItems(pages, pageIndex, pageIndex - 1);
    setOptionsByPage(prev => swapObjKeys(prev, pageIndex, pageIndex - 1));
    setImagesByPage(prev => swapObjKeys(prev, pageIndex, pageIndex - 1));
  
    renumberPagesInPlace(newPages);
    setPages(newPages);
  };
  
  const movePageDown = (pageIndex: number) => {
    if (pageIndex === pages.length - 1) return;
  
    const newPages = swapArrayItems(pages, pageIndex, pageIndex + 1);
    setOptionsByPage(prev => swapObjKeys(prev, pageIndex, pageIndex + 1));
    setImagesByPage(prev => swapObjKeys(prev, pageIndex, pageIndex + 1));
  
    renumberPagesInPlace(newPages);
    setPages(newPages);
  };
  

  const openReorderModal = () => {
    setReorderPages([...pages]);
    setReorderOptionsByPage({...optionsByPage});
    setShowReorderModal(true);
  };

  const moveReorderPageUp = (pageIndex: number) => {
    if (pageIndex === 0) return;
  
    const newPages = swapArrayItems(reorderPages, pageIndex, pageIndex - 1);
    const newOpts = swapObjKeys(reorderOptionsByPage, pageIndex, pageIndex - 1);
  
    renumberPagesInPlace(newPages);
    setReorderPages(newPages);
    setReorderOptionsByPage(newOpts);
  };
  
  const moveReorderPageDown = (pageIndex: number) => {
    if (pageIndex === reorderPages.length - 1) return;
  
    const newPages = swapArrayItems(reorderPages, pageIndex, pageIndex + 1);
    const newOpts = swapObjKeys(reorderOptionsByPage, pageIndex, pageIndex + 1);
  
    renumberPagesInPlace(newPages);
    setReorderPages(newPages);
    setReorderOptionsByPage(newOpts);
  };
  

  const confirmReorder = () => {
    setPages(reorderPages);
    setOptionsByPage(reorderOptionsByPage);
    setShowReorderModal(false);
  };

  const cancelReorder = () => {
    setShowReorderModal(false);
  };

  useEffect(() => {
    // Fetch all courses for admins, only active courses for regular users
    if (user?.user_metadata?.role === 'admin') {
      dispatch(fetchAllCourses());
    } else {
      dispatch(fetchCourses());
    }
    dispatch(fetchFullCourses());
  }, [dispatch, user?.user_metadata?.role]);

  // Debug: Log course data to see the structure
  useEffect(() => {
    if (courses.length > 0 || fullCourses.length > 0) {
      console.log('Courses:', courses);
      console.log('Full Courses:', fullCourses);
      courses.forEach(course => {
        console.log(`Course "${course.title}" has full_course_id:`, course.full_course_id);
      });
    }
  }, [courses, fullCourses]);

  // Full Course CRUD Functions
  const handleCreateFullCourse = async () => {
    try {
      await dispatch(createFullCourse(fullCourseFormData)).unwrap();
      setShowCreateFullCourseModal(false);
      setFullCourseFormData({
        slug: '',
        title: '',
        description: '',
        icon_name: '',
        image: '',
        is_active: true,
        order_index: 0
      });
    } catch (error) {
      console.error('Error creating full course:', error);
    }
  };

  const handleEditFullCourse = async () => {
    try {
      if (selectedFullCourse && typeof selectedFullCourse === 'object' && 'id' in selectedFullCourse) {
        await dispatch(updateFullCourse({
          id: selectedFullCourse.id as string,
          updates: fullCourseFormData
        })).unwrap();
        setShowEditFullCourseModal(false);
        setSelectedFullCourse(null);
        setFullCourseFormData({
          slug: '',
          title: '',
          description: '',
          icon_name: '',
          image: '',
          is_active: true,
          order_index: 0
        });
      }
    } catch (error) {
      console.error('Error updating full course:', error);
    }
  };

  const handleDeleteFullCourse = async () => {
    try {
      if (selectedFullCourse && typeof selectedFullCourse === 'object' && 'id' in selectedFullCourse) {
        await dispatch(deleteFullCourse(selectedFullCourse.id as string)).unwrap();
        setShowDeleteFullCourseModal(false);
        setSelectedFullCourse(null);
      }
    } catch (error) {
      console.error('Error deleting full course:', error);
    }
  };

  const openEditFullCourseModal = (fullCourse: any) => {
    setSelectedFullCourse(fullCourse);
    setFullCourseFormData({
      slug: fullCourse.slug,
      title: fullCourse.title,
      description: fullCourse.description,
      icon_name: fullCourse.icon_name || '',
      image: fullCourse.image || '',
      is_active: fullCourse.is_active,
      order_index: fullCourse.order_index
    });
    setShowEditFullCourseModal(true);
  };

  const openDeleteFullCourseModal = (fullCourse: any) => {
    setSelectedFullCourse(fullCourse);
    setShowDeleteFullCourseModal(true);
  };

  const openCreateCourseModal = (fullCourse?: any) => {
    if (fullCourse) {
      setSelectedFullCourse(fullCourse);
    }
    setShowCreateModal(true);
  };

  const refreshCourses = () => {
    if (user?.user_metadata?.role === 'admin') {
      dispatch(fetchAllCourses());
    } else {
      dispatch(fetchCourses());
    }
  };

  const handleCreateCourse = async () => {
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      // Form validation
      if (!courseFormData.slug || !courseFormData.title || !courseFormData.description) {
        alert('لطفاً تمام فیلدهای ضروری را پر کنید (Slug، عنوان، توضیحات)');
        return;
      }
      
      if (pages.length === 0) {
        alert('لطفاً حداقل یک صفحه به دوره اضافه کنید');
        return;
      }
      
      // Validate pages
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (!page.title || !page.content) {
          alert(`صفحه ${i + 1}: لطفاً عنوان و محتوا را پر کنید`);
          return;
        }
        
        if (page.page_type === 'test' && (!page.question || (optionsByPage[i] || []).length === 0)) {
          alert(`صفحه ${i + 1}: لطفاً سوال و گزینه‌ها را برای آزمون پر کنید`);
          return;
        }
      }
      
      console.log('Creating course with data:', courseFormData);
      console.log('Selected full course:', selectedFullCourse);
      console.log('Pages to create:', pages);
      
      // Set the full_course_id if we're creating within a full course context
      const courseDataToInsert = {
        ...courseFormData,
        full_course_id: selectedFullCourse && typeof selectedFullCourse === 'object' && 'id' in selectedFullCourse 
          ? (selectedFullCourse as { id: string }).id 
          : courseFormData.full_course_id || null
      };
      
      console.log('Course data to insert:', courseDataToInsert);
      console.log('Full course ID being set:', courseDataToInsert.full_course_id);
      
      // Additional validation for full course linking
      if (!courseDataToInsert.full_course_id) {
        console.warn('No full course ID set - course will be created without a parent full course');
      }
      
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert(courseDataToInsert)
        .select()
        .single();
      
      if (courseError) {
        console.error('Course creation error:', courseError);
        console.error('Error details:', {
          message: courseError.message,
          details: courseError.details,
          hint: courseError.hint,
          code: courseError.code
        });
        
        // Provide more specific error messages
        if (courseError.code === '23505') {
          throw new Error(`دوره با slug "${courseDataToInsert.slug}" قبلاً وجود دارد`);
        } else if (courseError.code === '23503') {
          throw new Error(`خطا در ارتباط با مجموعه دوره - لطفاً مطمئن شوید که مجموعه دوره معتبر است`);
        } else {
          throw courseError;
        }
      }
      
      console.log('Course created successfully:', course);

      // Normalize page ordering just before persisting
      const orderedPages = pages
        .slice()
        .map((p, idx) => ({ ...p, page_number: idx + 1, order_index: idx, page_length: pages.length }));

      console.log('Ordered pages to create:', orderedPages);

      for (let i = 0; i < orderedPages.length; i++) {
        const page = orderedPages[i];
        console.log(`Creating page ${i + 1}:`, page);
        
        const { data: pageData, error: pageError } = await supabase
          .from('course_pages')
          .insert({
            ...page,
            correct_answer: toDbCorrectAnswer(page.test_type, page.correct_answer),
            course_id: course.id,
            tip: page.tip,
            name: page.name
          })
          .select()
          .single();
        
        if (pageError) {
          console.error(`Page ${i + 1} creation error:`, pageError);
          console.error(`Page ${i + 1} error details:`, {
            message: pageError.message,
            details: pageError.details,
            hint: pageError.hint,
            code: pageError.code
          });
          
          // Provide more specific error messages for page creation
          if (pageError.code === '23503') {
            throw new Error(`خطا در ایجاد صفحه ${i + 1}: دوره یافت نشد`);
          } else if (pageError.code === '23502') {
            throw new Error(`خطا در ایجاد صفحه ${i + 1}: فیلدهای ضروری خالی هستند`);
          } else {
            throw new Error(`خطا در ایجاد صفحه ${i + 1}: ${pageError.message}`);
          }
        }
        
        console.log(`Page ${i + 1} created successfully:`, pageData);

        // If an image is selected for this page, upload it and update DB
        const fileForPage = imagesByPage[i];
        if (fileForPage) {
          try {
            console.log(`Uploading image for page ${i + 1}:`, fileForPage);
            const result = await dispatch(uploadPageImage({ pageId: pageData.id as string, file: fileForPage })).unwrap();
            console.log(`Image upload result:`, result);
            // reflect in local state
            updatePage(i, { image: result.publicUrl });
          } catch (e) {
            console.error(`Failed to upload page image for page ${i + 1}:`, e);
          }
        }

        const pageOptions = optionsByPage[i] || [];
        if ((page.page_type === 'test' || page.page_type === 'testNext') && page.test_type !== 'Input' && pageOptions.length > 0) {
          console.log(`Creating ${pageOptions.length} options for page ${i + 1}:`, pageOptions);
          for (let j = 0; j < pageOptions.length; j++) {
            const option = pageOptions[j];
            const { error: optionError } = await supabase
              .from('page_options')
              .insert({
                option_text: option.option_text,
                option_order: option.option_order,
                is_correct: option.is_correct,
                icon_name: option.icon_name,
                page_id: pageData.id,
                next_page_id: option.next_page_id || null
              });
            
            if (optionError) {
              console.error(`Option ${j + 1} creation error:`, optionError);
              console.error(`Option ${j + 1} error details:`, {
                message: optionError.message,
                details: optionError.details,
                hint: optionError.hint,
                code: optionError.code
              });
              
              throw new Error(`خطا در ایجاد گزینه ${j + 1} برای صفحه ${i + 1}: ${optionError.message}`);
            }
          }
          console.log(`All options created successfully for page ${i + 1}`);
        }
      }
      
      console.log('Course creation completed successfully');
      
      setShowCreateModal(false);
      setSelectedFullCourse(null);
      setCourseFormData({
        slug: '',
        title: '',
        description: '',
        icon_name: '',
        is_active: true,
        order_index: 0,
        full_course_id: '',
        order_within_full_course: 0
      });
      setPages([]);
      setOptionsByPage({});
      refreshCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      // You might want to show this error to the user via a toast or alert
      alert(`خطا در ایجاد دوره: ${error instanceof Error ? error.message : 'خطای نامشخص'}`);
    }
  };

  const handleEditCourse = async () => {
    setEditLoading(true);
    try {
      if (!supabase || !selectedCourse) throw new Error('Supabase not configured or no course selected');

      const courseId = (selectedCourse as { id: string }).id;

      {
        const { error } = await supabase
          .from('courses')
          .update(courseFormData)
          .eq('id', courseId);
        if (error) throw error;
      }

      const orderedPages = pages
        .slice()
        .map((p, idx) => ({ ...p, page_number: idx + 1, order_index: idx, page_length: pages.length }));

      const currentPageIds = orderedPages.filter(p => p.id).map(p => p.id!) as string[];
      const pagesToDelete = originalPageIds.filter(id => !currentPageIds.includes(id));

      for (const pageId of pagesToDelete) {
        const { error: delOptErr } = await supabase.from('page_options').delete().eq('page_id', pageId);
        if (delOptErr) throw delOptErr;
        const { error: delPageErr } = await supabase.from('course_pages').delete().eq('id', pageId);
        if (delPageErr) throw delPageErr;
      }

      for (const p of orderedPages) {
        if (!p.id) continue;
        const { error: tmpErr } = await supabase
          .from('course_pages')
          .update({ page_number: 1000 + p.order_index })
          .eq('id', p.id);
        if (tmpErr) throw tmpErr;
      }

      for (let i = 0; i < orderedPages.length; i++) {
        const page = orderedPages[i];
        let pageId: string | undefined = page.id;

        if (pageId) {
          const { error: updErr } = await supabase
            .from('course_pages')
            .update({
              page_number: page.page_number,
              page_type: page.page_type,
              title: page.title,
              content: page.content,
              question: page.question,
              test_type: page.test_type,
              test_grid: page.test_grid,
              correct_answer: toDbCorrectAnswer(page.test_type, page.correct_answer),
              image: page.image,
              page_length: page.page_length,
              order_index: page.order_index,
              why: page.why,
              ai_enabled: page.ai_enabled,
              give_feedback: page.give_feedback,
              give_point: page.give_point,
              score_threshold: page.score_threshold,
              low_score_page_id: page.low_score_page_id,
              high_score_page_id: page.high_score_page_id,
              tip: page.tip,
              name: page.name
            })
            .eq('id', pageId);
          if (updErr) throw updErr;
        } else {
          const { data: insertedPage, error: insertPageError } = await supabase
             .from('course_pages')
             .insert({ page_number: page.page_number, page_type: page.page_type, title: page.title, content: page.content, question: page.question, test_type: page.test_type, test_grid: page.test_grid, correct_answer: toDbCorrectAnswer(page.test_type, page.correct_answer), image: page.image, page_length: page.page_length, order_index: page.order_index, course_id: courseId, ai_enabled: page.ai_enabled, give_feedback: page.give_feedback, give_point: page.give_point, score_threshold: page.score_threshold, low_score_page_id: page.low_score_page_id, high_score_page_id: page.high_score_page_id, tip: page.tip, name: page.name })
             .select()
             .single();
          if (insertPageError) throw insertPageError;
          pageId = insertedPage!.id as string;
        }

        const fileForPage = imagesByPage[i];
        if (fileForPage && pageId) {
          try {
            const result = await dispatch(uploadPageImage({ pageId, file: fileForPage })).unwrap();
            updatePage(i, { image: result.publicUrl });
          } catch (e) {
            console.error('Failed to upload page image:', e);
          }
        }

        if (!pageId) continue;

        if (page.test_type === 'Input') {
          
          const { error: delOptsForInputErr } = await supabase.from('page_options').delete().eq('page_id', pageId);
          if (delOptsForInputErr) throw delOptsForInputErr;
          continue; 
        }
        const pageOptions = optionsByPage[i] || [];
        const { data: existingOpts, error: fetchOptErr } = await supabase
          .from('page_options')
          .select('id')
          .eq('page_id', pageId);
        if (fetchOptErr) throw fetchOptErr;

        const existingIds = (existingOpts || []).map((o: any) => o?.id).filter(Boolean) as string[];
        const currentIds = pageOptions.filter(o => o.id).map(o => o.id as string);
        const optionsToDelete = existingIds.filter(id => !currentIds.includes(id));

        if (optionsToDelete.length > 0) {
          const { error: delOptsErr } = await supabase.from('page_options').delete().in('id', optionsToDelete);
          if (delOptsErr) throw delOptsErr;
        }

        for (const opt of pageOptions) {
          if (opt.id) {
            const { error: updOptErr } = await supabase
              .from('page_options')
              .update({
                option_text: opt.option_text,
                option_order: opt.option_order,
                is_correct: opt.is_correct,
                icon_name: opt.icon_name,
                next_page_id: opt.next_page_id || null,
              })
              .eq('id', opt.id);
            if (updOptErr) throw updOptErr;
          } else {
            const { error: insOptErr } = await supabase
              .from('page_options')
              .insert({
                page_id: pageId,
                option_text: opt.option_text,
                option_order: opt.option_order,
                is_correct: opt.is_correct,
                icon_name: opt.icon_name,
                next_page_id: opt.next_page_id || null,
              });
            if (insOptErr) throw insOptErr;
          }
        }
      }

      setShowEditModal(false);
      setSelectedCourse(null);
      setPages([]);
      setOptionsByPage({});
      setOriginalPageIds([]);
      refreshCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      if (!supabase || !selectedCourse) throw new Error('Supabase not configured or no course selected');
      
      await supabase
        .from('courses')
        .delete()
        .eq('id', (selectedCourse as { id: string }).id);
      
      setShowDeleteModal(false);
      setSelectedCourse(null);
      refreshCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const addPage = () => {
    setPages([...pages, {
      page_number: pages.length + 1,
      page_type: 'text',
      title: '',
      content: '',
      question: '',
      test_type: 'Default',
      test_grid: 'col',
      correct_answer: [],
      page_length: pages.length + 1,
      order_index: pages.length,
      image: '',
      why: null,
      ai_enabled: false,
      give_feedback: false,
      give_point: false,
      score_threshold: 50,
      low_score_page_id: null,
      high_score_page_id: null
    }]);
    setOptionsByPage(prev => ({ ...prev, [pages.length]: [] }));
  };

  const updatePage = (index: number, data: Partial<PageFormData>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...data };
    setPages(newPages);
  };

  const removePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    renumberPagesInPlace(newPages);
    setPages(newPages);
  
    const newOptions: Record<number, OptionFormData[]> = {};
    let ptr = 0;
    for (let i = 0; i < pages.length; i++) {
      if (i === index) continue;
      newOptions[ptr] = optionsByPage[i] || [];
      ptr++;
    }
    setOptionsByPage(newOptions);
  
    const newImages: Record<number, File | null> = {};
    ptr = 0;
    for (let i = 0; i < pages.length; i++) {
      if (i === index) continue;
      newImages[ptr] = imagesByPage[i] || null;
      ptr++;
    }
    setImagesByPage(newImages);
  };
  

  const addOptionForPage = (pageIndex: number) => {
    setOptionsByPage(prev => {
      const current = prev[pageIndex] || [];
      return {
        ...prev,
        [pageIndex]: [
          ...current,
          {
            option_text: '',
            option_order: current.length + 1,
            is_correct: false,
            icon_name: ''
          }
        ]
      };
    });
  };

  const updateOptionForPage = (pageIndex: number, optionIndex: number, data: Partial<OptionFormData>) => {
    setOptionsByPage(prev => {
      const current = prev[pageIndex] || [];
      const updated = [...current];
      updated[optionIndex] = { ...updated[optionIndex], ...data };
      return { ...prev, [pageIndex]: updated };
    });
  };

  const removeOptionForPage = (pageIndex: number, optionIndex: number) => {
    setOptionsByPage(prev => {
      const current = prev[pageIndex] || [];
      const updated = current.filter((_, i) => i !== optionIndex);
      return { ...prev, [pageIndex]: updated };
    });
  };

  // TODO: Replace 'unknown' with a specific type for course if possible
  const openEditModal = (course: unknown) => {
    setSelectedCourse(course);
    setCourseFormData({
      slug: (course as { slug: string }).slug,
      title: (course as { title: string }).title,
      description: (course as { description: string }).description,
      icon_name: (course as { icon_name: string }).icon_name || '',
      is_active: (course as { is_active: boolean }).is_active,
      order_index: (course as { order_index: number }).order_index,
      full_course_id: (course as { full_course_id?: string }).full_course_id || '',
      order_within_full_course: (course as { order_within_full_course?: number }).order_within_full_course || 0
    });
    const loadPagesAndOptions = async () => {
      try {
        if (!supabase) return;
        // Type guard for course
        if (!course || typeof course !== 'object' || !('id' in course)) return;
        const { data: dbPages } = await supabase
          .from('course_pages')
          .select('*')
          .eq('course_id', (course as { id: string }).id)
          .order('page_number');
        const pagesData: PageFormData[] = (dbPages || []).map((p: Record<string, unknown>, idx: number) => ({
          id: p.id as string,
          page_number: p.page_number as number,
          page_type: p.page_type as 'text' | 'test' | 'testNext',
          name: (p.name as string) || '',
          title: (p.title as string) || '',
          content: (p.content as string) || '',
          question: (p.question as string) || '',
          test_type: (p.test_type as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input') || 'Default',
          test_grid: (p.test_grid as 'col' | 'grid-2' | 'grid-row') || 'col',
          correct_answer: fromDbCorrectAnswer(p.correct_answer),
          image: (p.image as string) || '',
          page_length: (p.page_length as number) || (dbPages?.length || 1),
          order_index: (p.order_index as number) || idx,
          why: (p.why as string) || null,
          ai_enabled: (p.ai_enabled as boolean) || false,
          give_feedback: (p.give_feedback as boolean) || false,
          give_point: (p.give_point as boolean) || false,
          score_threshold: (p.score_threshold as number) || 50,
          low_score_page_id: (p.low_score_page_id as string) || null,
          high_score_page_id: (p.high_score_page_id as string) || null,
          tip: (p.tip as string) || ''
        }));
        setPages(pagesData);
        setOriginalPageIds((dbPages || []).map((p: Record<string, unknown>) => p.id as string));
        const optsByPage: Record<number, OptionFormData[]> = {};
        for (let i = 0; i < (dbPages || []).length; i++) {
          const page = (dbPages as Record<string, unknown>[])[i];
          const { data: dbOptions } = await supabase
            .from('page_options')
            .select('id,page_id,option_text,option_order,is_correct,icon_name,next_page_id')
            .eq('page_id', page.id)
            .order('option_order');
          optsByPage[i] = (dbOptions || []).map((o: Record<string, unknown>) => ({
            id: o.id as string,
            page_id: o.page_id as string,
            option_text: o.option_text as string,
            option_order: o.option_order as number,
            is_correct: o.is_correct as boolean,
            icon_name: (o.icon_name as string) || '',
            next_page_id: (o.next_page_id as string) || null,
          }));
        }
        setOptionsByPage(optsByPage);
      } catch (e) {
        console.error('Failed to load pages/options for edit:', e);
      }
    };
    loadPagesAndOptions();
    setShowEditModal(true);
  };

  // TODO: Replace 'unknown' with a specific type for course if possible
  const openDeleteModal = (course: unknown) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  if (courseloading) return <div className="text-center p-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-center p-8 text-red-500">خطا: {error}</div>;

  return (
    <div className="p-6" dir="rtl">
      {/* Full Course Management Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">مدیریت دوره‌ها</h1>
          <div className="flex gap-4">
            {/* Admin filter toggle */}
            {user?.user_metadata?.role === 'admin' && (
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    فعال: {courses.filter(c => c.is_active).length}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    غیرفعال: {courses.filter(c => !c.is_active).length}
                  </span>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showInactiveCourses}
                    onChange={(e) => setShowInactiveCourses(e.target.checked)}
                    className="rounded"
                  />
                  نمایش دوره‌های غیرفعال
                </label>
              </div>
            )}
            <button
              onClick={() => setShowCreateFullCourseModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus />
              ایجاد مجموعه دوره جدید
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {fullCourses.map((fullCourse) => {
            // Filter courses that belong to this full course
            const fullCourseCourses = courses.filter(course => 
              course.full_course_id === fullCourse.id && 
              (user?.user_metadata?.role === 'admin' ? 
                (showInactiveCourses ? true : course.is_active) : 
                course.is_active
              )
            );
            
            return (
              <div key={fullCourse.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
                {/* Full Course Header */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{fullCourse.title}</h3>
                      <p className="text-gray-600 mb-3">{fullCourse.description}</p>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${fullCourse.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {fullCourse.is_active ? 'فعال' : 'غیرفعال'}
                        </span>
                        <span className="text-gray-500 text-sm">ترتیب: {fullCourse.order_index}</span>
                        <span className="text-gray-500 text-sm">تعداد دوره‌ها: {fullCourseCourses.length}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditFullCourseModal(fullCourse)}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                        title="ویرایش دوره کامل"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteFullCourseModal(fullCourse)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        title="حذف دوره کامل"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Individual Courses Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">دوره‌های این مجموعه</h4>
                    <button
                      onClick={() => openCreateCourseModal(fullCourse)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <FiPlus size={16} />
                      افزودن دوره جدید
                    </button>
                  </div>

                  {fullCourseCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fullCourseCourses.map((course) => (
                        <div key={course.id} className="bg-gray-50 p-4 rounded-lg border">
                          <h5 className="font-semibold mb-2">{course.title}</h5>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {course.is_active ? 'فعال' : 'غیرفعال'}
                              </span>
                              <span className="text-gray-500 text-xs">ترتیب: {course.order_index}</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditModal(course)}
                                className="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600"
                                title="ویرایش دوره"
                              >
                                <FiEdit size={14} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(course)}
                                className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                                title="حذف دوره"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>هنوز دوره‌ای به این مجموعه اضافه نشده است.</p>
                      <button
                        onClick={() => openCreateCourseModal(fullCourse)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        افزودن اولین دوره
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
      {showCreateModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">ایجاد دوره جدید</h2>
            
            {(selectedFullCourse as any) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  این دوره به مجموعه <strong>{(selectedFullCourse as any).title}</strong> اضافه خواهد شد.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={courseFormData.slug}
                  onChange={(e) => setCourseFormData({...courseFormData, slug: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="python"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عنوان</label>
                <input
                  type="text"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="عنوان دوره"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <textarea
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="توضیحات دوره"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام آیکون</label>
                <input
                  type="text"
                  value={courseFormData.icon_name}
                  onChange={(e) => setCourseFormData({...courseFormData, icon_name: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="LuBrain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ترتیب</label>
                <input
                  type="number"
                  value={courseFormData.order_index}
                  onChange={(e) => setCourseFormData({...courseFormData, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseFormData.is_active}
                    onChange={(e) => setCourseFormData({...courseFormData, is_active: e.target.checked})}
                  />
                  فعال
                </label>
              </div>
            </div>
            <h3 className="text-xl font-semibold my-[1rem]">صفحات دوره</h3>
              
              {pages.map((page, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">صفحه {index + 1}</h4>
                    <button
                      onClick={() => removePage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع صفحه</label>
                      <select
                        value={page.page_type}
                        onChange={(e) => updatePage(index, { page_type: e.target.value as 'text' | 'test' | 'testNext' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="text">متن</option>
                        <option value="test">آزمون</option>
                        <option value="testNext">رد شدنی</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">نام صفحه (اختیاری)</label>
                      <input
                        type="text"
                        value={page.name || ''}
                        onChange={(e) => updatePage(index, { name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="نام صفحه"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{page.page_type === "text" ? "عنوان" : "توضیحات"}</label>
                      {page.page_type === "text" ? (
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => updatePage(index, { title: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="عنوان صفحه"
                        />
                      ) : (
                        <textarea
                          value={page.content}
                          onChange={(e) => updatePage(index, { content: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="عنوان صفحه"
                          rows={5}
                        />
                      )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">تصویر صفحه (اختیاری)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setImagesByPage(prev => ({ ...prev, [index]: file }));
                            }}
                            className="w-full p-2 border rounded"
                          />
                          {page.image && (
                            <img src={page.image} alt="preview" className="mt-2 max-h-40 rounded" />
                          )}
                    </div>
                    {page.page_type === 'text' ? (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">محتوای متن</label>
                        <textarea
                          value={page.content}
                          onChange={(e) => updatePage(index, { content: e.target.value })}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder="محتوای متن"
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">سوال</label>
                          <input
                            type="text"
                            value={page.question}
                            onChange={(e) => updatePage(index, { question: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="سوال آزمون"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">تیپ: </label>
                          <textarea
                            value={page.tip}
                            onChange={(e) => updatePage(index, { tip: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="تیپ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">نوع آزمون</label>
                          <select
                            value={page.test_type}
                            onChange={(e) => updatePage(index, { test_type: e.target.value as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="Default">تک انتخابی</option>
                            <option value="Multiple">چند انتخابی</option>
                            <option value="Sequential">ترتیبی</option>
                            <option value="Pluggable">جفت سازی</option>
                            <option value="Input">ورودی (متنی)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">طرح‌بندی</label>
                          <select
                            value={page.test_grid}
                            onChange={(e) => updatePage(index, { test_grid: e.target.value as 'col' | 'grid-2' | 'grid-row' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="col">عمودی</option>
                            <option value="grid-2">شبکه 2 ستونه</option>
                            <option value="grid-row">شبکه سطری</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-[5px]">
                          <label>هوش مصنوعی: </label>
                          <input 
                            type="checkbox"
                            checked={page.ai_enabled}
                            onChange={(e) => updatePage(index, { ai_enabled: e.target.checked })}
                          />
                        </div><br />
                        {page.ai_enabled &&
                          <>
                            <div className="flex gap-[5px] items-center">
                              <label>امتیاز توسط AI:</label>
                              <input 
                                type="checkbox"
                                checked={page.give_point}
                                onChange={(e) => updatePage(index, { give_point: e.target.checked })} 
                              />
                            </div>
                            <div>
                              <label>فیدبک توسط AI:</label>
                                <input 
                                  type="checkbox"
                                  checked={page.give_feedback}
                                  onChange={(e) => updatePage(index, { give_feedback: e.target.checked })} 
                                />
                            </div>
                          </>
                        }
                        {page.ai_enabled && page.give_point && 
                          <div>
                            <div>
                              <label>صفحه‌ برای امتیاز زیر 50:</label>
                              <select
                                value={page.low_score_page_id || ''}
                                onChange={(e) => updatePage(index, { low_score_page_id: e.target.value || null })}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">انتخاب کنید...</option>
                                {pages.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name || p.title || p.question}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label>صفحه‌ برای امتیاز بالای 50:</label>
                              <select
                                value={page.high_score_page_id || ''}
                                onChange={(e) => updatePage(index, { high_score_page_id: e.target.value || null })}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">انتخاب کنید...</option>
                                {pages.map((p, pi) => (
                                  <option key={p.id || pi} value={p.id || ''}>
                                    {p.name || p.title || p.question || `صفحه ${pi + 1}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        }
                        {page.page_type != "testNext" &&
                          <>
                          <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">دلیل</label>
                          <textarea
                            value={page.why || ''}
                            onChange={(e) => updatePage(index, { why: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">پاسخ صحیح</label>
                          {page.test_type === 'Default' && (
                            <select
                              value={page.correct_answer[0] || ''}
                              onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                updatePage(index, { correct_answer: selectedId ? [selectedId] : [] });
                              }}
                            className="w-full p-2 border rounded"
                            >
                              <option value="">انتخاب کنید</option>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <option key={optIndex} value={option.option_order}>
                                  گزینه {optIndex + 1}: {option.option_text}
                                </option>
                              ))}
                            </select>
                          )}
                          {page.test_type === 'Multiple' && (
                            <div className="space-y-2">
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={page.correct_answer.includes(option.option_order)}
                                    onChange={(e) => {
                                      const newCorrect = e.target.checked
                                        ? [...page.correct_answer, option.option_order]
                                        : page.correct_answer.filter(id => id !== option.option_order);
                                      updatePage(index, { correct_answer: newCorrect });
                                    }}
                                  />
                                  <span className="text-sm">گزینه {optIndex + 1}: {option.option_text}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {page.test_type === 'Sequential' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">ترتیب صحیح گزینه‌ها را مشخص کنید:</p>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={(optionsByPage[index] || []).length}
                                    value={page.correct_answer.indexOf(option.option_order) + 1 || ''}
                                    onChange={(e) => {
                                      const order = parseInt(e.target.value);
                                      if (order && order >= 1 && order <= (optionsByPage[index] || []).length) {
                                        const newCorrect = [...page.correct_answer];
                                        const currentIndex = newCorrect.indexOf(option.option_order);
                                        if (currentIndex !== -1) {
                                          newCorrect.splice(currentIndex, 1);
                                        }
                                        newCorrect.splice(order - 1, 0, option.option_order);
                                        updatePage(index, { correct_answer: newCorrect });
                                      }
                                    }}
                                    className="w-16 p-1 border rounded text-sm"
                                    placeholder="ترتیب"
                                  />
                                  <span className="text-sm">گزینه {optIndex + 1}: {option.option_text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {page.test_type === 'Pluggable' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">جفت‌های صحیح را مشخص کنید:</p>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <span className="text-sm w-20">گزینه {optIndex + 1}:</span>
                                  <select
                                    value={(() => {
                                      const pairIndex = Math.floor(optIndex / 2);
                                      const isFirstInPair = optIndex % 2 === 0;
                                      if (isFirstInPair && page.correct_answer.length > pairIndex * 2 + 1) {
                                        return page.correct_answer[pairIndex * 2 + 1];
                                      } else if (!isFirstInPair && page.correct_answer.length > pairIndex * 2) {
                                        return page.correct_answer[pairIndex * 2];
                                      }
                                      return '';
                                    })()}
                                    onChange={(e) => {
                                      const selectedId = parseInt(e.target.value);
                                      const pairIndex = Math.floor(optIndex / 2);
                                      const isFirstInPair = optIndex % 2 === 0;
                                      const newCorrect = [...page.correct_answer];
                                      
                                      if (isFirstInPair) {
                                        if (newCorrect.length <= pairIndex * 2) {
                                          newCorrect.push(option.option_order, selectedId);
                                        } else {
                                          newCorrect[pairIndex * 2] = option.option_order;
                                          newCorrect[pairIndex * 2 + 1] = selectedId;
                                        }
                                      } else {
                                        if (newCorrect.length <= pairIndex * 2) {
                                          newCorrect.push(selectedId, option.option_order);
                                        } else {
                                          newCorrect[pairIndex * 2] = selectedId;
                                          newCorrect[pairIndex * 2 + 1] = option.option_order;
                                        }
                                      }
                                      
                                      updatePage(index, { correct_answer: newCorrect });
                                    }}
                                    className="flex-1 p-1 border rounded text-sm"
                                  >
                                    <option value="">انتخاب کنید</option>
                                    {(optionsByPage[index] || []).map((otherOption, otherIndex) => (
                                      optIndex !== otherIndex && (
                                        <option key={otherIndex} value={otherOption.option_order}>
                                          گزینه {otherIndex + 1}: {otherOption.option_text}
                                        </option>
                                      )
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        </>
                        }
                        <div className="col-span-2">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">گزینه‌های آزمون</h5>
                            <button
                              onClick={() => setOptionsByPage(prev => ({ ...prev, [index]: [] }))}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              پاک کردن همه
                            </button>
                          </div>
                          <button
                            onClick={() => addOptionForPage(index)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            افزودن گزینه
                          </button>
                          
                          {(optionsByPage[index] || []).map((option, optIndex) => (
                            <div key={optIndex} className="border p-3 rounded mt-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">گزینه {optIndex + 1}</span>
                                <button
                                  onClick={() => removeOptionForPage(index, optIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  حذف
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={option.option_text}
                                  onChange={(e) => updateOptionForPage(index, optIndex, { option_text: e.target.value })}
                                  className="p-2 border rounded text-sm"
                                  placeholder="متن گزینه"
                                />
                                <input
                                  type="number"
                                  value={option.option_order}
                                  onChange={(e) => updateOptionForPage(index, optIndex, { option_order: parseInt(e.target.value) })}
                                  className="p-2 border rounded text-sm"
                                  placeholder="ترتیب"
                                />
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={option.is_correct}
                                    onChange={(e) => updateOptionForPage(index, optIndex, { is_correct: e.target.checked })}
                                  />
                                  صحیح
                                </label>
                                {page.page_type === 'testNext' && (
                                  <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
                                    <label className="text-sm">صفحه بعدی برای این گزینه</label>
                                    <select
                                      value={option.next_page_id || ''}
                                      onChange={(e) => updateOptionForPage(index, optIndex, { next_page_id: e.target.value || null })}
                                      className="p-2 border rounded text-sm"
                                    >
                                      <option value="">پیش‌فرض (صفحه بعدی خطی)</option>
                                      {pages.map((p, pi) => (
                                        <option key={p.id || pi} value={p.id || ''}>
                                          {p.name || p.title || p.question || `صفحه ${pi + 1}`}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={addPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    افزودن صفحه
                  </button>
                  {pages.length > 1 && (
                    <button
                      onClick={openReorderModal}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
                    >
                      <FiMove size={16} />
                      تغییر ترتیب
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
               {courseloading ? <ButtonLoading size="md" /> : "ایجاد دوره"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">ویرایش دوره</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={courseFormData.slug}
                  onChange={(e) => setCourseFormData({...courseFormData, slug: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عنوان</label>
                <input
                  type="text"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <textarea
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام آیکون</label>
                <input
                  type="text"
                  value={courseFormData.icon_name}
                  onChange={(e) => setCourseFormData({...courseFormData, icon_name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ترتیب</label>
                <input
                  type="number"
                  value={courseFormData.order_index}
                  onChange={(e) => setCourseFormData({...courseFormData, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseFormData.is_active}
                    onChange={(e) => setCourseFormData({...courseFormData, is_active: e.target.checked})}
                  />
                  فعال
                </label>
              </div>
            </div>

            <h3 className="text-xl font-semibold my-[1rem]">صفحات دوره</h3>

              {pages.map((page, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">صفحه {index + 1}</h4>
                    <button
                      onClick={() => removePage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع صفحه</label>
                      <select
                        value={page.page_type}
                        onChange={(e) => updatePage(index, { page_type: e.target.value as 'text' | 'test' | 'testNext' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="text">متن</option>
                        <option value="test">آزمون</option>
                        <option value="testNext">رد شدنی</option>

                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">نام صفحه (اختیاری)</label>
                      <input
                        type="text"
                        value={page.name || ''}
                        onChange={(e) => updatePage(index, { name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="نام صفحه"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{page.page_type === "text" ? "عنوان" : "توضیحات"}</label>
                      {page.page_type === "text" ? (
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => updatePage(index, { title: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="عنوان صفحه"
                        />
                      ) : (
                        <textarea
                          value={page.content}
                          onChange={(e) => updatePage(index, { content: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="عنوان صفحه"
                          rows={5}
                        />
                      )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">تصویر صفحه (اختیاری)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setImagesByPage(prev => ({ ...prev, [index]: file }));
                            }}
                            className="w-full p-2 border rounded"
                          />
                          {page.image && (
                            <span className="relative block">
                              <img src={page.image} alt="preview" className="mt-2 max-h-40 rounded" />
                              <FaTrash className="text-red-500 hover:text-red-700 absolute top-2 right-2 z-10 cursor-pointer"
                                onClick={() => {
                                  setImagesByPage(prev => ({ ...prev, [index]: null }));
                                  updatePage(index, { image: '' });
                                }} 
                              />
                            </span>
                          )}
                    </div>
                    {page.page_type === 'text' ? (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">محتوای متن</label>
                        <textarea
                          value={page.content}
                          onChange={(e) => updatePage(index, { content: e.target.value })}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder="محتوای متن"
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">سوال</label>
                          <input
                            type="text"
                            value={page.question}
                            onChange={(e) => updatePage(index, { question: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="سوال آزمون"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">تیپ: </label>
                          <textarea
                            value={page.tip}
                            onChange={(e) => updatePage(index, { tip: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={3}
                            placeholder="تیپ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">نوع آزمون</label>
                          <select
                            value={page.test_type}
                            onChange={(e) => updatePage(index, { test_type: e.target.value as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="Default">تک انتخابی</option>
                            <option value="Multiple">چند انتخابی</option>
                            <option value="Sequential">ترتیبی</option>
                            <option value="Pluggable">جفت سازی</option>
                            <option value="Input">ورودی</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">طرح‌بندی</label>
                          <select
                            value={page.test_grid}
                            onChange={(e) => updatePage(index, { test_grid: e.target.value as 'col' | 'grid-2' | 'grid-row' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="col">عمودی</option>
                            <option value="grid-2">شبکه 2 ستونه</option>
                            <option value="grid-row">شبکه سطری</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-[5px]">
                          <label>هوش مصنوعی: </label>
                          <input 
                            type="checkbox"
                            checked={page.ai_enabled}
                            onChange={(e) => updatePage(index, { ai_enabled: e.target.checked })}
                          />
                        </div><br />
                        {page.ai_enabled &&
                          <>
                            <div className="flex gap-[5px] items-center">
                              <label>امتیاز توسط AI:</label>
                              <input 
                                type="checkbox"
                                checked={page.give_point}
                                onChange={(e) => updatePage(index, { give_point: e.target.checked })} 
                              />
                            </div>
                            <div>
                              <label>فیدبک توسط AI:</label>
                                <input 
                                  type="checkbox"
                                  checked={page.give_feedback}
                                  onChange={(e) => updatePage(index, { give_feedback: e.target.checked })} 
                                />
                            </div>
                          </>
                        }
                        {page.ai_enabled && page.give_point && 
                          <div>
                            <div>
                              <label>صفحه‌ برای امتیاز زیر 50:</label>
                              <select
                                value={page.low_score_page_id || ''}
                                onChange={(e) => updatePage(index, { low_score_page_id: e.target.value || null })}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">انتخاب کنید...</option>
                                {pages.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name || p.title || p.question}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label>صفحه‌ برای امتیاز بالای 50:</label>
                              <select
                                value={page.high_score_page_id || ''}
                                onChange={(e) => updatePage(index, { high_score_page_id: e.target.value || null })}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">انتخاب کنید...</option>
                                {pages.map((p, pi) => (
                                  <option key={p.id || pi} value={p.id || ''}>
                                    {p.name || p.title || p.question || `صفحه ${pi + 1}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        }
                        {page.page_type != "testNext" && page.test_type != "Input" &&
                          <>
                          <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">دلیل</label>
                          <textarea
                            value={page.why || ''}
                            onChange={(e) => updatePage(index, { why: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">پاسخ صحیح</label>
                          {page.test_type === 'Default' && (
                            <select
                              value={page.correct_answer[0] || ''}
                              onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                updatePage(index, { correct_answer: selectedId ? [selectedId] : [] });
                              }}
                            className="w-full p-2 border rounded"
                            >
                              <option value="">انتخاب کنید</option>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <option key={optIndex} value={option.option_order}>
                                  گزینه {optIndex + 1}: {option.option_text}
                                </option>
                              ))}
                            </select>
                          )}
                          {page.test_type === 'Multiple' && (
                            <div className="space-y-2">
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <label key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={page.correct_answer.includes(option.option_order)}
                                    onChange={(e) => {
                                      const newCorrect = e.target.checked
                                        ? [...page.correct_answer, option.option_order]
                                        : page.correct_answer.filter(id => id !== option.option_order);
                                      updatePage(index, { correct_answer: newCorrect });
                                    }}
                                  />
                                  <span className="text-sm">گزینه {optIndex + 1}: {option.option_text}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {page.test_type === 'Sequential' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">ترتیب صحیح گزینه‌ها را مشخص کنید:</p>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={(optionsByPage[index] || []).length}
                                    value={page.correct_answer.indexOf(option.option_order) + 1 || ''}
                                    onChange={(e) => {
                                      const order = parseInt(e.target.value);
                                      if (order && order >= 1 && order <= (optionsByPage[index] || []).length) {
                                        const newCorrect = [...page.correct_answer];
                                        const currentIndex = newCorrect.indexOf(option.option_order);
                                        if (currentIndex !== -1) {
                                          newCorrect.splice(currentIndex, 1);
                                        }
                                        newCorrect.splice(order - 1, 0, option.option_order);
                                        updatePage(index, { correct_answer: newCorrect });
                                      }
                                    }}
                                    className="w-16 p-1 border rounded text-sm"
                                    placeholder="ترتیب"
                                  />
                                  <span className="text-sm">گزینه {optIndex + 1}: {option.option_text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {page.test_type === 'Pluggable' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">جفت‌های صحیح را مشخص کنید:</p>
                              {(optionsByPage[index] || []).map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <span className="text-sm w-20">گزینه {optIndex + 1}:</span>
                                  <select
                                    value={(() => {
                                      const pairIndex = Math.floor(optIndex / 2);
                                      const isFirstInPair = optIndex % 2 === 0;
                                      if (isFirstInPair && page.correct_answer.length > pairIndex * 2 + 1) {
                                        return page.correct_answer[pairIndex * 2 + 1];
                                      } else if (!isFirstInPair && page.correct_answer.length > pairIndex * 2) {
                                        return page.correct_answer[pairIndex * 2];
                                      }
                                      return '';
                                    })()}
                                    onChange={(e) => {
                                      const selectedId = parseInt(e.target.value);
                                      const pairIndex = Math.floor(optIndex / 2);
                                      const isFirstInPair = optIndex % 2 === 0;
                                      const newCorrect = [...page.correct_answer];
                                      
                                      if (isFirstInPair) {
                                        if (newCorrect.length <= pairIndex * 2) {
                                          newCorrect.push(option.option_order, selectedId);
                                        } else {
                                          newCorrect[pairIndex * 2] = option.option_order;
                                          newCorrect[pairIndex * 2 + 1] = selectedId;
                                        }
                                      } else {
                                        if (newCorrect.length <= pairIndex * 2) {
                                          newCorrect.push(selectedId, option.option_order);
                                        } else {
                                          newCorrect[pairIndex * 2] = selectedId;
                                          newCorrect[pairIndex * 2 + 1] = option.option_order;
                                        }
                                      }
                                      
                                      updatePage(index, { correct_answer: newCorrect });
                                    }}
                                    className="flex-1 p-1 border rounded text-sm"
                                  >
                                    <option value="">انتخاب کنید</option>
                                    {(optionsByPage[index] || []).map((otherOption, otherIndex) => (
                                      optIndex !== otherIndex && (
                                        <option key={otherIndex} value={otherOption.option_order}>
                                          گزینه {otherIndex + 1}: {otherOption.option_text}
                                        </option>
                                      )
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        </>
                        }
                        {page.test_type != "Input" &&
                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">گزینه‌های آزمون</h5>
                              <button
                                onClick={() => setOptionsByPage(prev => ({ ...prev, [index]: [] }))}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                پاک کردن همه
                              </button>
                            </div>
                            <button
                              onClick={() => addOptionForPage(index)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              افزودن گزینه
                            </button>

                            {(optionsByPage[index] || []).map((option, optIndex) => (
                              <div key={optIndex} className="border p-3 rounded mt-2">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium">گزینه {optIndex + 1}</span>
                                  <button
                                    onClick={() => removeOptionForPage(index, optIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    حذف
                                  </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={option.option_text}
                                    onChange={(e) => updateOptionForPage(index, optIndex, { option_text: e.target.value })}
                                    className="p-2 border rounded text-sm"
                                    placeholder="متن گزینه"
                                  />
                                  <input
                                    type="number"
                                    value={option.option_order}
                                    onChange={(e) => updateOptionForPage(index, optIndex, { option_order: parseInt(e.target.value) })}
                                    className="p-2 border rounded text-sm"
                                    placeholder="ترتیب"
                                  />
                                  <label className="flex items-center gap-1 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={option.is_correct}
                                      onChange={(e) => updateOptionForPage(index, optIndex, { is_correct: e.target.checked })}
                                    />
                                    صحیح
                                  </label>
                                  {page.page_type === 'testNext' && (
                                    <div className="flex items-center col-start-1 col-end-3 max-md:flex-col gap-2 mt-2">
                                      <label className="text-sm">صفحه بعدی برای این گزینه</label>
                                      <select
                                        value={option.next_page_id || ''}
                                        onChange={(e) => updateOptionForPage(index, optIndex, { next_page_id: e.target.value || null })}
                                        className="p-2 border rounded text-sm"
                                      >
                                        <option value="">پیش‌فرض (صفحه بعدی خطی)</option>
                                        {pages.map((p, pi) => (
                                          <option key={p.id || pi} value={p.id || ''}>
                                            {p.name || p.title || p.question || `صفحه ${pi + 1}`}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        }
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={addPage}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      افزودن صفحه
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={openReorderModal}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
                      >
                        <FiMove size={16} />
                        تغییر ترتیب
                      </button>
                    )}
                  </div>
                </div>
              </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleEditCourse}
                className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                disabled={editLoading}
              >
                {editLoading || coursePageLoading ? (
                  <ButtonLoading size="md" />
                ) : (
                  'ذخیره تغییرات'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">حذف دوره</h2>
            <p className="mb-6">
                {typeof selectedCourse === 'object' && selectedCourse && 'title' in selectedCourse
                    ? `آیا مطمئن هستید که می‌خواهید دوره "${(selectedCourse as { title: string }).title}" را حذف کنید؟`
                    : 'آیا مطمئن هستید که می‌خواهید این دوره را حذف کنید؟'}
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reorder Pages Modal */}
      {showReorderModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">تغییر ترتیب صفحات</h2>
            <p className="mb-6">
              از دکمه‌های بالا و پایین برای تغییر ترتیب صفحات استفاده کنید.
            </p>
            <div className="space-y-2">
              {reorderPages.map((page, index) => (
                <div
                  key={`reorder-page-${index}-${page.id || 'new'}-${page.page_number}`}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-8">#{page.page_number}</span>
                    <span className="text-lg font-medium">{getPageDisplayText(page)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveReorderPageUp(index)}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="انتقال به بالا"
                    >
                      <FiChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => moveReorderPageDown(index)}
                      disabled={index === reorderPages.length - 1}
                      className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="انتقال به پایین"
                    >
                      <FiChevronDown size={20} />
                    </button>
                    <button
                      onClick={() => {
                        const newPages = reorderPages.filter((_, i) => i !== index);

                        // reindex pages
                        renumberPagesInPlace(newPages);
                      
                        // reindex options map keys after deletion
                        const newOpts: Record<number, OptionFormData[]> = {};
                        let ptr = 0;
                        for (let i = 0; i < reorderPages.length; i++) {
                          if (i === index) continue;
                          newOpts[ptr] = reorderOptionsByPage[i] || [];
                          ptr++;
                        }
                        setReorderPages(newPages);
                        setReorderOptionsByPage(prev => {
                          const newOpts = { ...prev };
                          delete newOpts[index];
                          return newOpts;
                        });
                      }}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="حذف صفحه"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={cancelReorder}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={confirmReorder}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                تایید تغییرات
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Full Course Modal */}
      {showCreateFullCourseModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Modal onOpen={showCreateFullCourseModal}>
            <h2 className="text-2xl font-bold mb-4">ایجاد دوره کامل جدید</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={fullCourseFormData.slug}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, slug: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="soft-skills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عنوان</label>
                <input
                  type="text"
                  value={fullCourseFormData.title}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="عنوان دوره کامل"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <textarea
                  value={fullCourseFormData.description}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="توضیحات دوره کامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام آیکون</label>
                <input
                  type="text"
                  value={fullCourseFormData.icon_name}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, icon_name: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="LuBrain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تصویر</label>
                <input
                  type="text"
                  value={fullCourseFormData.image || ''}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, image: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="URL تصویر"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ترتیب</label>
                <input
                  type="number"
                  value={fullCourseFormData.order_index}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={fullCourseFormData.is_active}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">فعال</label>
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowCreateFullCourseModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleCreateFullCourse}
                disabled={fullCourseLoading}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-[0.6]"
              >
                {fullCourseLoading ? (
                  <ButtonLoading size="md" />
                ) : (
                  "ایجاد"
                )}
              </button>
            </div>
          </Modal>
        </motion.div>
      )}

      {/* Edit Full Course Modal */}
      {showEditFullCourseModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Modal onOpen={showEditFullCourseModal}>
            <h2 className="text-2xl font-bold mb-4">ویرایش دوره کامل</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={fullCourseFormData.slug}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, slug: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="soft-skills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عنوان</label>
                <input
                  type="text"
                  value={fullCourseFormData.title}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="عنوان دوره کامل"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <textarea
                  value={fullCourseFormData.description}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={5}
                  placeholder="توضیحات دوره کامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام آیکون</label>
                <input
                  type="text"
                  value={fullCourseFormData.icon_name}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, icon_name: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="LuBrain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">بارگذاری تصویر جدید</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFullCourseImageFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded"
                />
                <button
                  disabled={!fullCourseImageFile || uploadingFullCourseImage || !(selectedFullCourse && typeof selectedFullCourse === 'object' && 'id' in selectedFullCourse)}
                  onClick={async () => {
                    if (!fullCourseImageFile || !selectedFullCourse || !(selectedFullCourse as any).id) return;
                    try {
                      setUploadingFullCourseImage(true);
                      const res = await dispatch(uploadFullCourseImage({ fullCourseId: (selectedFullCourse as { id: string }).id, file: fullCourseImageFile })).unwrap();
                      setFullCourseFormData(prev => ({ ...prev, image: res.publicUrl }));
                      setFullCourseImageFile(null);
                    } catch (e) {
                      console.error('Failed to upload full course image', e);
                    } finally {
                      setUploadingFullCourseImage(false);
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 w-full"
                >
                  {uploadingFullCourseImage ? <ButtonLoading size="md"/> : 'آپلود تصویر'}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ترتیب</label>
                <input
                  type="number"
                  value={fullCourseFormData.order_index}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={fullCourseFormData.is_active}
                  onChange={(e) => setFullCourseFormData({...fullCourseFormData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">فعال</label>
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowEditFullCourseModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleEditFullCourse}
                disabled={fullCourseLoading}
                className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-[0.6]"
              >
                {fullCourseLoading ? (
                  <ButtonLoading size="md" />
                ) : (
                  "ذخیره تغییرات"
                )}
              </button>
            </div>
          </Modal>
        </motion.div>
      )}

      {/* Delete Full Course Modal */}
      {showDeleteFullCourseModal && (
        <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-10000" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">حذف دوره کامل</h2>
            <p className="mb-6">
                {typeof selectedFullCourse === 'object' && selectedFullCourse && 'title' in selectedFullCourse
                    ? `آیا مطمئن هستید که می‌خواهید دوره کامل "${(selectedFullCourse as { title: string }).title}" را حذف کنید؟`
                    : 'آیا مطمئن هستید که می‌خواهید این دوره کامل را حذف کنید؟'}
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteFullCourseModal(false)}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteFullCourse}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}