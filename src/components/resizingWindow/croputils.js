export const createImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
    });
};


export const getCroppedImg = async (imageUrl, crop) => {
    if (!crop || !crop.width || !crop.height) {
        throw new Error("Invalid crop dimensions");
    }

    const img = await createImage(imageUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                reject(new Error('Canvas is empty'));
                return;
            }
            const fileUrl = URL.createObjectURL(blob);
            resolve({ blob, fileUrl, width: canvas.width, height: canvas.height });
        }, 'image/jpeg');
    });
};
