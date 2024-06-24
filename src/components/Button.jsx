import React from "react";
import { twMerge } from "tailwind-merge";
import './Button.css';

function Button({
    children,
    className,
    onClick,
    disabled,
    type = "button",
}) {
    const classNameText = twMerge(
        " px-2 py-2 bg-blue-500 hover:bg-blue-700 text-white select-none rounded gap-1 flex items-center justify-center",
        className
    );

    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={classNameText}
        >
            {children}
        </button>
    );
}

export default Button;
