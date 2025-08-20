"use client"
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { AnimatePresence, motion } from "framer-motion";
import clsx from 'clsx';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";


interface LogInFormData {
    email: string;
    password: string;
}

const LogInPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => { if (step === 2) passwordRef.current?.focus(); }, [step]);
    
    const [formData, setFormData] = useState<LogInFormData>({
        email: '',
        password: '',
    });
    
    const [validationErrors, setValidationErrors] = useState<Partial<LogInFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (validationErrors[name as keyof LogInFormData]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep1 = (): boolean => {
        const errors: Partial<LogInFormData> = {};
        if (!formData.email) errors.email = 'آدرس ایمیل را وارد کنید';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'ایمیل نامعتبر است';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
      };
      
      const validateStep2 = (): boolean => {
        const errors: Partial<LogInFormData> = {};
        if (!formData.password) errors.password = 'پسوورد را وارد کنید';
        else if (formData.password.length < 6) errors.password = 'پسوورد استباه است';
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
            await dispatch(loginUser({
                email: formData.email,
                password: formData.password,
            })).unwrap();
            router.push('/courses');
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
                        وارد شوید
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        
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
                                    "appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
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
                                        className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="پسوورد"
                                    />
                                    {validationErrors.password && (
                                    <p className="text-[var(--secondary-color2)] text-xs mt-1 p-2 font-bold">{validationErrors.password}</p>
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

                                        {error === "Invalid login credentials" ?
                                        <>
                                            آدرس ایمیل یا پسوورد شما اشتباه میباشد
                                        </> :
                                        <>
                                            ورود انجام نشد
                                        </>
                                        }
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        {error != "Invalid login credentials" &&
                                            <p>{error}</p>
                                        }
                                        
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
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            درحال ورود
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        'وارد شوید'
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        اکانت ندارید؟{' '}
                        <button
                            onClick={() => router.push('sign-up')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                            اکانت خود را بسازید
                        </button>
                    </p>
            </div>
        </div>
    );
}

export default LogInPage;