import { Link } from "react-router-dom";

function Nav(props){
    return(
    <nav>
        <Link to={"/"}><div class="logo">Medicity</div></Link>
        <ul class="menus">
            <div class="buttons">
            {!(props.change) && 
            <div>
            <Link to={"/login"}><button class="login">Login</button></Link>
            <Link to={"/signup"}> <button class="register">Sign Up</button></Link>
            </div>
             }
            {(props.change)&& <button onClick={props.handlelogOut} class="login">Log Out</button>}
            </div>
        </ul>
    </nav>   
    );
}

export default Nav;