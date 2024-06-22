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
        "custom-button",
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
