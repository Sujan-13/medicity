function Dropdown(props) {
    return(
        <option value={props.value}>{props.field}</option>
    );
}

export default Dropdown;