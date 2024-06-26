import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";
import './LabelInput.css';

const LabelInput = forwardRef(
    ({ type, label, disabled, labelClassName, wrapperClassName, className, min, max, ...rest }, ref) => {
        const id = useId();

        return (
            <label className={twMerge( "label-input-wrapper", wrapperClassName )} >
                <span className={twMerge( "label-input-span", labelClassName )} > {label} </span>
                <input min={min} max={max} type={type} id={id} placeholder={label} disabled={disabled} {...rest} ref={ref} className={twMerge( "label-input", disabled && "label-input:disabled", className )} />
            </label>
        );
    }
);

export default LabelInput;
