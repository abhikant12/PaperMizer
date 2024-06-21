import { useEffect, useState } from "react";

const useImageURLs = (images) => {
    const [imageUrls, setImageUrls] = useState(new Map());

    useEffect(() => {
        if (!images) return;
        const newImageUrls = new Map();
        images.forEach((image) => {
            if (image.file && !imageUrls.get(image.id)) {
                const url = URL.createObjectURL(image.file);
                newImageUrls.set(image.id, url);
            }
        });
        setImageUrls(newImageUrls);

        // Clean up object URLs when component unmounts or images change
        return () => {
            newImageUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    return imageUrls;
};

export default useImageURLs;
