export interface routesType {
    name: string;
    path: string;
    header?: boolean;
    profilePage?: boolean;
    adminRequaire?: boolean;
}


const routes: routesType[]= [
    {
        name: "خانه",
        path: "/",
        header: true,
    },
    {
        name: "ثبت نام",
        path: "/auth/sign-up",
        header: false
    },
    {
        name: "ورود",
        path: "/auth/sign-in",
        header: false
    },
    {
        name: "پروفایل",
        path: "/dashboard/profile",
        profilePage: true
    },
    {
        name: "اطلاعات اکانت",
        path: "/dashboard/account-info",
        profilePage: false
    },
    {
        name: "دوره‌های من",
        path: "/dashboard/my-curses",
        profilePage: false
    },
    {
        name: "دوره‌ها",
        path: "/dashboard/course-management",
        adminRequaire: true  
    },
    {
        name: "مدیریت دوره‌ها",
        path: "/courses",
        header: true
    },
    {
        name: "کاربران",
        path: "/dashboard/user-management",
        adminRequaire: true  
    },
] 


export const dashboardPages: routesType[] = [
    {
        name: "پروفایل",
        path: "/dashboard/profile",
    },
    // {
    //     name: "اطلاعات اکانت",
    //     path: "/dashboard/account-info"
    // },
    // {
    //     name: "دوره‌های من",
    //     path: "/dashboard/my-curses"
    // },
    {
        name: "مدیریت دوره‌ها",
        path: "/dashboard/course-management",
        adminRequaire: true,
    },
    {
        name: "کاربران",
        path: "/dashboard/user-management",
        adminRequaire: true  
    },
];


export const links = {
    home: "/",
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    profile: "/dashboard/profile",
    accountInfo: "/dashboard/account-info",
    myCurses: "/dashboard/my-curses",
    courses: "/courses"
} 

export default routes;