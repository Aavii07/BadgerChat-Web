import React, { useEffect, useState } from "react"
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from './BadgerMessage';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedPosts, setDisplayedPosts] = useState([]);

    const totalPages = [1, 2, 3, 4]; // can be hardcoded

    const storedLoginStatus = JSON.parse(sessionStorage.getItem("loginStatus"));
    const [loginStatus, setLoginStatus] = useState(storedLoginStatus || false)

    let poster = null;


    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)

            const startIndex = (currentPage - 1) * 25;
            const endIndex = currentPage * 25;
            setDisplayedPosts(messages.slice(startIndex, endIndex));
        })
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();

        const title = e.target.elements.title.value;
        const content = e.target.elements.contents.value;

        // pre api check
        if (!title || !content) {
            alert("You must provide both a title and content!");
            return;
        }

        // api call
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': CS571.getBadgerId()
            },
            body: JSON.stringify({ 
                "title": title,
                "content": content,
                "chatroom": props.name })
        })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Error, message could not be posted");
                return Promise.reject("cannot post message"); // skip .then and go to catch
            }
        })
        .then(json => {
            alert("Successfully posted!");
            loadMessages();
        })
        .catch(error => {
            console.error("Error:", error);
        })
    }

    // reload messages during chatroom or page change
    useEffect(() => {
        loadMessages();
    }, [props.name, currentPage]);

    // update posts when messages change
    useEffect(() => {
        const startIndex = (currentPage - 1) * 25;
        const endIndex = currentPage * 25;
        setDisplayedPosts(messages.slice(startIndex, endIndex));
        loadMessages();
    }, [messages, currentPage]);

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);

    return <>
        <h1>{props.name} Chatroom</h1>
            {loginStatus ? ( 
                <Form onSubmit={handlePostSubmit}> 
                    <Form.Group controlId="title"> {/* controlId needs to be in Form.Group to reference */}
                        <Form.Label> Title </Form.Label>
                        <Form.Control type="text" placeholder="Enter title"/>
                    </Form.Group> 
                    <Form.Group controlId="contents"> 
                        <Form.Label> Content </Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter content"/>
                    </Form.Group>
                    <Button variant="primary" type="submit"> Create Post </Button>
                </Form>
            ) : (
                <Form>
                    You must be logged in to create a new post
                </Form>
            )}
        <hr/>
        {
            displayedPosts.length > 0 ?
                <>
                    {
                        <Container>
                            <Row> {
                                displayedPosts.map((post) => (   
                                    <Col key={post.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                                        <BadgerMessage {...post} 
                                            personalPost={true}
                                            loadMessages={loadMessages} // allows delete function in badgerMessage to reload messages
                                        />
                                    </Col>
                                    )) }
                            </Row>
                        </Container>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination className = "justify-content-center" 
            style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
            {totalPages.map(pageNumber => (
                <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                </Pagination.Item>
            ))}
        </Pagination>
    </>
}
