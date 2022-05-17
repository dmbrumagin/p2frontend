import './App.css';
import { useState, useEffect } from 'react'
import UserCreator from './user'
import UserHandler from './UserHandler'
import Potlucks from './potlucks'
import Items from './items'
import logo from './gatherLogo.png'
import UpdatePotluck from './updatePotluck'
import {useParams } from 'react-router';


function App() {
  //const host = "http://localhost:8080";
  const host = "Expense.eba-9m4h5zyu.us-east-1.elasticbeanstalk.com";

  const[username, setUsername] = useState();
  const[loggedIn, setLoggedIn] = useState(false);
  const[chosenPotluck,setChosenPotluck] = useState("");
  const[chosenPotluckCreator,setChosenPotluckCreator] = useState("");
  const[pageDisplay,setPageDisplay] = useState("potluckList");
  const [password, setPassword] = useState([]);
  const [date,setDate] = useState(0);
  const [visibility,setVisibility] = useState(false);
  const id= useParams().id;
  
    async function getPotluck() {
      console.log(id);
      if(id){
        setPageDisplay("items");
        setChosenPotluck(id);
    }}

  useEffect(() => {getPotluck(); setUsername(sessionStorage.getItem("username")); }, []);


  const jsx = [<div id='header'><div id='brand'><img id='logo' src={logo}/></div><div id='saying'><h1>Gather</h1><p id='sub-saying'>Food brings us together</p></div><div id='user'><UserHandler className="userHandler" chosenPotluck = {chosenPotluck} setPageDisplay={setPageDisplay} password={password} setPassword = {setPassword} username={username} setUsername={setUsername} loggedIn={loggedIn} setLoggedIn={setLoggedIn} host={host} key="userHandler" /></div></div>];


  if(pageDisplay === "index") {
    jsx.push();
  }
  else if(pageDisplay === "potluckList") {
    jsx.push(<div id='display'><Potlucks date={date} setDate = {setDate} visibility= {visibility} setVisibility={setVisibility} username={username} setChosenPotluck={setChosenPotluck} setChosenPotluckCreator={setChosenPotluckCreator} setPageDisplay={setPageDisplay} host={host} key="potlucks"/></div>)
  }
  else if(pageDisplay === "items") {
    jsx.push(<div id='display'><Items chosenPotluck={chosenPotluck} chosenPotluckCreator={chosenPotluckCreator} setPageDisplay={setPageDisplay} username={username} host={host} key="items" /></div>)
  }
  else if(pageDisplay === "user"){
    jsx.push(<div id='display'><UserCreator chosenPotluck={chosenPotluck} setPageDisplay={setPageDisplay} username={username} setUsername = {setUsername} password = {password} setPassword = {setPassword}   host={host} key="user"  /></div>)
  }
  else if(pageDisplay === "updatePotluck"){
    jsx.push(<div id='display'><UpdatePotluck date={date} setDate={setDate} visibility={visibility} setVisibility={setVisibility} username={username} chosenPotluck={chosenPotluck} setPageDisplay={setPageDisplay} host={host} key="update-potluck"/></div>)
  }

  return(<div className='main'><div id='center'>{jsx}</div></div>);
}

export default App;
