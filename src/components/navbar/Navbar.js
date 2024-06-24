import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Navbar.css';  // This is where we'll define our styles


const Navbar = () => {
    const [isHovering, setIsHovering] = useState(false);

    const hoverTimer = useRef();
    const hoverAnimationDelay = useRef();

    useEffect(() => {
        // Trigger the animation automatically after the component mounts
        handleMouseEnter();

        const backAnimation = setTimeout(() => {
            handleMouseLeave();
        }, 1500);

        // Cleanup on component unmount
        return () => {
            clearTimeout(hoverAnimationDelay.current);
            clearTimeout(hoverTimer.current);
            clearTimeout(backAnimation);
        };
    }, []); // Empty dependency array ensures the effect runs only once after the initial render

    const handleMouseEnter = () => {
        // Set a timeout for 100ms before starting the hover animation
        hoverAnimationDelay.current = setTimeout(() => {
            setIsHovering(true);
        }, 100);
    };

    const handleMouseLeave = () => {
        // Clear both timeouts if the mouse leaves before 100ms or 1 second
        clearTimeout(hoverAnimationDelay.current);
        clearTimeout(hoverTimer.current);
        setIsHovering(false);
    };

    
    return (
      
<nav className="navbar">

      <div className="navbar-brand">
            <Link
                to={"/"}
                className="flex cursor-pointer  gap-x-1"
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
     
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      
      <div className="navbar-icons">
        <a href="https://www.linkedin.com/in/abhikant12/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
      </div>
  
    </nav>


    );
};

export default Navbar;
