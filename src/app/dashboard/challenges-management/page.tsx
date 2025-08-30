"use client"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";
import { 
    fetchTodaysChallenge, 
    addNewChallenge, 
    editChallenge, 
    deleteChallenge 
} from "@/store/slices/challengesSlice";
import { fetchCourses } from "@/store/slices/courseSlice";

interface ChallengeFormData {
    id?: string;
    prompt: string;
    question: string;
    course_id: string;
    date: string;
}

const ChallengesManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { challenges, challengesLoading, error } = useSelector((state: RootState) => state.challengse);
    const { courses, courseloading: coursesLoading } = useSelector((state: RootState) => state.course);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeFormData | null>(null);
    const [formData, setFormData] = useState<ChallengeFormData>({
        prompt: "",
        question: "",
        course_id: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        dispatch(fetchTodaysChallenge());
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleCreateModalOpen = () => {
        setFormData({
            prompt: "",
            question: "",
            course_id: "",
            date: new Date().toISOString().split('T')[0]
        });
        setIsCreateModalOpen(true);
    };

    const handleEditModalOpen = (challenge: any) => {
        setSelectedChallenge(challenge);
        setFormData({
            id: challenge.id,
            prompt: challenge.prompt || "",
            question: challenge.question || "",
            course_id: challenge.course_id || "",
            date: challenge.date ? new Date(challenge.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteModalOpen = (challenge: any) => {
        setSelectedChallenge(challenge);
        setIsDeleteModalOpen(true);
    };

    const handleCreateChallenge = async () => {
        try {
            const challengeData = {
                prompt: formData.prompt,
                question: formData.question,
                course_id: formData.course_id,
                date: new Date(formData.date)
            };
            await dispatch(addNewChallenge(challengeData)).unwrap();
            setIsCreateModalOpen(false);
            setFormData({
                prompt: "",
                question: "",
                course_id: "",
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Failed to create challenge:', error);
        }
    };

    const handleEditChallenge = async () => {
        if (!selectedChallenge?.id) return;
        
        try {
            const updates = {
                prompt: formData.prompt,
                question: formData.question,
                course_id: formData.course_id,
                date: new Date(formData.date)
            };
            await dispatch(editChallenge({
                id: selectedChallenge.id,
                updates
            })).unwrap();
            setIsEditModalOpen(false);
            setSelectedChallenge(null);
        } catch (error) {
            console.error('Failed to edit challenge:', error);
        }
    };

    const handleDeleteChallenge = async () => {
        if (!selectedChallenge?.id) return;
        
        try {
            await dispatch(deleteChallenge(selectedChallenge.id)).unwrap();
            setIsDeleteModalOpen(false);
            setSelectedChallenge(null);
        } catch (error) {
            console.error('Failed to delete challenge:', error);
        }
    };

    if (challengesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-color1)] rounded-full animate-spin flex items-center justify-center">
                        <FiPlus className="w-8 h-8 text-[var(--primary-color4)]" />
                    </div>
                    <p className="text-lg text-[var(--text-secondary)]">در حال بارگذاری چالش‌ها...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-12 max-md:p-4" dir="rtl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary-color1)] rounded-3xl mb-6 shadow-2xl">
                    <FiPlus className="w-10 h-10 text-[var(--primary-color4)]" />
                </div>
                <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 bg-[var(--primary-color1)] bg-clip-text">
                    مدیریت چالش‌ها
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    ایجاد، ویرایش و حذف چالش‌های روزانه
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 max-md:hidden">
                    <motion.div 
                        className="bg-[var(--primary-color4)] rounded-xl shadow-xl border border-[var(--accent-color1)]/20 p-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 bg-[var(--primary-color1)] rounded-full flex items-center justify-center shadow-lg mx-auto">
                                <FiCheckCircle className="w-16 h-16 text-[var(--primary-color4)]" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            چالش‌های فعال
                        </h2>

                        <div className="inline-flex items-center gap-2 bg-[var(--accent-color1)] text-[var(--text-primary)] px-4 py-2 rounded-full text-sm font-semibold">
                            <FiCalendar className="w-4 h-4" />
                            {challenges.length} چالش
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <motion.div 
                        className="bg-[var(--primary-color4)] rounded-2xl shadow-xl border border-[var(--accent-color1)]/20 p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <FiPlus className="w-6 h-6 text-[var(--primary-color1)]" />
                                چالش‌های موجود
                            </h3>
                            <button
                                onClick={handleCreateModalOpen}
                                className="bg-[var(--primary-color1)] text-[var(--primary-color4)] px-4 py-2 rounded-lg hover:bg-[var(--primary-color1)]/90 transition-colors flex items-center gap-2"
                            >
                                <FiPlus className="w-4 h-4" />
                                افزودن چالش
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2">
                                <FiAlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {challenges.length === 0 ? (
                                <div className="text-center py-8 text-[var(--text-secondary)]">
                                    هیچ چالشی یافت نشد
                                </div>
                            ) : (
                                challenges.map((challenge, index) => (
                                    <motion.div
                                        key={challenge.id}
                                        className="bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 p-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                                                    چالش {index + 1}
                                                </h4>
                                                <p className="text-[var(--text-secondary)] text-sm mb-2">
                                                    {challenge.question}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                                    <span>دوره: {courses.find(c => c.id === challenge.course_id)?.title || challenge.course_id}</span>
                                                    <span>تاریخ: {new Date(challenge.date).toLocaleDateString('fa-IR')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditModalOpen(challenge)}
                                                    className="p-2 text-[var(--accent-color1)] hover:bg-[var(--accent-color1)]/10 rounded-lg transition-colors"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteModalOpen(challenge)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Create Challenge Modal */}
            <Modal onOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
                        افزودن چالش جدید
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">سوال چالش</label>
                            <textarea
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                                rows={3}
                                placeholder="سوال چالش را وارد کنید..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">متن توضیحات</label>
                            <textarea
                                value={formData.prompt}
                                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                                rows={2}
                                placeholder="توضیحات چالش..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">انتخاب دوره</label>
                            <select
                                value={formData.course_id}
                                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                            >
                                <option value="">انتخاب کنید...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">تاریخ</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                            />
                        </div>
                    </div>
                    
               
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            انصراف
                        </button>
                        <button
                            onClick={handleCreateChallenge}
                            className="flex-1 bg-[var(--primary-color1)] text-[var(--primary-color4)] py-2 px-4 rounded-lg hover:bg-[var(--primary-color1)]/90 transition-colors"
                        >
                            ایجاد چالش
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Challenge Modal */}
            <Modal onOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
                        ویرایش چالش
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">سوال چالش</label>
                            <textarea
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                                rows={3}
                                placeholder="سوال چالش را وارد کنید..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">متن توضیحات</label>
                            <textarea
                                value={formData.prompt}
                                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                                rows={2}
                                placeholder="توضیحات چالش..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">انتخاب دوره</label>
                            <select
                                value={formData.course_id}
                                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                            >
                                <option value="">انتخاب کنید...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">تاریخ</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color1)]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            انصراف
                        </button>
                        <button
                            onClick={handleEditChallenge}
                            className="flex-1 bg-[var(--primary-color1)] text-[var(--primary-color4)] py-2 px-4 rounded-lg hover:bg-[var(--primary-color1)]/90 transition-colors"
                        >
                            ذخیره تغییرات
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Challenge Modal */}
            <Modal onOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <FiTrash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                        حذف چالش
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        آیا از حذف این چالش اطمینان دارید؟ این عملیات قابل بازگشت نیست.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            انصراف
                        </button>
                        <button
                            onClick={handleDeleteChallenge}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            حذف چالش
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ChallengesManagement;
