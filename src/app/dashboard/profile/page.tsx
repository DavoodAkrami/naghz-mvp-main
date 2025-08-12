"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";


const Profile = () => {
    const {loading, user} = useSelector((state: RootState) => state.auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div> 
            {user ? `Hello ${user.email}` : 'loading'}
        </div>
    )
}

export default Profile;