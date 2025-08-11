interface routesType {
    name: string;
    path: string;
    header: boolean;
    profilePage?: boolean;
}

const routes: routesType[] = [
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
        path: "/auth/si-in",
        header: false
    },
    {
        name: "داشبورد",
        path: "/dashboard",
        header: false,
        profilePage: true
    }
] 

export default routes;