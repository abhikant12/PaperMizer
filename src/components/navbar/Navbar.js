import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import './Navbar.css';  // This is where we'll define our styles

function Navbar(){
  return (
    <nav className="navbar">
     
     <div className="navbar-brand">
        <Link to="/">PaperMizer</Link>
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
}

export default Navbar;
