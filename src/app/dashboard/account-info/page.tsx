"use client"
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";


const AccountInfo = () => {
    const router = useRouter();
    const { user, loading, logOutLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const handleLogOut = () => {
        dispatch(logoutUser());
        router.push('/');
    }

    return (
        <div>
            {loading &&
                <div>
                    loading...
                </div>
            }
            <div>
                <div>
                    ایمیل: 
                    {user?.email}
                </div>
            </div>
            <button
                className="hover:bg-[var(--hover-color)] button-primary rounded-lg flex items-center gap-[10px]"
                onClick={handleLogOut}
                disabled={logOutLoading}
            >
                خروج
                {logOutLoading &&
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                }
            </button>
        </div>
    );
}

export default AccountInfo;

