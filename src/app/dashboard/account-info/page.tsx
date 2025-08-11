"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function AccountInfo() {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            Hello
        </div>
    );
}

