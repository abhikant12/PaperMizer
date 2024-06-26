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
import CropModal from './Model';
import {createImage} from './croputils';


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

    const [isCropping, setIsCropping] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageId, setCropImageId] = useState(null);

    const openCropModal = (imageId) => {
        setCropImageId(imageId);
        setCropModalOpen(true);
    };

    const closeCropModal = () => {
        setCropModalOpen(false);
        setCropImageId(null);
    };

    const handleCropAndSave = async (img) => {
        
        const {blob, fileUrl, width, height} = img;
        const newImage = {
            id: cropImageId,
            w: width,
            h: height,
            x: 0,
            y: 0,
            file:blob,
            src: fileUrl,
        };

        setLocalImages((prevImages) =>
            prevImages.map((img) =>
                img.id === cropImageId ? newImage : img
            )
        );
        setImages((prevImages) =>
            prevImages.map((img) =>
                img.id === cropImageId ? newImage : img
            )
        );
        imageUrls.set(cropImageId, fileUrl);
        closeCropModal();
    };


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
                    Click on the image and use the resize handle to resize the images and Crop button to crop the image.
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
                {cropModalOpen && cropImageId && (
                                <CropModal
                                    imageUrl={imageUrls.get(cropImageId)}
                                    onClose={closeCropModal}
                                    onSave={handleCropAndSave}
                                />
                            )}
            </div>
        </div>
    );
};

export default ResizingWindow;

