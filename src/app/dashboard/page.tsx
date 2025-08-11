"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Dashboard() {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="h1 mb-4">Dashboard</h1>
            {user ? (
                <p className="text-lg">Welcome, {user.email}</p>
            ) : (
                <p>Not authenticated</p>
            )}
        </div>
    );
} 