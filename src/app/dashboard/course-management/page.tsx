"use client"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { supabase } from "@/config/supabase";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface CourseFormData {
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  order_index: number;
}

interface PageFormData {
  id?: string;
  page_number: number;
  page_type: 'text' | 'test';
  title: string;
  content: string;
  question: string;
  test_type: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable';
  test_grid: 'col' | 'grid-2' | 'grid-row';
  correct_answer: number[];
  page_length: number;
  order_index: number;
}

interface OptionFormData {
  id?: string;
  page_id?: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  icon_name: string;
}

export default function CourseManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.course);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // TODO: Replace 'unknown' with a specific type for course if possible
  const [selectedCourse, setSelectedCourse] = useState<unknown>(null); // FIXME: type
  const [courseFormData, setCourseFormData] = useState<CourseFormData>({
    slug: '',
    title: '',
    description: '',
    icon_name: '',
    is_active: true,
    order_index: 0
  });
  const [pages, setPages] = useState<PageFormData[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showPageModal, setShowPageModal] = useState(false);
  const [pageFormData, setPageFormData] = useState<PageFormData>({
    page_number: 1,
    page_type: 'text',
    title: '',
    content: '',
    question: '',
    test_type: 'Default',
    test_grid: 'col',
    correct_answer: [],
    page_length: 1,
    order_index: 0
  });
  const [optionsByPage, setOptionsByPage] = useState<Record<number, OptionFormData[]>>({});
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [originalPageIds, setOriginalPageIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleCreateCourse = async () => {
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert(courseFormData)
        .select()
        .single();
      
      if (courseError) throw courseError;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { data: pageData, error: pageError } = await supabase
          .from('course_pages')
          .insert({
            ...page,
            course_id: course.id
          })
          .select()
          .single();
        
        if (pageError) throw pageError;

        const pageOptions = optionsByPage[i] || [];
        if (page.page_type === 'test' && pageOptions.length > 0) {
          for (let j = 0; j < pageOptions.length; j++) {
            const option = pageOptions[j];
            await supabase
              .from('page_options')
              .insert({
                option_text: option.option_text,
                option_order: option.option_order,
                is_correct: option.is_correct,
                icon_name: option.icon_name,
                page_id: pageData.id
              });
          }
        }
      }

      setShowCreateModal(false);
      setCourseFormData({
        slug: '',
        title: '',
        description: '',
        icon_name: '',
        is_active: true,
        order_index: 0
      });
      setPages([]);
      setOptionsByPage({});
      dispatch(fetchCourses());
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = async () => {
    try {
      if (!supabase || !selectedCourse) throw new Error('Supabase not configured or no course selected');

      const courseId = (selectedCourse as { id: string }).id;

      await supabase
        .from('courses')
        .update(courseFormData)
        .eq('id', courseId);

      const currentPageIds = pages.filter(p => p.id).map(p => p.id!) as string[];
      const pagesToDelete = originalPageIds.filter(id => !currentPageIds.includes(id));

      for (const pageId of pagesToDelete) {
        await supabase.from('page_options').delete().eq('page_id', pageId);
        await supabase.from('course_pages').delete().eq('id', pageId);
      }

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        let pageId: string | undefined = page.id;

        if (pageId) {
          await supabase
            .from('course_pages')
            .update({
              page_number: page.page_number,
              page_type: page.page_type,
              title: page.title,
              content: page.content,
              question: page.question,
              test_type: page.test_type,
              test_grid: page.test_grid,
              correct_answer: page.correct_answer,
              page_length: page.page_length,
              order_index: page.order_index,
            })
            .eq('id', pageId);
        } else {
          const { data: insertedPage, error: insertPageError } = await supabase
            .from('course_pages')
            .insert({
              page_number: page.page_number,
              page_type: page.page_type,
              title: page.title,
              content: page.content,
              question: page.question,
              test_type: page.test_type,
              test_grid: page.test_grid,
              correct_answer: page.correct_answer,
              page_length: page.page_length,
              order_index: page.order_index,
              course_id: courseId,
            })
            .select()
            .single();
          if (insertPageError) throw insertPageError;
          pageId = insertedPage?.id as string;
        }

        if (!pageId) continue;

        const pageOptions = optionsByPage[i] || [];
        const { data: existingOpts } = await supabase
          .from('page_options')
          .select('id')
          .eq('page_id', pageId);
        const existingIds = (existingOpts || []).map((o: unknown) => {
            if (typeof o === 'object' && o && 'id' in o) return (o as { id: string }).id;
            return '';
        });
        const currentIds = pageOptions.filter(o => o.id).map(o => o.id as string);
        const optionsToDelete = existingIds.filter(id => id && !currentIds.includes(id));

        if (optionsToDelete.length > 0) {
          await supabase.from('page_options').delete().in('id', optionsToDelete);
        }

        for (const opt of pageOptions) {
          if (opt.id) {
            await supabase
              .from('page_options')
              .update({
                option_text: opt.option_text,
                option_order: opt.option_order,
                is_correct: opt.is_correct,
                icon_name: opt.icon_name,
              })
              .eq('id', opt.id);
          } else {
            await supabase
              .from('page_options')
              .insert({
                page_id: pageId,
                option_text: opt.option_text,
                option_order: opt.option_order,
                is_correct: opt.is_correct,
                icon_name: opt.icon_name,
              });
          }
        }
      }

      setShowEditModal(false);
      setSelectedCourse(null);
      setPages([]);
      setOptionsByPage({});
      setOriginalPageIds([]);
      dispatch(fetchCourses());
    } catch (error) {
      console.error('Error updating course:', error);
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
      dispatch(fetchCourses());
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
      order_index: pages.length
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
    setPages(newPages);
    const newOptions: Record<number, OptionFormData[]> = {};
    newPages.forEach((_, i) => {
      newOptions[i] = optionsByPage[i] || [];
    });
    setOptionsByPage(newOptions);
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
      order_index: (course as { order_index: number }).order_index
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
          page_type: p.page_type as 'text' | 'test',
          title: (p.title as string) || '',
          content: (p.content as string) || '',
          question: (p.question as string) || '',
          test_type: (p.test_type as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable') || 'Default',
          test_grid: (p.test_grid as 'col' | 'grid-2' | 'grid-row') || 'col',
          correct_answer: (p.correct_answer as number[]) || [],
          page_length: (p.page_length as number) || (dbPages?.length || 1),
          order_index: (p.order_index as number) || idx
        }));
        setPages(pagesData);
        setOriginalPageIds((dbPages || []).map((p: Record<string, unknown>) => p.id as string));
        const optsByPage: Record<number, OptionFormData[]> = {};
        for (let i = 0; i < (dbPages || []).length; i++) {
          const page = (dbPages as Record<string, unknown>[])[i];
          const { data: dbOptions } = await supabase
            .from('page_options')
            .select('*')
            .eq('page_id', page.id)
            .order('option_order');
          optsByPage[i] = (dbOptions || []).map((o: Record<string, unknown>) => ({
            id: o.id as string,
            page_id: o.page_id as string,
            option_text: o.option_text as string,
            option_order: o.option_order as number,
            is_correct: o.is_correct as boolean,
            icon_name: (o.icon_name as string) || ''
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

  if (loading) return <div className="text-center p-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-center p-8 text-red-500">خطا: {error}</div>;

  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت دوره‌ها</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus size={20} />
          افزودن دوره جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded text-xs ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {course.is_active ? 'فعال' : 'غیرفعال'}
              </span>
              <span className="text-gray-500 text-sm">ترتیب: {course.order_index}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(course)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => openDeleteModal(course)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
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

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">صفحات دوره</h3>
                <button
                  onClick={addPage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  افزودن صفحه
                </button>
              </div>
              
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
                        onChange={(e) => updatePage(index, { page_type: e.target.value as 'text' | 'test' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="text">متن</option>
                        <option value="test">آزمون</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عنوان</label>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => updatePage(index, { title: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="عنوان صفحه"
                      />
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
                          <label className="block text-sm font-medium mb-2">نوع آزمون</label>
                          <select
                            value={page.test_type}
                            onChange={(e) => updatePage(index, { test_type: e.target.value as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="Default">تک انتخابی</option>
                            <option value="Multiple">چند انتخابی</option>
                            <option value="Sequential">ترتیبی</option>
                            <option value="Pluggable">جفت سازی</option>
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
                        <div>
                          <label className="block text-sm font-medium mb-2">پاسخ صحیح</label>
                          <input
                            type="text"
                            value={page.correct_answer.join(', ')}
                            onChange={(e) => updatePage(index, { correct_answer: e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)) })}
                            className="w-full p-2 border rounded"
                            placeholder="1, 2, 3"
                          />
                        </div>
                        
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
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
                ایجاد دوره
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

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">صفحات دوره</h3>
                <button
                  onClick={addPage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  افزودن صفحه
                </button>
              </div>

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
                        onChange={(e) => updatePage(index, { page_type: e.target.value as 'text' | 'test' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="text">متن</option>
                        <option value="test">آزمون</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عنوان</label>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => updatePage(index, { title: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="عنوان صفحه"
                      />
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
                          <label className="block text-sm font-medium mb-2">نوع آزمون</label>
                          <select
                            value={page.test_type}
                            onChange={(e) => updatePage(index, { test_type: e.target.value as 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="Default">تک انتخابی</option>
                            <option value="Multiple">چند انتخابی</option>
                            <option value="Sequential">ترتیبی</option>
                            <option value="Pluggable">جفت سازی</option>
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
                        <div>
                          <label className="block text-sm font-medium mb-2">پاسخ صحیح</label>
                          <input
                            type="text"
                            value={page.correct_answer.join(', ')}
                            onChange={(e) => updatePage(index, { correct_answer: e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x)) })}
                            className="w-full p-2 border rounded"
                            placeholder="1, 2, 3"
                          />
                        </div>

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
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
              >
                ذخیره تغییرات
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
      </AnimatePresence>
    </div>
  );
}
