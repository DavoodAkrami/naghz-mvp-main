"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function AccountInfo() {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="p-6">
            <h2 className="h2 mb-4">Account Information</h2>
            {user && (
                <div className="space-y-4">
                    <div>
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                        <strong>Role:</strong> {user.user_metadata?.role || 'user'}
                    </div>
                </div>
            )}
        </div>
    );
}
