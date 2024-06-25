import axios from 'axios';

const sendMail = async ({ userEmail, text, subject }) => {
    try {
        const response = await axios.post("http://localhost:8080/send-mail", {
            userEmail,
            text,
            subject
        });
        console.log(response.data);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendMail;
