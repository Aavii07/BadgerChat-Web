import React, { useRef, useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { useNavigate } from 'react-router-dom';

export default function BadgerLogin() {

    const navigate = useNavigate();

    const usernameReference = useRef();
    const pinReference = useRef();

    const pinRegex = /^\d{7}$/; 

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleLogin = (e) => {
        e.preventDefault();

        const username = usernameReference.current.value;
        const pin = pinReference.current.value;

        // pre api checks
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!pinRegex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        // api call
        fetch('https://cs571api.cs.wisc.edu/rest/su24/hw6/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username, 
                "pin": pin 
            })
        })
        .then(res => {
            // post api check
            if (res.status === 401) {
                alert('Incorrect username or pin!');
            }
            else{
                setLoginStatus(true);
                sessionStorage.setItem("loginStatus", JSON.stringify(true));
                sessionStorage.setItem("username", username);
                alert('Login successful!');
                navigate('/');
            }
            
        })
        .catch(error => {
            console.error("Error:", error);
            if (error.message !== 'Incorrect username or pin!') {
                alert("Login failed, please try again.");
            }
        });
    };

    return <>
        <h1>Login</h1>

        <Form onSubmit={handleLogin}>

                <Form.Group style={{marginTop: "1rem", fontSize: '20px'}}>
                    <Form.Label htmlFor="usernameInput"> Username </Form.Label>
                    <Form.Control 
                        type="text" 
                        id="usernameInput"
                        ref={usernameReference} 
                        placeholder="enter username"
                        style={{ backgroundColor: '#f0f8ff' }}
                    />
                </Form.Group>

                <Form.Group style={{marginTop: "1rem", fontSize: '20px'}}>
                    <Form.Label htmlFor="pinInput"> Pin </Form.Label>
                    <Form.Control 
                        type="password" 
                        ref={pinReference}
                        id="pinInput"
                        placeholder="enter 7 digit pin" 
                        style={{ backgroundColor: '#f0f8ff' }}
                        autoComplete="new-password"
                    />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit" 
                    style={{marginTop: "2rem"}} >
                    Login
                </Button>
            </Form>
    </>
}
