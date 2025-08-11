"use client"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';

interface SignInFormData {
    email: string;
    password: string;
}

const SignInPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    const [formData, setFormData] = useState<SignInFormData>({
        email: '',
        password: '',
    });
    
    const [validationErrors, setValidationErrors] = useState<Partial<SignInFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (validationErrors[name as keyof SignInFormData]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<SignInFormData> = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'ایمیل نامعتبر است';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'پسوورد باید حدافل از 6 کارکتر تشکیل شده باشد';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(loginUser({
                email: formData.email,
                password: formData.password,
            })).unwrap();
            
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    return (
        <div 
            dir='rtl'
            className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        وارد شوید
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        اکانت ندارید؟{' '}
                        <button
                            onClick={() => router.push('auth/sign-up')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                            ثبت نام
                        </button>
                    </p>
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="آدرس ایمیل"
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="sr-only">
                                پسوورد
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="پسوورد"
                            />
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>
                    
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Signup failed
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    در حال ثبت نام
                                </div>
                            ) : (
                                'ثبت نام'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignInPage;