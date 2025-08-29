import clsx from "clsx";


export interface ButtonProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    buttonType?: "button-primary" | "button-secondary";
    classname: string;
}

const Button: React.FC<ButtonProp> = ({ buttonType, classname, children, ...props }) => {

    return (
        <button
            className={clsx(
                buttonType === "button-primary" ? "button-primary" : buttonType === "button-secondary" ? "button-secondary" : "",
                classname
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button;