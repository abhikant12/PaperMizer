import React, { useEffect, useState } from 'react';
import './About.css';
import Footer from "../components/Footer";


const About = () => {

    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const heading = 'About PaperMizer';

    useEffect(() => {
        if(index < heading.length) {
            const timeout = setTimeout(() => {
                setText((prev) => prev + heading[index]);
                setIndex((prev) => prev + 1);
            }, 200);  
            return () => clearTimeout(timeout);
        }
    }, [index, heading]);


    return (
        <> 
            <div className="main-container">
                <div className="container">
                
                    <h1 className="main-heading">{text}</h1>
                
                    <p className="main-paragraph">
                        Welcome to PaperMizer – your go-to solution for efficient image packing onto paper! We understand the importance of optimizing resources and minimizing waste, and that's exactly what PaperMizer aims to achieve. Our app utilizes a powerful bin packing algorithm to intelligently arrange your images on paper, ensuring the minimum number of pages required for printing.
                    </p>

                    <h2 className="sub-heading"> How to Use PaperMizer: </h2>
                
                    <ol className="list-decimal">
                    
                        <li className="list-decimal-item">
                            <strong>Uploading Images:</strong>
                            <ul className="list-disc">
                                <li>
                                    Drag and Drop: Simply drag and drop your images into the designated area.
                                </li>
                                <li>
                                    Click to Upload: Click anywhere inside the drop area to manually select and upload images.
                                </li>
                                <li>
                                    Ctrl + V: Paste images directly for quick uploading.
                                </li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Image Cropping:</strong>
                            <ul className="list-disc">
                                <li>
                                    Upon uploading, your images will be displayed in a resizing window.
                                </li>
                                <li>
                                    Click on an image to activate Cropping handles at the Top-Right corner.
                                </li>
                                <li>
                                    Crop the image according to your preference.
                                </li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Image Resizing:</strong>
                            <ul className="list-disc">
                                <li>
                                    Upon uploading, your images will be displayed in a resizing window.
                                </li>
                                <li>
                                    Click on an image to activate resizing handles at the bottom right corner.
                                </li>
                                <li>
                                    Drag the handles to resize the image according to your preference.
                                </li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Customization Options:</strong>
                            <ul className="list-disc">
                                <li>
                                    Adjust image sizes relative to paper dimensions.
                                </li>
                                <li>
                                    Set padding between images for better aesthetics.
                                </li>
                                <li>
                                    Define page margins to suit your printing needs.
                                </li>
                                <li>Add borders to images for a polished look.</li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Efficient Packing:</strong> 
                            <ul className="list-disc">
                                <li> Click on "Start Packing" to let our efficient algorithm arrange the images on paper. View the optimized layout and make adjustments as needed. </li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Download and Print:</strong> 
                            <ul className="list-disc">
                                <li> Once satisfied, download the layout as a PDF or print it directly. </li>
                            </ul>
                        </li>
                    
                        <li className="list-decimal-item">
                            <strong>Update and Refine:</strong> 
                            <ul className="list-disc">
                                <li> Use the "Resize Images" button to make further adjustments. Click on "Start Packing" again to generate a new packing based on your updates.</li>
                            </ul>
                        </li>
                    </ol>

                    <p className="sub-paragraph">
                        At PaperMizer, we believe in simplicity and effectiveness. Our
                        goal is to provide you with a user-friendly experience while
                        maximizing the efficiency of your printing projects. Feel free
                        to explore the customization options and enjoy the benefits of
                        intelligent image packing!
                    </p>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default About;
