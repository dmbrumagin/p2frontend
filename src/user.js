import {useState} from 'react';
import './App.css';

export default function user(props){
    const page = props.setPageDisplay;
    const username = props.username;
    const setUsername = props.setUsername;
    const password = props.password;
    const setPassword = props.setPassword;
    const host = props.host;
    const setPageDisplay=props.setPageDisplay;
    const jsx = [];

    async function createLogin(){


        const user = {username,password};
        console.log(user);

        const response = await fetch(`${host}/users`,{
            body:JSON.stringify(user),
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }     
        });
        if(response.status === 200){
            const body = await response.json();       
            alert(`New user registered ${body.username}`)
            window.location.reload(false);
        }else{
            alert("Failed to Create a User");
        }
    }

    jsx.push(<div id='create'>
        <label>Create a User:</label><br/>
        <label htmlFor="username"> Username</label>
        <input  type="text" name="username" onChange={(e) => setUsername(e.target.value)} required placeholder="username" />
        <label htmlFor="password">Password</label>
        <input pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}$"  type="text" name="password" id='password' onChange={(e) => setPassword(e.target.value)} required placeholder="password" />
        <div class="requirements">
        <label>You must have the following:</label>
        <ul>
            <li>An Uppercase Letter</li>
            <li>A Number</li>
            <li>A Special Character</li>
        </ul>
        </div>
        <button onClick={createLogin}>Submit</button>
        <br/>
        <button id="back-button" onClick={() => setPageDisplay('potluckList')}>View Potlucks</button></div>
    )
    
    return(<>{jsx}</>);
    
}