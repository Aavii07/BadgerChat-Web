import React, { useEffect, useState } from "react"
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from './BadgerMessage';

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = [1, 2, 3, 4]; // can be hardcoded

    const storedLoginStatus = JSON.parse(sessionStorage.getItem("loginStatus"));
    const [loginStatus] = useState(storedLoginStatus || false);
    const loggedInUsername = sessionStorage.getItem("username");

    const loadMessages = (pageNumber) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?chatroom=${props.name}&page=${pageNumber}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages);
        });
    };

    // reload messages for chatroom or page change
    useEffect(() => {
        loadMessages(currentPage);
    }, [currentPage, props]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        console.log(messages);
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();

        const title = e.target.elements.postTitle.value;
        const content = e.target.elements.postContents.value;

        // pre API check
        if (!title || !content) {
            alert("You must provide both a title and content!");
            return;
        }

        // API call
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
                alert("Successfully posted!");
                loadMessages(currentPage);
            } else {
                alert("Error, message could not be posted. Be careful not to make the title or contents extremely massive.");
                return ("cannot post message");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    };

    return <>
        <h1>{props.name} Chatroom</h1>
            {loginStatus ? ( 
                <Form onSubmit={handlePostSubmit}> 
                    <Form.Group > 
                        <Form.Label htmlFor="postTitle"> Title </Form.Label>
                        <Form.Control type="text" id = "postTitle" placeholder="Enter title"/>
                    </Form.Group> 
                    <Form.Group > 
                        <Form.Label htmlFor="postContents"> Content </Form.Label>
                        <Form.Control as="textarea" rows={3} id = "postContents" placeholder="Enter content"/>
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
            messages.length > 0 ?
                <>
                    {
                        <Container>
                            <Row> {
                                messages.map((post) => (   
                                    <Col key={post.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                                        <BadgerMessage {...post} 
                                            loggedInUsername={loggedInUsername} // used to check if you made the post
                                            loadMessages={() => loadMessages(currentPage)} // allows delete function in badgerMessage to reload messages
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
            style={{ marginTop: "1rem"}}>
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
