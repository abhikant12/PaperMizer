import React, { useId } from "react";
import { twMerge } from "tailwind-merge";
import './LabelSelect.css';

const LabelSelectInput = ({
    label,
    disabled,
    labelClassName,
    wrapperClassName,
    className,
    options,
    ...rest
}) => {
    const id = useId();

    return (
        <label
            className={twMerge(
                "label-select-wrapper",
                wrapperClassName
            )}
        >
            <span
                className={twMerge(
                    "label-select-span",
                    labelClassName
                )}
            >
                {label}
            </span>
            <select
                id={id}
                disabled={disabled}
                {...rest}
                className={twMerge(
                    "label-select-input",
                    disabled && "label-select-input:disabled",
                    className
                )}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default LabelSelectInput;
