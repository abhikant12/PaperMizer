import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';


const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();  

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isHovering, setIsHovering] = useState(false);
    const hoverTimer = useRef();
    const hoverAnimationDelay = useRef();

    useEffect(() => {
        handleMouseEnter();
        const backAnimation = setTimeout(() => {
            handleMouseLeave();
        }, 1500);
        return () => {
            clearTimeout(hoverAnimationDelay.current);
            clearTimeout(hoverTimer.current);
            clearTimeout(backAnimation);
        };
    }, []);

    const handleMouseEnter = () => {
        hoverAnimationDelay.current = setTimeout(() => {
            setIsHovering(true);
        }, 100);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverAnimationDelay.current);
        clearTimeout(hoverTimer.current);
        setIsHovering(false);
    };

    const getLinkClass = (path) => {
        return location.pathname === path
            ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
            : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";
    };


    return(
        <nav className="navbar fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                
            
                <div className="navbar-brand">
                    <Link
                    to={"/"}
                    className="flex items-center space-x-1 rtl:space-x-reverse"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                
                    {["P", "a", "p", "e", "r"].map((letter, index) => (
                            <span
                                key={index}
                                className={`letter ${
                                    isHovering ? "fade-out" : "fade-in"
                                }`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {letter}
                            </span>
                        ))}
    
                        {["M", "i", "z", "e", "r"].map((letter, index) => (
                            <span
                                key={index}
                                className={`letter ${
                                    isHovering ? "fade-out" : "fade-in"
                                }`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {letter}
                            </span>
                        ))}
                </Link>
                </div>

                <div className="navbar-main flex md:order-2 space-x-3 md:space-x-0">
                  
                    <div className="navbar-icons">
                        <a href="https://www.linkedin.com/in/abhikant12/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    </div>
                   
                    <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded={isMenuOpen ? "true" : "false"}>
                        {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                    </button>
               
                </div>

                <div className={`items-center justify-between ${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                    <ul className="navbar-links flex flex-col p-4 md:p-0 mt-1  md:space-x-8 md:flex-row ">
                        <li>
                            <Link to="/" onClick={toggleMenu} className={getLinkClass("/")}>Home</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={toggleMenu} className={getLinkClass("/about")}>About</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={toggleMenu} className={getLinkClass("/contact")}>Contact</Link>
                        </li>
                    </ul>
                </div>
           
            </div>
        </nav>
    );
};

export default Navbar;
