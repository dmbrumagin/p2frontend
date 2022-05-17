import './App.css'
import {useEffect, useState} from 'react'

export default function Items(props) {
    const chosenPotluck = props.chosenPotluck;
    const chosenPotluckCreator = props.chosenPotluckCreator;
    const setPageDisplay= props.setPageDisplay;
    const host = props.host;
    const username = props.username;
    const [itemList, setItemList] = useState([]);
    const [guestName, setGuestName] = useState("");

    const [description,setDescription] = useState("");
    const [status,setStatus] = useState("");

    const jsx = [];

    useEffect(() => {getItems();}, []);

    async function getItems() {
        const req = await fetch(host + "/potlucks/" + chosenPotluck + "/items");
        const body = await req.json();
        setItemList(body);
    }

    async function createItem() {
        if(description !== "" && status !== "") {
            const item = {'description':description,'status':status,'potluckId':chosenPotluck}
            if(status === "FULFILLED") {
                if(sessionStorage.getItem("auth"))
                    item.supplier = sessionStorage.getItem("username");
                else
                    if(!guestName)
                        return null;
                    item.supplier = guestName;
            }

            const req = await fetch(host + "/potlucks/" + chosenPotluck + "/items",
                { 
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(item)
                });
            const body = await req.json();
            getItems();
        }
        else {
            alert(`Please fill in a description and status for the new item.`)
        }
    }

    async function fulfill(item) {
        if(sessionStorage.getItem("auth"))
            item.supplier = username;
        else if(guestName !== "") {
            item.supplier = guestName;
        } else {
            alert("Please enter a name or log in to claim an item.");
            return null;
        }

        const req = await fetch(host + "/potlucks/" + chosenPotluck + "/items",
            { 
                method: "PATCH",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(
                    {
                        id: item.id,
                        description: item.description,
                        potluckId: chosenPotluck,
                        status : "fulfilled",
                        supplier: item.supplier
                }),
            });
        const body = await req.json();
        getItems();
    }

    async function deleteItem(item) {
        console.log(item);
        const req = await fetch(host + "/potlucks/" + chosenPotluck + "/items",
            { 
                method: "DELETE",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(item),
            });
        const body = await req.json();
        getItems();
    }
    let listElement = {};

    if(sessionStorage.getItem("auth") && sessionStorage.getItem("username") == chosenPotluckCreator) {
        listElement = itemList.filter(n => n.status !== "fulfilled").map((n) => (
        <tr key={n.id}>
            <td>{n.description}</td>
            <td>{n.status.toString()}</td>
            <td><button onClick={() => fulfill(n)}>Claim</button></td>
            <td><button onClick={() => deleteItem(n)}>Delete</button></td>
        </tr>))
        .concat(itemList.filter(n => n.status === "fulfilled").map((n) => 
                <tr key={n.id}>
                    <td>{n.description}</td>
                    <td>{n.status.toString()}</td>
                    <td>{n.supplier}</td>
                    <td><button onClick={() => deleteItem(n)}>Delete</button></td>
                </tr>));
    }
    else {
        listElement = itemList.filter(n => n.status !== "fulfilled").map((n) => (
            <tr key={n.id}>
                <td>{n.description}</td>
                <td>{n.status.toString()}</td>
                <td><button onClick={() => fulfill(n)}>Claim</button></td>
            </tr>))
            .concat(itemList.filter(n => n.status === "fulfilled").map((n) => 
                    <tr key={n.id}>
                        <td>{n.description}</td>
                        <td>{n.status.toString()}</td>
                        <td>{n.supplier}</td>
                    </tr>));
    }

    jsx.push(
        <table key="table">
            <thead>
                <tr>
                    <th>Description</th><th>Status</th><th>Supplier</th><th></th>
                </tr>
                {listElement}
            </thead>
        </table>);
    
    if(!sessionStorage.getItem("auth"))
        jsx.push(<input name="name" type="text" placeholder="input name to claim" onChange={(e) => setGuestName(e.target.value)} key="nameinput"/>)
     else
        jsx.push(
            <form>
                <fieldset id='createItem'>
                    <legend htmlFor='createItem'>Create New Item</legend>
                Description:&nbsp;
                <input required onChange={(e) => setDescription(e.target.value)}type="text" />{' '}
                Status:&nbsp;
                <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Pick One</option>
                    <option value="needed">Needed</option>
                    <option value="wanted">Wanted</option>
                    <option value="fulfilled">Fulfilled</option>
                </select>
            
            {' '}<button onClick={(e) => {e.preventDefault(); createItem() }}>Create</button>
                </fieldset>
            </form>
        )

    jsx.push(<button onClick={() => setPageDisplay('potluckList')}>View Potlucks</button>);

    return(<>{jsx}</>);
}