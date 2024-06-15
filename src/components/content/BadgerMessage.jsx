import React from "react"
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {

    const date = new Date(props.created);

    const handleDelete = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?id=${props.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                props.loadMessages()
            } else {
                alert("Error, post could not be deleted");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    };

    return <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
        <h2>{props.title}</h2>
        <sub>Posted on {date.toLocaleDateString()} at {date.toLocaleTimeString()}</sub>
        <br/>
        <i style={{marginTop: "1rem"}}>{props.poster}</i>
        <p>{props.content}</p>
        {props.personalPost && (
            <Button variant="danger" onClick={handleDelete}> Delete </Button>
        )}
    </Card>
}

export default BadgerMessage;