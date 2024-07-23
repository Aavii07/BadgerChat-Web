
import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function BadgerRegister() {

    const usernameReference = useRef();
    const pinReference = useRef();
    const confirmPinReference = useRef();

    const handleRegisteration = (e) => {
        e.preventDefault(); // prevent reload after attempt

        const username = usernameReference.current.value;
        const pin = pinReference.current.value;
        const confirmPin = confirmPinReference.current.value;

        const pinRegex = /^\d{7}$/; 

        // pre api call checks
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!pinRegex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }

        // api call
        fetch('https://cs571api.cs.wisc.edu/rest/su24/hw6/register', {
            method: "POST",
            credentials: "include",
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                "username": username, 
                "pin": pin 
                // id automatically incremented and set
            })
        })
        .then(res => {
            if (res.status === 409) {
                alert("That username has already been taken!");
                throw new Error("409 Conflict Error");
            }
            return res.json();
        })
        .then(data => {
            alert("Registration successful!");

            // clear input fields
            usernameReference.current.value = '';
            pinReference.current.value = '';
            confirmPinReference.current.value = '';
        })
        .catch(error => {
            console.error("Error:", error);
            if (error.message !== "409 Conflict Error") {
                alert("Something went wrong, please try again.");
            }
        }); 
    };
    

    return (<>
        <h1>Register</h1>

            <Form onSubmit={handleRegisteration} >
                <Form.Group>

                    <Form.Label htmlFor="newUsername" style={{marginTop: "1rem", fontSize: '20px'}}> 
                        Username </Form.Label>
                    <Form.Control
                        type="text"
                        ref={usernameReference}
                        id = "newUsername"
                        placeholder="example: bob jones"
                        style={{ backgroundColor: '#f0f8ff' }} // light blue text field
                    />
                </Form.Group>

                <Form.Group>

                    <Form.Label htmlFor="newPin" style={{marginTop: "1rem", fontSize: '20px'}}>
                        Pin</Form.Label>
                    <Form.Control
                        type="password"
                        ref={pinReference}
                        id = "newPin"
                        placeholder="example: 1234567" 
                        style={{ backgroundColor: '#f0f8ff' }}
                        autoComplete="new-password"
                    />
                </Form.Group>

                <Form.Group>

                    <Form.Label htmlFor="confirmNewPin" style={{marginTop: "1rem", fontSize: '20px'}}>
                        Confirm Pin</Form.Label>
                    <Form.Control
                        type="password"
                        ref={confirmPinReference}
                        id = "confirmNewPin"
                        placeholder="example: 1234567"
                        style={{ backgroundColor: '#f0f8ff' }}
                        autoComplete="new-password"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{marginTop: "2rem"}}>
                    Register
                </Button>
            </Form>
        </>
    );
}
