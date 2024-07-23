import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import crest from '../../assets/uw-crest.svg';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {
    const storedLoginStatus = JSON.parse(sessionStorage.getItem("loginStatus"));
    const [loginStatus, setLoginStatus] = useState(storedLoginStatus || false);

    const handleLogout = () => {
        setLoginStatus(false);
        sessionStorage.removeItem("loginStatus");
        alert("You have been logged out!");
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            {!loginStatus ? (
                                <>
                                    <Nav.Link as={Link} to="login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="register">Register</Nav.Link>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="logout" onClick={handleLogout}>
                                    Logout
                                </Nav.Link>
                            )}
                            <NavDropdown title="Chatrooms">
                                {props.chatrooms.map(chatroom => (
                                    <NavDropdown.Item key={chatroom} as={Link} to={`/chatrooms/${chatroom}`}>
                                        {chatroom}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;
