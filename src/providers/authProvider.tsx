"use client";
import { useEffect } from "react";
import { checkAuthStatus } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";


const AuthStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    return children;
}

export default AuthStatusProvider;