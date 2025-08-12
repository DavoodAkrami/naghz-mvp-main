export interface routesType {
    name: string;
    path: string;
    header?: boolean;
    profilePage?: boolean;
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
        profilePage: true
    },
    {
        name: "دوره‌های من",
        path: "/dashboard/my-curses",
        profilePage: true
    }
] 

export const dashboardPages: routesType[] = [
    {
        name: "پروفایل",
        path: "/dashboard/profile",
    },
    {
        name: "اطلاعات اکانت",
        path: "/dashboard/account-info"
    },
    {
        name: "دوره‌های من",
        path: "/dashboard/my-curses"
    }
];


export const links = {
    home: "/",
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    profile: "/dashboard/profile",
    accountInfo: "/dashboard/account-info",
    myCurses: "/dashboard/my-curses"
} 

export default routes;