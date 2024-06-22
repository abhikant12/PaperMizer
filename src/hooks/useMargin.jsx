import React, { useState, useEffect } from "react";
import { positionImages } from "../components/resizingWindow/utils";
import { setContainer } from "../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const useMargin = ({
    containerRef,
    localImages,
    setLocalImages,
    setMaxY,
}) => {
    const dispatch = useAppDispatch();
    const { container } = useAppSelector((state) => state.main);
    const [isDraggingMargin, setIsDraggingMargin] = useState(false);
    const [draggingMargin, setDraggingMargin] = useState("");

    const handleMarginChange = (
        e,
        side
    ) => {
        const newMarginValue = parseInt(e.target.value, 10);
        dispatch(
            setContainer({
                ...container,
                margin: {
                    ...container.margin,
                    [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
                },
            })
        );
    };

    // for preventive page scrolling while resizing in mobile
    useEffect(() => {
        const preventDefaultWhenResizing = (e) => {
            if (isDraggingMargin) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventDefaultWhenResizing, {
            passive: false,
        });

        return () => {
            document.removeEventListener(
                "touchmove",
                preventDefaultWhenResizing
            );
        };
    }, [isDraggingMargin]);

    const handleMarginDragStart = (e, side) => {
        setDraggingMargin(side);
        setIsDraggingMargin(true);
    };

    const handleMarginDrag = (e) => {
        if (!isDraggingMargin || !containerRef.current) return;

        const clientX = e.type.includes("touch")
            ? e.touches[0].clientX
            : e.clientX;

        const clientY = e.type.includes("touch")
            ? e.touches[0].clientY
            : e.clientY;

        const rect = containerRef.current.getBoundingClientRect();

        let newMargin;
        switch (draggingMargin) {
            case "top":
                newMargin = clientY - rect.top;
                break;
            case "right":
                newMargin = rect.right - clientX;
                break;
            case "bottom":
                newMargin = rect.bottom - clientY;
                break;
            case "left":
                newMargin = clientX - rect.left;
                break;
            default:
                newMargin = 0;
                break;
        }

        // Constrain the margin value
        newMargin = Math.max(0, newMargin);
        newMargin = Math.min(newMargin, 150); // Assuming a minimum container width
        newMargin = Math.round(newMargin / container.scaleFactor);

        dispatch(
            setContainer({
                ...container,
                margin: {
                    ...container.margin,
                    [draggingMargin]: newMargin,
                },
            })
        );
    };

    const handleMarginDragEnd = () => {
        setIsDraggingMargin(false);
    };

    useEffect(() => {
        if (!isDraggingMargin) return;
        const { _localImages, _maxY } = positionImages(localImages, container);
        setLocalImages(_localImages);
        setMaxY(Math.max(_maxY, container.h));
    }, [container.margin, isDraggingMargin]);

    useEffect(() => {
        if (isDraggingMargin) {
            window.addEventListener("mousemove", handleMarginDrag);
            window.addEventListener("mouseup", handleMarginDragEnd);
            window.addEventListener("touchmove", handleMarginDrag);
            window.addEventListener("touchend", handleMarginDragEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMarginDrag);
            window.removeEventListener("mouseup", handleMarginDragEnd);
            window.removeEventListener("touchmove", handleMarginDrag);
            window.removeEventListener("touchend", handleMarginDragEnd);
        };
    }, [isDraggingMargin]);

    return { handleMarginChange, handleMarginDragStart, isDraggingMargin };
};

export default useMargin;
