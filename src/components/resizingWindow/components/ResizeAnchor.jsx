import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import './ResizeAnchor.css';

const ResizeAnchor = () => {
    return (
        <div className="resize-handle">
            <div className="relative h-full pointer-events-none">
                <ArrowSmallDownIcon
                    strokeWidth={2}
                    className="resize-icon resize-icon-1"
                />
                <ArrowSmallDownIcon
                    strokeWidth={2}
                    className="resize-icon resize-icon-2"
                />
            </div>
        </div>
    );
};

export default ResizeAnchor;
