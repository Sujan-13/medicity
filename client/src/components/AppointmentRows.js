function AppointmentRows() {

    return(
        <div>
            <div>
                <table>
                    <tr>
                        <th>S.N.</th>
                        <th>Doctor Name.</th>
                        <th>Specialisation</th>
                        <th>Appointment Date</th>
                    </tr>
                </table>
            </div>
            <button className="side-btn">Book</button>
        </div>
    );
}

export default Appointment;