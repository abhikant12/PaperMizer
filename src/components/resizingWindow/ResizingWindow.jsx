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
import './ResizingWindow.css';



const ResizingWindow = ({ images, setImages }) => {
    const dispatch = useAppDispatch();
    const containerRef = useRef(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, startingMaxWidthFactor, showBorder } = useAppSelector(
        (state) => state.main
    );

    // Function to toggle the margin controls
    const toggleMarginControls = () => {
        setShowMarginControls(!showMarginControls);
    };

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
        <div className="resizing-window-container">
            <div className="resizing-window-info">
                <p>
                    Click on the image and use the resize handle to resize the
                    images. Take reference from the A4 paper width below and
                    decide what size you want each image to be.
                </p>
            </div>
            <div className="resizing-window-controls">
                <button
                    onClick={toggleMarginControls}
                >
                    {showMarginControls ? "Hide Margins" : "Show Margins"}
                </button>
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
                <LabelInput
                    type="number"
                    label="Set initial max width %"
                    labelClassName="min-w-[150px]"
                    wrapperClassName="max-w-[250px]"
                    min={10}
                    max={100}
                    value={startingMaxWidthFactor * 100}
                    onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value)) value = 0;

                        dispatch(setStartingMaxWidthFactor(value / 100));
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
                        const selectedPaperSize =
                            paperSizes[selectedPaperSizeName];

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

                {/* show border checkBox */}
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
            {showMarginControls && (
                <div className="resizing-window-margin-controls">
                    {/* margin controls */}
                    <div className="resizing-window-margin-info">
                        <InformationCircleIcon className="resizing-window-margin-info-icon" />
                        <p>
                            Most browser's print feature also allows you to set
                            custom margins. You can leave the margins at 0 if
                            you want.
                        </p>
                    </div>

                    <div>Margin: </div>
                    <div className="resizing-window-margin-labels">
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
                }}
                className="resizing-window-image-container"
            >
                <div className="resizing-window-paper-size">
                    <div className="resizing-window-paper-size-line"></div>
                    <div className="resizing-window-paper-size-text">
                        {container.paperSize.name} Paper Width
                    </div>
                    <div className="resizing-window-paper-size-line"></div>
                </div>

                {showMarginControls && (
                    <MarginHandles
                        handleMarginDragStart={handleMarginDragStart}
                    />
                )}

                {maxY > container.h * container.scaleFactor && (
                    <div
                        className="resizing-window-page-end"
                        style={{
                            top: container.h * container.scaleFactor,
                            height: 1,
                        }}
                    >
                        <p className="resizing-window-page-end-text">
                            Page End
                        </p>
                    </div>
                )}

                {localImages.map((imgData, index) => {
                    const imageUrl = imageUrls.get(imgData.id) || "";

                    return (
                        <div
                            key={imgData.id}
                            data-id={imgData.id}
                            style={{
                                left: imgData.x * container.scaleFactor,
                                top: imgData.y * container.scaleFactor,
                                width: imgData.w * container.scaleFactor,
                                height: imgData.h * container.scaleFactor,
                                backgroundImage: `url(${imageUrl})`,
                            }}
                            className={`resizing-window-image ${
                                selectedId === imgData.id
                                    ? "resizing-window-image-selected"
                                    : showBorder
                                    ? "resizing-window-image-border"
                                    : ""
                            }`}
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
