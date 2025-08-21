"use client"
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import { FiUsers, FiMail, FiShield, FiSearch, FiXCircle } from "react-icons/fi";
import { deleteUserById, fetchAllUsers, updateUserRole } from "@/store/slices/authSlice";
import { fetchUserProgress } from "@/store/slices/courseSlice";
import { supabase } from "@/config/supabase";

interface DisplayUser {
	uid: string;
	name: string;
	email?: string;
	role?: string;
	createdAt?: string;
}

const UserManagementPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isAuthenticated, loading, users, usersLoading } = useSelector((state: RootState) => state.auth);
	const { userProgress } = useSelector((state: RootState) => state.course);
	const [search, setSearch] = useState<string>("");	
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [passedCounts, setPassedCounts] = useState<Record<string, number>>({});
	const [passedLoading, setPassedLoading] = useState<boolean>(false);
	

	const isAdmin = Boolean(user?.user_metadata?.role === "admin");

	useEffect(() => {
		if (isAuthenticated && isAdmin) {
			dispatch(fetchAllUsers());
		}
	}, [dispatch, isAuthenticated, isAdmin]);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchUserProgress(user.id));
		}
	}, [dispatch, user?.id]);

	const displayUsers: DisplayUser[] = useMemo(() => {
		return users.map((u) => ({
			uid: u.id,
			name: u.user_metadata?.full_name || u.email?.split("@")[0] || "کاربر",
			email: u.email,
			role: u.user_metadata?.role || "user",
			createdAt: u.user_metadata?.created_at,
		}));
	}, [users]);

	const filteredUsers = useMemo(() => {
		return displayUsers.filter((u) => {
			const matchesSearch = [u.name, u.email, u.role]
				.filter(Boolean)
				.some((field) => String(field).toLowerCase().includes(search.toLowerCase()));
			const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [displayUsers, search, roleFilter]);

	useEffect(() => {
		const loadCounts = async () => {
			const client = supabase;
			if (!client) { setPassedCounts({}); return; }
			setPassedLoading(true);
			try {
				const results = await Promise.all(
					filteredUsers.map(async (u) => {
						const { count, error } = await client
							.from('user_progress')
							.select('*', { count: 'exact', head: true })
							.eq('user_id', u.uid);
						return [u.uid, error ? 0 : (count || 0)] as const;
					})
				);
				const next: Record<string, number> = {};
				for (const [uid, cnt] of results) next[uid] = cnt;
				setPassedCounts(next);
			} finally {
				setPassedLoading(false);
			}
		};
		if (filteredUsers.length) loadCounts();
		else setPassedCounts({});
	}, [filteredUsers]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-color1)] rounded-full animate-spin flex items-center justify-center">
						<FiUsers className="w-8 h-8 text-[var(--primary-color4)]" />
					</div>
					<p className="text-lg text-[var(--text-secondary)]">در حال بارگذاری...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || !isAdmin) {
		return (
			<div className="flex items-center justify-center min-h-[70vh]" dir="rtl">
				<div className="bg-[var(--primary-color4)] rounded-2xl shadow-xl border border-[var(--accent-color1)]/20 p-8 text-center max-w-md">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--secondary-color2)] rounded-3xl mb-6">
						<FiXCircle className="w-10 h-10 text-[var(--primary-color4)]" />
					</div>
					<h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">دسترسی غیرمجاز</h2>
					<p className="text-[var(--text-secondary)]">برای مشاهده این صفحه باید مدیر باشید.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 p-12 max-md:py-6 max-md:px-0 max-md:max-w-[90vw] max-md:mx-auto" dir="rtl">
			<div className="text-center mb-4">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary-color1)] rounded-3xl mb-6 shadow-2xl">
					<FiUsers className="w-10 h-10 text-[var(--primary-color4)]" />
				</div>
				<h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2 bg-[var(--primary-color1)] bg-clip-text">
					مدیریت کاربران
				</h1>
				<p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
					جستجو، فیلتر و مشاهده اطلاعات کاربران سیستم
				</p>
			</div>

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-[var(--primary-color4)] rounded-2xl shadow-xl border border-[var(--accent-color1)]/20 p-6 max-md:w-auto"
			>
				<div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between max-md:flex-col">
					<div className="relative w-full max-md:w-auto md:w-2/3">
						<FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
						<input
							type="text"
							placeholder="جستجوی نام، ایمیل یا نقش..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pr-10 pl-4 py-3 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:border-[var(--primary-color1)]/60 text-[var(--text-primary)]"
						/>
					</div>
					<div className="w-full max-md:w-auto md:w-1/3">
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className="w-full py-3 px-4 bg-[var(--bg-color)] rounded-lg border border-[var(--accent-color1)]/20 focus:outline-none focus:border-[var(--primary-color1)]/60 text-[var(--text-primary)]"
						>
							<option value="all">همه نقش‌ها</option>
							<option value="admin">مدیر</option>
							<option value="user">کاربر</option>
						</select>
					</div>
				</div>

				<div className="mt-6 overflow-x-auto">
					<table className="min-w-full max-md:w-auto divide-y divide-[var(--accent-color1)]/20">
						<thead className="bg-[var(--bg-color)]">
							<tr>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">کاربر</th>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">ایمیل</th>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">نقش</th>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">تاریخ ساخت</th>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">اقدامات</th>
								<th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">دوره‌های گذرانده</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[var(--accent-color1)]/20 bg-[var(--primary-color4)]">
							{usersLoading && (
								<tr>
									<td colSpan={6} className="px-4 py-10 text-center text-[var(--text-secondary)]">در حال بارگذاری...</td>
								</tr>
							)}
							{!usersLoading && filteredUsers.length === 0 && (
								<tr>
									<td colSpan={6} className="px-4 py-10 text-center text-[var(--text-secondary)]">
										کاربری یافت نشد
									</td>
								</tr>
							)}
							{filteredUsers.map((u) => (
								<tr key={u.uid} className="hover:bg-[var(--hover-color)]/40 transition-colors">
									<td className="px-4 py-4 whitespace-nowrap">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-[var(--primary-color1)] rounded-xl flex items-center justify-center text-[var(--primary-color4)] shadow">
												<FiShield className="w-5 h-5" />
											</div>
											<div>
												<div className="text-[var(--text-primary)] font-semibold">{u.name}</div>
												<div className="text-[var(--text-secondary)] text-xs">{u.uid.slice(0, 8)}...</div>
											</div>
										</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-[var(--text-primary)]">
										<div className="inline-flex items-center gap-2">
											<FiMail className="text-[var(--accent-color1)]" />
											<span>{u.email || "—"}</span>
										</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap">
										<span className={u.role === "admin"
											? "inline-flex items-center gap-2 bg-[var(--primary-color1)] text-[var(--primary-color4)] px-3 py-1 rounded-full text-xs font-semibold"
											: "inline-flex items-center gap-2 bg-[var(--accent-color1)]/40 text-[var(--text-primary)] px-3 py-1 rounded-full text-xs font-semibold"
										}>
											{u.role === "admin" ? "مدیر" : "کاربر"}
										</span>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-[var(--text-secondary)]">
										{u.createdAt ? new Date(u.createdAt).toLocaleDateString("fa-IR") : "—"}
									</td>
									<td className="px-4 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2">
											<select
												className="py-1 px-2 bg-[var(--bg-color)] rounded-md border border-[var(--accent-color1)]/20 text-[var(--text-primary)]"
												value={u.role}
												onChange={(e) => dispatch(updateUserRole({ userId: u.uid, role: e.target.value as 'admin' | 'user' }))}
											>
												<option value="admin">مدیر</option>
												<option value="user">کاربر</option>
											</select>
											<button
												className="button-secondary rounded-md"
												onClick={() => dispatch(deleteUserById(u.uid))}
											>
												حذف
											</button>
										</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-[var(--text-secondary)]">
										{passedLoading ? <span className="text-xs animate-pulse text-[var(--text-secondary)]">...</span> : <span className="text-xs">{passedCounts[u.uid] ?? 0}</span>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		</div>
	);
};

export default UserManagementPage;


