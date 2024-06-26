import React, { useEffect, useMemo } from "react";
import useDragAndDrop from "../../hooks/useDragDrop";
import { createImages } from "../../helper/utils";
import { filesUpdated, setImagesLoaded, setInResizeMode} from "../../redux/features/slices/mainSlice";
import { useAppDispatch } from "../../redux/hooks";
import { ImageBox } from "../../pages/Home";
import "./style.css";



const FileDropArea = ({ images, setImages, setBoxes }) => {

    const dispatch = useAppDispatch();

    const {
        dragging,
        files,
        handleDragOver,
        handleDrop,
        mainRef,
        handlePaste,
        fileInputRef,
        triggerFileInput,
        handleFileInputChange,
    } = useDragAndDrop();

    const handleImageUpload = async (uploadedFiles) => {
        const newImages = await createImages(uploadedFiles);
        setImages([...images, ...newImages]);
        dispatch(setImagesLoaded(false));
        dispatch(setInResizeMode(true));
        setBoxes([]);

        // dispatch(filesUpdated());
        setTimeout(() => {
            dispatch(filesUpdated());
        }, 50);
    };

    // Call handleImageUpload when files state changes
    useEffect(() => {
        if(files && files.length > 0) {
            handleImageUpload(files);
        }
    }, [files]);


    const removeImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
        // execute after 50ms to allow the state to update
        setTimeout(() => {
            dispatch(filesUpdated());
        }, 50);
    };

    const imagePreviews = useMemo(() => {
        return images.map((image) => (

            <div key={image.id} className="image-preview-container" >
                {image.file && (<img src={URL.createObjectURL(image.file)} alt="Preview"  className="image-preview" />)}
                <button onClick = {() => removeImage(image.id)} className="remove-button" > &#10005; {/* Cross Icon */} </button>
            </div>
            
        ));
    }, [images, filesUpdated]);         // Dependency on images and filesUpdated


    return (
        <>
            <div  ref={mainRef} onDragOver={handleDragOver} onDrop={handleDrop}  onPaste={handlePaste}  className={`drop-area ${dragging ? "dragging" : ""}`} >
                
                <div onClick = {triggerFileInput} className="drop-area-content"  >
                    Drop Files or Click to Upload
                </div>


            </div>

            {/* Hidden file input */}
            <input type="file"  multiple  onChange={handleFileInputChange}  ref={fileInputRef} accept="image/*" style={{ display: "none" }} /> 
        </>
    );
};


export default FileDropArea;
