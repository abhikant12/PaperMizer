import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

/** import all components */
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/navbar/Navbar';


export default function App() {
  return (
    <div>
       <BrowserRouter>

           <Navbar/>

           <Routes>
               <Route path="/" element={<Home/>} />
               <Route path = "/about" element = {<About/>} />
               <Route path = "/contact" element = {<Contact/>} />
           </Routes>

       </BrowserRouter>
    </div>



  );
}
