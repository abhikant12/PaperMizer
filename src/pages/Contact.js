import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import CountryCode from "../data/countrycode.json";
import './Contact.css'; // Import the CSS file
import Footer from "../components/Footer";
import sendMail from "../controller/mailer";
import { ClipLoader } from 'react-spinners';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phoneNo: "",
        countrycode: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { firstname, lastname, email, phoneNo, message } = formData;
        if(!firstname || !lastname || !email || !phoneNo || !message) {
            toast.error("All fields are required.");
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)){
            toast.error("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) return;
        setLoading(true);
        try {
            await sendMail({ userEmail: formData.email, text: formData.message, subject: "We appreciate your message!" });
            await sendMail({ userEmail: "abhikantkumar8294026755@gmail.com", text: formData.message, subject: `${formData.email} has sent you some messages ` });
            toast.success("Message sent successfully!");
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                phoneNo: "",
                countrycode: "",
                message: "",
            });
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position='top-center' reverseOrder={false} />
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <ClipLoader color="#134e4a" size={50} />
                        <p className="text-2xl font-semibold">Sending Message</p>
                    </div>
                </div>
            )}
            <div className={`contact-page ${loading ? 'blurred' : ''}`}>
                <div className="contact-info">
                    <h1> Get in touch with us </h1>
                    <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <span>abhiparnav12@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span> 9304324380 </span>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span> C5M6+W9J, Mumbai - Agra Rd, Raghogarh -Vijaypur, Mohanpur, Madhya Pradesh 473226 </span>
                    </div>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstname">First Name:</label>
                            <input type="text" name="firstname" id="firstname" placeholder="Enter first name" className="form-style" value={formData.firstname} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">Last Name:</label>
                            <input type="text" name="lastname" id="lastname" placeholder="Enter last name" className="form-style" value={formData.lastname} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address:</label>
                            <input type="email" name="email" id="email" placeholder="Enter email address" className="form-style" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phonenumber">Phone Number:</label>
                            <div className="phone-input">
                                <select name="countrycode" id="countrycode" className="form-style" value={formData.countrycode} onChange={handleChange}>
                                    {CountryCode.map((ele, i) => (<option key={i} value={ele.code}>{ele.code} - {ele.country}</option>))}
                                </select>
                                <input type="text" name="phoneNo" id="phonenumber" placeholder="12345 67890" className="form-style" value={formData.phoneNo} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea name="message" id="message" cols="30" rows="7" placeholder="Enter your message here" className="form-style" value={formData.message} onChange={handleChange} />
                        </div>

                        <button disabled={loading} type="submit" className={`submit-button ${!loading && "hover-scale-95"}`}>  {loading ? "Sending..." : "Send Message"}  </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;
