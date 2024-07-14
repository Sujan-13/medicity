import { Link } from "react-router-dom";

function Nav(){
    return(
    <nav>
        <Link to={"/"}><div class="logo">Medicity</div></Link>
        <ul class="menus">
            <div class="buttons">
               <Link to={"/login"}> <button class="login">Login</button></Link>
               <Link to={"/signup"}> <button class="register">Sign Up</button></Link>
            </div>
        </ul>
    </nav>   
    );
}

export default Nav;