"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { supabase } from "@/config/supabase";
import { addHeart, fetchUserHearts } from "@/store/slices/heartSlice";

type Props = { children: React.ReactNode };



const HeartsProvider: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { hearts } = useSelector((state: RootState) => state.hearts as any);
    

    useEffect(() => {
        const ensureRow = async () => {
            if (!user?.id || !supabase) return;

            const { data: existing } = await supabase
                .from('user_hearts')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle();
            if (!existing) {
                await supabase
                    .from('user_hearts')
                    .insert({ user_id: user.id });
            }
        };
        ensureRow();
    }, [user?.id]);

    return <>{children}</>;
};

export default HeartsProvider;


