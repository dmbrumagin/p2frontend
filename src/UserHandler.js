import './App.css';
import {useEffect, useState } from 'react';
import { computeHeadingLevel } from '@testing-library/react';

export default function UserHandler(props) {
    const username = props.username;
    const setUsername = props.setUsername;
    const password = props.password;
    const setPassword = props.setPassword;
    //const createNewUser = props.createNewUser;
    const host = props.host;
    const setPage = props.setPageDisplay;
    const page = props.chosenPotluck;

   


    async function sendLogin(){
        const a = sessionStorage.getItem("auth");
        const response = await fetch(host+"/users",{
            method:"GET", 
            headers:{
                "Authorization":btoa(`${username}:${password}`)
            }
        });
        if (response.status == 200){
            const name = btoa(`${username}:${password}`);
        const auth = await response.json();
        sessionStorage.setItem("auth", JSON.stringify(auth));
        sessionStorage.setItem("username", username);
        console.log(username);
        window.location.reload(false);
        }
        else{
            alert("Login information was invalid")
        }

        
        
        
    }

    function logout(){
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("username");
        window.location.reload(false);
    }
    function createNewUser(){
        setPage('user');
    }



    if(!sessionStorage.getItem("auth")) {
        return(
            <div className="right">
            
            <label htmlFor="username">Username </label>
            <input  type="text" name="username" onChange={(e) => setUsername(e.target.value)} required placeholder="username" /><br />
            <label htmlFor="password">Password </label>
            <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required placeholder="password" /><br/>
            <button onClick={() => createNewUser()}>Create User</button>
            <button className="rightbutton" onClick={(e) =>{e.preventDefault(); sendLogin()}}>Log In</button>
           
            </div>
        );
    }
    else{
        return(<>
            <div>Welcome, {username} <button onClick={() => logout()}>Log Out</button></div>  
        </>);}
}