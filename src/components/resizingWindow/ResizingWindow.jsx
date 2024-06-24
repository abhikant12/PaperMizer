import React, { useState, useRef } from "react";
import useResizeImage from "../../hooks/useImageResizer";
import useMargin from "../../hooks/useMargin";
import { positionImages } from "./utils";
import MarginHandles from "./components/MarginHandles";
import {
    Margin,
    setContainer,
    setShowBorder, setStartingMaxWidthFactor,} from "../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ImageBox } from "../../pages/Home";
import LabelInput from "../../components/LabelInput";
import LabelSelectInput from "../../components/LabelSelect";
import { paperSizes } from "../../data/paperSizes";
import ResizeAnchor from "./components/ResizeAnchor";
import { InformationCircleIcon } from "@heroicons/react/24/outline";



const ResizingWindow = ({ images, setImages }) => {
    const dispatch = useAppDispatch();
    const containerRef = useRef(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, startingMaxWidthFactor, showBorder } = useAppSelector(
        (state) => state.main
    );


    const {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        imageUrls,
        selectedId,
        setMaxY,
    } = useResizeImage({
        containerRef,
        images,
        setImages,
    });

    const handleMarginChange = (e, side) => {
        const newMarginValue = parseInt(e.target.value, 10);
        const newContainer = {
            ...container,
            margin: {
                ...container.margin,
                [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
            },
        };

        dispatch(setContainer(newContainer));

        const { _localImages, _maxY } = positionImages(
            localImages,
            newContainer
        );
        setLocalImages(_localImages);
        setMaxY(Math.max(container.h, _maxY));
    };

    const { handleMarginDragStart } = useMargin({
        localImages,
        setLocalImages,
        setMaxY,
        containerRef,
    });

    return (
        <div className="flex flex-col items-center justify-center w-full pt-5 mx-auto border-t">
            <div className="mb-4">
                <p className="text-sm text-center text-gray-600">
                    Click on the image and use the resize handle to resize the
                    images. Take reference from the A4 paper width below and
                    decide what size you want each image to be.
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 mb-4 sm:flex-row">
                <LabelInput
                    type="number"
                    label="Padding"
                    min={0}
                    max={30}
                    value={container.padding}
                    onChange={(e) => {
                        let padding = parseInt(e.target.value, 10);
                        if (isNaN(padding)) padding = 0;
                        dispatch(
                            setContainer({
                                ...container,
                                padding,
                            })
                        );
                    }}
                />
                <LabelSelectInput
                    label="Paper"
                    options={Object.values(paperSizes).map(({ name }) => ({
                        value: name,
                        label: name,
                    }))}
                    value={container.paperSize.name}
                    onChange={(e) => {
                        const selectedPaperSizeName = e.target.value;
                        const selectedPaperSize = paperSizes[selectedPaperSizeName];

                        if (selectedPaperSize) {
                            const newContainer = {
                                ...container,
                                paperSize: selectedPaperSize,
                                w: selectedPaperSize.width * 2,
                                h: selectedPaperSize.height * 2,
                            };

                            dispatch(setContainer(newContainer));
                        }
                    }}
                />
                <div className="flex flex-row items-center gap-x-2">
                    <input
                        type="checkbox"
                        checked={showBorder}
                        onChange={(e) => {
                            dispatch(setShowBorder(e.target.checked));
                        }}
                    />
                    <p className="text-sm">Add Border</p>
                </div>
            </div>
          
            {(
                <div className="flex flex-col items-center justify-center w-full mb-10  gap-y-2 max-w-[450px]">
                    <div className="mr-1">Margin: </div>
                    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
                        <LabelInput
                            type="number"
                            label="top"
                            value={container.margin.top}
                            onChange={(e) => handleMarginChange(e, "top")}
                        />
                        <LabelInput
                            type="number"
                            label="left"
                            value={container.margin.left}
                            onChange={(e) => handleMarginChange(e, "left")}
                        />
                        <LabelInput
                            type="number"
                            label="right"
                            value={container.margin.right}
                            onChange={(e) => handleMarginChange(e, "right")}
                        />
                        <LabelInput
                            type="number"
                            label="bottom"
                            value={container.margin.bottom}
                            onChange={(e) => handleMarginChange(e, "bottom")}
                        />
                    </div>
                </div>
            )}
         
            <div
                ref={containerRef}
                style={{
                    width: container.w * container.scaleFactor,
                    height: (maxY + 5) * container.scaleFactor,
                    border: "1px solid black",
                    position: "relative",
                }}
                className="mt-10 bg-white"
            >
                <div className="absolute flex flex-row items-center w-full h-10 -top-12">
                    <div className="w-full h-[1px] bg-gray-500 relative">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -left-[6px]"></div>
                    </div>
                    <div className="px-2 text-sm text-center whitespace-nowrap">
                        {container.paperSize.name} Paper Width
                    </div>
                    <div className="w-full h-[1px] bg-gray-500 relative">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -right-[6px]"></div>
                    </div>
                </div>
                {(
                    <MarginHandles handleMarginDragStart={handleMarginDragStart} />
                )}
                {maxY > container.h * container.scaleFactor && (
                    <div
                        className="absolute w-full bg-gray-300"
                        style={{
                            top: container.h * container.scaleFactor,
                            height: 1,
                        }}
                    >
                        <p className="absolute text-[8px] opacity-50 -top-3 right-1">
                            Page End
                        </p>
                    </div>
                )}
                {localImages.map((imgData) => {
                    const imageUrl = imageUrls.get(imgData.id) || "";

                    return (
                        <div
                            key={imgData.id}
                            data-id={imgData.id}
                            style={{
                                position: "absolute",
                                left: imgData.x * container.scaleFactor,
                                top: imgData.y * container.scaleFactor,
                                width: imgData.w * container.scaleFactor,
                                height: imgData.h * container.scaleFactor,
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: "cover",
                                border:
                                    selectedId === imgData.id
                                        ? "2px solid blue"
                                        : showBorder
                                        ? "1px solid black"
                                        : "none",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, imgData)}
                            onTouchStart={(e) => handleMouseDown(e, imgData)}
                        >
                            {selectedId === imgData.id && <ResizeAnchor />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResizingWindow;