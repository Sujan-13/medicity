function Sidebar(props){
    return(
        <div>
            <ul>
                <li><button className="side-btns">{props.field}</button></li>
            </ul>
        </div>
    );
}

export default Sidebar;