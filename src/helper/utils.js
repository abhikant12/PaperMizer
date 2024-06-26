import jsPDF from "jspdf";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { pack } from "efficient-rect-packer";
import { ContainerType } from "../redux/features/slices/mainSlice";

export const saveAsPDF = async ({
    boxes,
    container,
    showBorder,
}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const pdf = new jsPDF("p", "pt", "a4");
            pdf.setTextColor("#000000");

            const a4Width = 595; // A4 width in points
            const a4Height = 842; // A4 height in points

            const scaleX = a4Width / container.w;
            const scaleY = a4Height / container.h;

            boxes.forEach((boxSet, index) => {
                if (index > 0) {
                    pdf.addPage("a4", "portrait");
                }

                const stage = new Konva.Stage({
                    container: "temp-container",
                    width: container.w,
                    height: container.h,
                });

                const layer = new Konva.Layer();
                stage.add(layer);

                boxSet.forEach((box) => {
                    if (box.imageElement) {
                        if (showBorder) {
                            const border = new Konva.Rect({
                                x: box.x - 1,
                                y: box.y - 1,
                                width: box.rotated ? box.h + 2 : box.w + 2,
                                height: box.rotated ? box.w + 2 : box.h + 2,
                                stroke: "#000000",
                                strokeWidth: 1,
                                rotation: box.rotated ? -90 : 0,
                                offsetX: box.rotated ? box.h : 0,
                            });
                            layer.add(border);
                        }

                        const konvaImage = new Konva.Image({
                            x: box.x,
                            y: box.y,
                            width: box.rotated ? box.h : box.w,
                            height: box.rotated ? box.w : box.h,
                            image: box.imageElement,
                            rotation: box.rotated ? -90 : 0,
                            offsetX: box.rotated ? box.h : 0,
                        });
                        layer.add(konvaImage);
                    }
                });

                stage.destroy();
            });

            pdf.save("packed-images.pdf");
            resolve(null);
        }, 0);
    });
};

export const handlePrintMultipleStages = (stages) => {
    let imagesContent = "";

    stages.forEach((stage, index) => {
        if (!stage) {
            return;
        }
        const dataUrl = stage.toDataURL();
        imagesContent += `<img class="print-page" src="${dataUrl}">`;
    });

    const printContent = `
        <html>
            <head>
                <title>Print canvas</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .print-page {
                        width: 100%;
                        height: auto;
                        display: block;
                        page-break-before: auto;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .print-page {
                            width: 100%;
                            height: auto;
                            display: block;
                            page-break-before: auto;
                        }
                    }
                </style>
            </head>
            <body>
                ${imagesContent}
            </body>
        </html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        };
    }
};

export const createImages = async (files) => {
    const newImages = await Promise.all(
        files.map((file) => {
            return new Promise((resolve) => {
                const img = new Image();
                const id = uuidv4();
                img.onload = () => {
                    resolve({
                        id,
                        file,
                        new: true,
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        })
    );

    return newImages;
};

export const packBoxes = async ({
    images,
    container,
}) => {
    let remainingImages = [...images];
    const allPackedBoxes = [];

    while (remainingImages.length > 0) {
        const { packed_rectangles, unpacked_rectangles, error } = await pack(
            remainingImages,
            {
                w: container.w,
                h: container.h,
            },
            {
                padding: Math.ceil(container.padding / 2),
                margin: container.margin,
                noRotation: false,
            }
        );

        if (error && error.length > 0) {
            console.error("Packing error:", error);
            break;
        }

        allPackedBoxes.push(packed_rectangles);
        remainingImages = unpacked_rectangles;
    }

    return allPackedBoxes;
};
