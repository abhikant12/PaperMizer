import React, { useState, useEffect, useCallback } from "react";
import { positionImages } from "../components/resizingWindow/utils";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const useResizeImage = ({ containerRef, images, setImages }) => {
    const {
        container,
        filesUpdatedFlag,
        isResizingAgain,
        startingMaxWidthFactor,
    } = useAppSelector((state) => state.main);

    const [localImages, setLocalImages] = useState(images);
    const [selectedId, setSelectedId] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [maxY, setMaxY] = useState(container.h);
    const [startingDistFromRightEdge, setStartingDistFromRightEdge] = useState(0);
    const [imageUrls, setImageUrls] = useState(new Map());

    useEffect(() => {
        if (!images.length) {
            setLocalImages([]);
        }
        const newImageUrls = new Map();
        images.forEach((image) => {
            if (image.file) {
                newImageUrls.set(image.id, URL.createObjectURL(image.file));
            }
        });
        setImageUrls(newImageUrls);

        const { _maxY, _localImages } = positionImages(
            images,
            container,
            isResizingAgain ? undefined : startingMaxWidthFactor
        );

        setMaxY(Math.max(container.h, _maxY));
        setLocalImages(_localImages);
    }, [filesUpdatedFlag]);

    useEffect(() => {
        const preventDefaultWhenResizing = (e) => {
            if (isResizing) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventDefaultWhenResizing, {
            passive: false,
        });

        return () => {
            document.removeEventListener("touchmove", preventDefaultWhenResizing);
        };
    }, [isResizing]);

    const updateImageSize = (clientX, clientY) => {
        const selectedImage = localImages.find((img) => img.id === selectedId);
        if (selectedImage && containerRef.current) {
            const aspectRatio = selectedImage.w / selectedImage.h;
            let mouseX = clientX / container.scaleFactor;
            let mouseY = clientY / container.scaleFactor;

            const rect = containerRef.current.getBoundingClientRect();

            mouseX -= rect.left / container.scaleFactor;

            let newWidth = Math.max(50, mouseX - selectedImage.x);

            newWidth += startingDistFromRightEdge;

            let newHeight = newWidth / aspectRatio;

            if (newWidth > container.w - container.margin.left - container.margin.right) {
                newWidth = container.w - container.margin.left - container.margin.right;
                newHeight = newWidth / aspectRatio;
            }
            if (newHeight > container.h - container.margin.top - container.margin.bottom) {
                newHeight = container.h - container.margin.top - container.margin.bottom;
                newWidth = newHeight * aspectRatio;
            }

            const updatedImages = localImages.map((img) =>
                img.id === selectedId ? { ...img, w: newWidth, h: newHeight } : img
            );

            return updatedImages;
        }
        return null;
    };

    const repositionImages = (updatedImages) => {
        const repositionedImages = positionImages(updatedImages, container)._localImages;
        const repositionedImage = repositionedImages.find((img) => img.id === selectedId);
        const originalImage = localImages.find((img) => img.id === selectedId);

        if (originalImage && repositionedImage && originalImage.y !== repositionedImage.y) {
            setIsResizing(false);
            setSelectedId(null);
        }
        setLocalImages(repositionedImages);
        const newMaxY = repositionedImages.reduce((acc, img) => Math.max(acc, img.y + img.h), 0);
        setMaxY(Math.max(container.h, newMaxY));
    };

    const handleResize = (clientX, clientY) => {
        if (isResizing && selectedId) {
            const updatedImages = updateImageSize(clientX, clientY);
            if (updatedImages) {
                repositionImages(updatedImages);
            }
        }
    };

    const handleMouseDown = (e, imgData) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains("resize-handle")) {
            const clientX = e.clientX || e.touches[0].clientX;
            let mouseX = clientX / container.scaleFactor;
            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) return;

            mouseX -= rect.left / container.scaleFactor;

            const distBetweenMouseAndRightEdge = imgData.x + imgData.w - mouseX;

            setStartingDistFromRightEdge(distBetweenMouseAndRightEdge);

            setIsResizing(true);
            setSelectedId(imgData.id);

            return;
        }

        if (selectedId !== imgData.id) {
            setSelectedId(imgData.id);
        }
    };

    const handleMouseMove = (e) => {
        handleResize(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleResize(touch.clientX, touch.clientY);
        }
    };

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        setImages(localImages);
    }, [localImages]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove]);

    useEffect(() => {
        repositionImages(localImages);
    }, [container]);

    return {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        setSelectedId,
        setIsResizing,
        selectedId,
        imageUrls,
        setMaxY,
    };
};

export default useResizeImage;