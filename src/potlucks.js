import './App.css';
import { useEffect, useState, useSyncExternalStore } from 'react';


export default function Potlucks(props) {
    const host = props.host;
    const username = props.username;
    const setChosenPotluck = props.setChosenPotluck;
    const setChosenPotluckCreator = props.setChosenPotluckCreator;
    const setPageDisplay = props.setPageDisplay;
    const setDate = props.setDate;
    const date = props.date;
    const setVisibility = props.setVisibility;
    const visibility = props.visibility;
    const [potluckList, setPotluckList] = useState([]);
    const [publicPotlucks, setPublicPotlucks]=useState([]);
    const jsx = [];
    let ListElement2;

    function goToPotluck(potluck) {
        setChosenPotluck(potluck.id);
        setChosenPotluckCreator(potluck.creatorId);
        setPageDisplay("items");
    }
    function changePotluck(potluck) {
        setChosenPotluck(potluck.id);
        setPageDisplay("updatePotluck")
    }
  
    function generateLink(potluck){    
        return 'https://main.d3pbgde6ddw94g.amplifyapp.com/'+ potluck.id;
    }


    const ListElement = potluckList.map((n) => (
        <tr key={n.id}>
            <td><button onClick={() => goToPotluck(n)}>View</button><button onClick={() => changePotluck(n)}>Change</button><button onClick={() => deletePotluck(n)}>Delete</button></td>
            <td>{generateLink(n)}</td>
            <td>{new Date(n.dateTime).toDateString()}</td>
            <td>{new Date(n.dateTime).toLocaleTimeString()}</td>
            <td>{n.visibility?"public":"private"}</td>
    </tr>));
if(sessionStorage.getItem("auth")){
    ListElement2 = publicPotlucks.filter(n=>n.creatorId!=username).map((n) => (
    
        <tr key={n.id}>        
            <td><button onClick={() => goToPotluck(n)}>View</button></td>
            <td>{new Date(n.dateTime).toDateString()}</td>
            <td>{new Date(n.dateTime).toLocaleTimeString()}</td>
            <td>{n.creatorId}</td>
        </tr>));
}
else{

ListElement2 = publicPotlucks.map((n) => (
    
    <tr key={n.id}>        
        <td><button onClick={() => goToPotluck(n)}>View</button></td>
        <td>{new Date(n.dateTime).toDateString()}</td>
        <td>{new Date(n.dateTime).toLocaleTimeString()}</td>
        <td>{n.creatorId}</td>
    </tr>));
}
    
    async function getPotlucks() {
        const name = sessionStorage.getItem("username");
        if(name) {
            const req = await fetch(host+"/users/"+name+"/potlucks");
            const body = await req.json();
            setPotluckList([...body]);
        }
    }

    async function getPublicPotlucks(){
        const req = await fetch(`${host}/potlucks/`);
        const body = await req.json();
        setPublicPotlucks([...body]);
    }

    async function createPotluck() {
        const potluck = {id:'blah', dateTime:date, creatorId:username, visibility:Boolean(visibility)};

        const response = await fetch(host + "/potlucks",{
            body:JSON.stringify(potluck),
            method:"POST",
            headers:{
              //  "Authorization":`${session.authorization}`,
                "Content-Type":"application/json"
            }     
        });
        const body = await response.arrayBuffer();
        const string = new TextDecoder().decode(body);
        if(response.status === 200){
            //const body = await response.json();
          alert(`New potluck registered.`)

            getPotlucks();
            getPublicPotlucks();
        }else{
            alert(string);
        }
    }

    async function deletePotluck(potluck) {
        console.log(potluck.id);
        const response = await fetch(host + "/potlucks/" + potluck.id,{
            method:"DELETE",
            headers:{
              //  "Authorization":`${session.authorization}`,
                "Content-type":"application/json"
            }     
        });
        //const body = await response.json();
        getPotlucks();
        getPublicPotlucks();
    }

    useEffect(() => { getPotlucks(); getPublicPotlucks();}, []);

    if(sessionStorage.getItem("auth")) {
        jsx.push(<>
            <label htmlFor='private'>Your Potlucks</label>
            <table id='private'>
                <thead>
                    <tr>
                    <th></th><th>Link</th><th>Date</th><th>Time</th><th>Public/Private</th>
                    </tr>
                    {ListElement}
                </thead>
            </table><br/><br/></>
        )
    }

    jsx.push(<>
        
        <label htmlFor='public'>Public Potlucks</label>
        <table id='public'>
            <thead>
                <tr>
                    <th></th><th>Date</th><th>Time</th><th>Creator</th>
                </tr>
                {ListElement2}
            </thead>
        </table>
        <button onClick={() => {getPotlucks();getPublicPotlucks()}}>refresh list</button></>);

        if(sessionStorage.getItem("auth")) {
            jsx.push(<form>
                <fieldset id='createPotluck'>
            <legend htmlFor='createPotluck'>Create New Potluck</legend>
                Start time:&nbsp;
                <input required onChange={(e) => setDate(new Date(e.target.value).getTime())}type={"dateTime-local"} />{' '}
                Public
                <input onClick={(e) => setVisibility(e.target.checked)} type="checkbox" />
            
            {' '}<button onClick={(e) => {e.preventDefault(); createPotluck() }}>Create</button></fieldset></form>)
        }
    return(<>{jsx}</>);
}