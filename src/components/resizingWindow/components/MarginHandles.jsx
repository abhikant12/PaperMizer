import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import MarginHandleIcon from "../../../assets/MarginHandleIcon";
import './MarginHandles.css';

const MarginHandles = ({ handleMarginDragStart }) => {
    const { container } = useAppSelector((state) => state.main);

    return (
        <>
            {/* left margin handle */}
            <div
                className="margin-handle margin-handle-left"
                style={{
                    left: container.margin.left * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "left")}
                onTouchStart={(e) => handleMarginDragStart(e, "left")}
            >
                <MarginHandleIcon />
            </div>

            {/* right margin handle */}
            <div
                className="margin-handle margin-handle-right"
                style={{
                    right: container.margin.right * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "right")}
                onTouchStart={(e) => handleMarginDragStart(e, "right")}
            >
                <MarginHandleIcon />
            </div>

            {/* top margin handle */}
            <div
                className="margin-handle margin-handle-top"
                style={{
                    top: container.margin.top * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "top")}
                onTouchStart={(e) => handleMarginDragStart(e, "top")}
            >
                <MarginHandleIcon className="margin-handle-icon" />
            </div>

            {/* margin lines */}
            <div
                className="margin-line-top"
                style={{
                    height: container.margin.top * container.scaleFactor,
                }}
            ></div>
            <div
                className="margin-line-left"
                style={{
                    width: container.margin.left * container.scaleFactor,
                }}
            ></div>
            <div
                className="margin-line-right"
                style={{
                    width: container.margin.right * container.scaleFactor,
                }}
            ></div>
        </>
    );
};

export default MarginHandles;
