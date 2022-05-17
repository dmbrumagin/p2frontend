import { useState, useEffect } from 'react';
import './App.css';


export default function UpdatePotluck(props) {

    const setDate = props.setDate;
    const date = props.date;
    const setVisibility = props.setVisibility;
    const visibility = props.visibility;
    const username = props.username;
    const potluckId = props.chosenPotluck;
    const setPageDisplay = props.setPageDisplay;
    const host = props.host;
    const [potluck, setPotluck] = useState([]);

    useEffect(() => {
        getPotluck();
    }, []);

    async function update() {
        console.log(date);
        console.log(visibility);
        const potluck = { id: potluckId, dateTime: date, creatorId: username, visibility: Boolean(visibility) };

        const response = await fetch(host + "/potluck/" + potluckId, {
            body: JSON.stringify(potluck),
            method: "PATCH",
            headers: {
                //  "Authorization":`${session.authorization}`,
                "Content-Type": "application/json"
            }
        });
        const body = await response.arrayBuffer();
        const string = new TextDecoder().decode(body);
        if (response.status === 200) {
            alert("Potluck rescheduled.");
            setPotluck(potluck);
        } else {
            alert(string);
        }
    }

    async function getPotluck() {
        const response = await fetch(host + "/potlucks/" + potluckId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const object = await response.json();
        setPotluck(object);
    }


    return (<>
            <fieldset id='update'>
                <legend htmlFor='update'>Update Potluck</legend>
                <table>
                    <tr><th>Date:</th><th>Time:</th><th>Private/Public</th></tr>
                    <tr>
                        <td>{new Date(potluck.dateTime ? potluck.dateTime : 0).toDateString()}</td>
                        <td>{new Date(potluck.dateTime ? potluck.dateTime : 0).toLocaleTimeString()}</td>
                        <td>{potluck.visibility ? "Public" : "Private"}</td>
                    </tr>
                </table>
                Start time:&nbsp;
                <input required onChange={(e) => setDate(new Date(e.target.value).getTime())} type={"dateTime-local"} />{' '}
                Public
                <input onClick={(e) => setVisibility(e.target.checked)} type="checkbox" />
                {' '}<button onClick={(e) => { e.preventDefault(); update() }}>Update</button>
            </fieldset>
            <button id="back-button" onClick={() => setPageDisplay('potluckList')}>Back</button>
    </>);

}
