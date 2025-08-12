"use client"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { signupUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { AnimatePresence, motion } from "framer-motion";
import clsx from 'clsx';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";





interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    full_name: string;
}

const SignupPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => { if (step === 2) passwordRef.current?.focus(); }, [step]);
    
    const [formData, setFormData] = useState<SignupFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: ''
    });
    
    const [validationErrors, setValidationErrors] = useState<Partial<SignupFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (validationErrors[name as keyof SignupFormData]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep1 = (): boolean => {
        const errors: Partial<SignupFormData> = {};
        if (!formData.full_name) errors.full_name = 'نام کاربری را وارد کنید';
        if (!formData.email) errors.email = 'آدرس ایمیل را وارد کنید';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'ایمیل نامعتبر است';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
      };
      
      const validateStep2 = (): boolean => {
        const errors: Partial<SignupFormData> = {};
        if (!formData.password) errors.password = 'پسوورد را وارد کنید';
        else if (formData.password.length < 6) errors.password = 'پسوورد باید حداقل 6 کاراکتر باشد';
        if (!formData.confirmPassword) errors.confirmPassword = 'لطفا پسوورد خود را تایید کنید';
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'پسووردها برابر نیستند';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (!validateStep1()) return;
            setStep(2);
            return;
        }
    
        if (!validateStep2()) return;
    
        try {
            await dispatch(signupUser({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name || undefined,
            })).unwrap();
            router.push('/');
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };



    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <div 
            dir='rtl'
            className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-color)] py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
                        اکانت خود را بسازید
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="full_name" className="sr-only">
                                نام کاربری
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="نام کاربری"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="sr-only">
                                آدرس ایمیل
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={clsx(
                                    "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                                    step === 1 && 'rounded-b-md'
                                )}
                                placeholder="آدرس ایمیل"
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1 p-2 font-bold">{validationErrors.email}</p>
                            )}
                        </div>
                        
                        <AnimatePresence initial={false} mode="wait">
                            {step === 2 && (
                                <motion.div
                                key="step2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="-space-y-px"
                                >
                                <div>
                                    <label htmlFor="password" className="sr-only">پسوورد</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required={step === 2}
                                        ref={passwordRef}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="پسوورد"
                                    />
                                    {validationErrors.password && (
                                    <p className="text-[var(--secondary-color2)] text-xs mt-1 p-2 font-bold">{validationErrors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="sr-only">تایید پسوورد</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required={step === 2}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="تایید پسوورد"
                                    />
                                    {validationErrors.confirmPassword && (
                                    <p className="text-[var(--secondary-color2)] text-xs mt-1 p-2 font-bold">{validationErrors.confirmPassword}</p>
                                    )}
                                </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        ثبت نام انجام نشد
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        {step === 1 &&
                            <button
                                type="submit"
                                disabled={loading}
                                className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                    <div
                                        className='flex items-center'
                                    >
                                        <MdNavigateNext className='text-[1.4rem]' />
                                        مرحله بعد
                                    </div>
                            </button>
                        }
                        {step === 2 &&
                            <div
                                className='flex gap-[1rem]'
                            >
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            در حال ثبت نام
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        'ثبت نام'
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                        <div
                                        className='flex items-center'
                                        >
                                            مرحله قبل
                                            <MdNavigateBefore className='text-[1.4rem]' />
                                        </div>
                                </button>
                            </div>
                        }
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                        اکانت دارید؟{' '}
                        <button
                            onClick={() => router.push('sign-in')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                            وارد شوید
                        </button>
                    </p>
            </div>
        </div>
    );
}

export default SignupPage;