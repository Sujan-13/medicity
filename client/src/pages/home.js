import "../styles/home.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

function Home(){
    return(
    <div>
    <Nav />
    <section class="hero">
        <div class="bg-image">
            <img src="https://images.unsplash.com/photo-1512102438733-bfa4ed29aef7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fG1lZGljYWwlMjBob3NwaXRhbHxlbnwwfHwwfHx8MA%3D%3D" alt=""/>
        </div>
        <div class="doctor-search">
            <h1>Welcome to Medicity</h1>
            <p>Find the best medical services near you</p>
            <Link to={"/login"}><button class="search-btn">Search for Doctors</button></Link>
            <div class="doctors">
                <div class="doctor">
                    <img src="https://images.unsplash.com/photo-1603843722974-3a4031f9f97c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                    <h2>Dr. John Doe</h2>
                    <p>Cardiologist</p>
    
            </div>
            <div class="doctor">
                <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" alt=""/>
                    <h2>Dr. Jane Smith</h2>
                    <p>Neurologist</p>
            </div>
            <div class="doctor">
                <img src="https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D" alt=""/>
                    <h2>Dr. Mariya Johnson</h2>
                    <p>Gynecologist</p>
            </div>
        </div>
    </div>
        
        <div class="content">
            <h1>Discover the best healthcare for you</h1>
            <p>Book appointments, consult with doctors, and get personalized care</p>
           <Link to={"/login"}><button class="book-btn">Book an appointment</button></Link>
        </div>

    </section>
    <Footer />
    </div>
    );
}
   

export default Home;