"use client"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FiUser, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/store/slices/authSlice";
import Modal from "@/components/Modal";
import { fetchUserProgress } from "@/store/slices/courseSlice";



const Profile = () => {
    const { user, loading, logOutLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { userProgress } = useSelector((state: RootState) => state.course);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserProgress(user.id));
        }
    }, [dispatch, user?.id]);

    const handleLogOut = () => {
        dispatch(logoutUser());
        router.push('/');
    }

    const handleModalClose = () => {
        setIsModalOpen(!isModalOpen)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-color1)] rounded-full animate-spin flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-[var(--primary-color4)]" />
                    </div>
                    <p className="text-lg text-[var(--text-secondary)]">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[75vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--secondary-color2)] rounded-full flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-[var(--primary-color4)]" />
                    </div>
                    <p className="text-lg text-[var(--secondary-color2)]">کاربر یافت نشد</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-12 max-md:p-4" dir="rtl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary-color1)] rounded-3xl mb-6 shadow-2xl">
                    <FiUser className="w-10 h-10 text-[var(--primary-color4)]" />
                </div>
                <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 bg-[var(--primary-color1)] bg-clip-text">
                    پروفایل کاربری
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <motion.div 
                        className="bg-[var(--primary-color4)] rounded-xl shadow-xl border border-[var(--accent-color1)]/20 p-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 bg-[var(--primary-color1)] rounded-full flex items-center justify-center shadow-lg mx-auto">
                                <FiUser className="w-16 h-16 text-[var(--primary-color4)]" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'کاربر'}
                        </h2>

                        <div className={user.user_metadata?.role === 'admin' 
                            ? "inline-flex items-center gap-2 bg-[var(--primary-color1)] text-[var(--primary-color4)] px-4 py-2 rounded-full text-sm font-semibold"
                            : "inline-flex items-center gap-2 bg-[var(--accent-color1)] text-[var(--text-primary)] px-4 py-2 rounded-full text-sm font-semibold"
                        }>
                            <FiShield className="w-4 h-4" />
                            {user.user_metadata?.role === 'admin' ? 'مدیر' : 'کاربر'}
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
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <FiUser className="w-6 h-6 text-[var(--primary-color1)]" />
                            اطلاعات شخصی
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">نام کامل</label>
                                <div className="p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20">
                                    {user.user_metadata?.full_name || 'تنظیم نشده'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">ایمیل</label>
                                <div className="p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 flex items-center gap-2">
                                    <FiMail className="w-4 h-4 text-[var(--accent-color1)]" />
                                    {user.email || 'تنظیم نشده'}
                                </div>
                            </div>    
                        </div>
                    </motion.div>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        onClick={() => setIsModalOpen(true)}
                        className="w-[100%] flex justify-center items-center font-semibold cursor-pointer bg-[var(--primary-color1)] rounded-2xl py-[1.4rem] shadow-2xl text-[var(--primary-color4)] hover:shadow-lg transition-all duration-150"
                    >
                        {logOutLoading ?
                            (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>) : ("خروج از حساب کاربری")
                        }
                    </motion.button>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[var(--primary-color4)] rounded-2xl shadow-xl border border-[var(--accent-color1)]/20 px-6 py-[4.2vh]"
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow">
                            <FiCheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-[var(--text-primary)] text-3xl font-extrabold leading-7">
                                {userProgress.length}
                            </div>
                            <div className="text-[var(--text-secondary)] text-sm">
                                دوره تکمیل‌شده
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/courses')}
                        className="button-primary rounded-full px-5 py-2 shadow"
                    >
                        مشاهده دوره‌ها
                    </button>
                </div>
            </motion.div>   
            <Modal
                onClose={handleModalClose}
                onOpen={isModalOpen}
            >
                <div
                    className="text-center text-[2rem] font-bold mb-[2rem]"
                >
                    آیا از خروج خود اطمینان دارید؟  
                </div>
                <div
                    className="flex items-center gap-[0.8rem]"
                >
                    <button
                        onClick={handleModalClose}
                        className="w-[100%] flex justify-center items-center font-semibold cursor-pointer bg-[var(--primary-color1)] rounded-2xl py-[1.4rem] shadow-2xl text-[var(--primary-color4)] hover:shadow-lg transition-all duration-150"
                    > 
                        بازگشت
                    </button>
                    <button
                        onClick={handleLogOut}
                        className="w-[100%] flex justify-center items-center font-semibold cursor-pointer bg-[var(--primary-color1)] rounded-2xl py-[1.4rem] shadow-2xl text-[var(--primary-color4)] hover:shadow-lg transition-all duration-150"
                    >
                        {logOutLoading ?
                            (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>) : ("خروج از حساب کاربری")
                        }
                    </button>
                </div>
            </Modal>
        </div>
    );
}
export default Profile;

