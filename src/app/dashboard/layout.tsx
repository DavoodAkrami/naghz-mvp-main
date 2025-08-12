import SideBar from "@/components/SideBar";
import { dashboardPages } from "@/routes/routes";
import { dashboardMetadata } from "@/config/metadata";


export const metadata = dashboardMetadata;

const DahsboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div 
            className="grid grid-cols-[5%_1fr_3%_1fr_1fr_5%] max-h-[80vh] max-md:grid-cols-[3%_1fr_3%]"
            dir="rtl"
        >
            <div 
                className="col-start-2 col-end-3 max-md:hidden"
            >
                <SideBar routes={dashboardPages} />
            </div>
            <div
                className="col-start-4 col-end-6 border-[1.8px] border-[var(--accent-color1)] rounded-xl px-[5px] shadow-lg max-md:col-start-2 max-md:col-end-3 max-md:min-h-[85vh]"
            >
                {children}
            </div>
        </div>
    )
}

export default DahsboardLayout;