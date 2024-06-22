import React from "react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-text">
                <p>
                    Made with{" "}
                    <span role="img" aria-label="heart">
                        ❤️
                    </span>{" "}
                    by Abhikant Singh
                </p>
            </div>
            <p className="footer-text">
                Contact: abhiparnav12@gmail.com
            </p>
        </footer>
    );
};

export default Footer;
