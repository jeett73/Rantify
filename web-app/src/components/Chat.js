
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { useParams, Link } from 'react-router-dom';
import ProductServices from '../services/products';
const ProductServicesObj = new ProductServices();

function Chat({ socket }) {
    let { userId } = useParams();
    const [paramsId, setUserId] = useState(userId);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const chatContainerRef = useRef(null);
    const [chatPersons, setChatPersons] = useState([]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    let loggedUserId = localStorage.getItem("user");
    loggedUserId = JSON.parse(loggedUserId)


    useEffect(() => {
        const fetchChatPersons = async () => {
            const listAllChat = await ProductServicesObj.getChatPersonsList(loggedUserId.user._id);
            setChatPersons(listAllChat);
        };

        fetchChatPersons();
    }, []);

    useEffect(() => {
        if (paramsId === undefined && chatPersons.length > 0) {
            setUserId(chatPersons[0]?._id || undefined);
        }
    }, [chatPersons]);

    useEffect(() => {
        const fetchChats = async () => {
            console.log(JSON.stringify(paramsId,"userIdMAINMIAIHADIHDIH"));
            if (paramsId !== undefined) {
                window.history.pushState({}, '', `/chats/${paramsId}`);
                const listAllChat = await ProductServicesObj.getUserChats(paramsId, loggedUserId.user._id);
                setChats(listAllChat);
            }
        };

        fetchChats();
    }, [paramsId]);



    const [formData, setFormData] = useState({
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "message") {
            if (value.trim()) {
                console.log(value);
            }
        }
    };
    const sendMessage = () => {
        setMessages(prevMessages => [...prevMessages, {
            sent: paramsId,
            message: formData.message
        }])
        socket.emit('sendMessageToUser', { receivedBy: paramsId, sendBy: loggedUserId.user._id, message: formData.message });
        setFormData({
            message: ''
        })
    }

    const getChats = async (id) => {
        window.history.pushState({}, '', `/chats/${id}`);
        const listAllChat = await ProductServicesObj.getUserChats(id, loggedUserId.user._id);
        setChats(listAllChat)
    }
    // Receive messages
    // socket.on('message', (message) => {
    //     console.log('Received message:', message);
    // });

    // Function to handle received messages
    const handleMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, {
            sent: loggedUserId.user._id,
            message: message.message,
            receiverName: message.firstName
        }])
    }
    // Function to scroll to the bottom of the chat container

    // Scroll to bottom on component update whenever new message is added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    useEffect(() => {
        // Listen for incoming messages when component mounts
        socket.on('message', handleMessage);

        // Clean up event listener when component unmounts
        return () => {
            socket.off('message', handleMessage);
        };
    }, []);
    console.log(chatPersons, "chatPersonschatPersons");
    return (
        <>
            <div class="page-wrapper">
                <div class="page-header d-print-none">
                    <div class="container-xl">
                        <div class="row g-2 align-items-center">
                            <div class="col">
                                <h2 class="page-title">
                                    Chat
                                </h2>
                            </div>
                            <div className="col-auto ms-auto d-print-none">
                                <div className="d-flex">
                                    {/* <div className="me-3">
                                        <div className="input-icon">
                                            <input type="text" value="" className="form-control" placeholder="Search…" />
                                            <span className="input-icon-addon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                                            </span>
                                        </div>
                                    </div> */}
                                    <Link to={"/dashboard"} className="btn btn-primary">
                                        Go Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page-body">
                    <div class="container-xl">
                        <div class="card">
                            <div class="row g-0">
                                <div class="col-12 col-lg-5 col-xl-3 border-end">
                                    <div class="card-header d-none d-md-block">
                                        <div class="input-icon">
                                            <span class="input-icon-addon">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                                            </span>
                                            <input type="text" value="" class="form-control" placeholder="Search…" aria-label="Search" />
                                        </div>
                                    </div>
                                    {chatPersons.map((chatPerson) => {
                                        return <div class="card-body p-0 scrollable" style={{ "maxHeight": "35rem" }} onClick={() => getChats(chatPerson._id)}>
                                            <div class="nav flex-column nav-pills" role="tablist">
                                                <a href="#chat-1" class="nav-link text-start mw-100 p-3 active" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="true">
                                                    <div class="row align-items-center flex-fill">
                                                        <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000m.jpg)" }}></span>
                                                        </div>
                                                        <div class="col text-body">
                                                            <div>{chatPerson.userDetails[0].firstName}</div>
                                                            <div class="text-secondary text-truncate w-100">{chatPerson.message.length > 25 ? chatPerson.message.slice(0, 25) + "..." : chatPerson.message}</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    })}
                                </div>
                                <div class="col-12 col-lg-7 col-xl-9 d-flex flex-column">
                                    <div class="card-body scrollable" style={{ "height": "35rem" }} ref={chatContainerRef}>
                                        <div class="chat">
                                            <div class="chat-bubbles">
                                                {chats.map((message) => {
                                                    return <div class="chat-item">
                                                        <div class={message.sendBy == loggedUserId.user._id ? "row align-items-end justify-content-end" : "row align-items-end"}>
                                                            {message.sendBy != loggedUserId.user._id && (
                                                                <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/002m.jpg)" }}></span>
                                                                </div>
                                                            )}
                                                            <div class="col col-lg-6">
                                                                <div class={message.sendBy == loggedUserId.user._id ? "chat-bubble chat-bubble-me" : "chat-bubble"}>
                                                                    <div class="chat-bubble-title">
                                                                        <div class="row">
                                                                            <div class="col chat-bubble-author">{message.sendBy == loggedUserId.user._id ? message.senderName : message.senderName}</div>
                                                                            <div class="col-auto chat-bubble-date">{moment(message.createdOn).format("MMMM DD, hh:mm A")}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="chat-bubble-body">
                                                                        <p>{message.message}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {message.sendBy == loggedUserId.user._id && (
                                                                <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000m.jpg)" }}></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                })}
                                                {messages.map((message) => {
                                                    return <div class="chat-item">
                                                        <div class={message.sent != loggedUserId.user._id ? "row align-items-end justify-content-end" : "row align-items-end"}>
                                                            {message.sent == loggedUserId.user._id && (
                                                                <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/002m.jpg)" }}></span>
                                                                </div>
                                                            )}
                                                            <div class="col col-lg-6">
                                                                <div class={message.sent != loggedUserId.user._id ? "chat-bubble chat-bubble-me" : "chat-bubble"}>
                                                                    <div class="chat-bubble-title">
                                                                        <div class="row">
                                                                            <div class="col chat-bubble-author">{message.sent != loggedUserId.user._id ? loggedUserId.user.firstName : message.receiverName}</div>
                                                                            <div class="col-auto chat-bubble-date">{moment(new Date()).format("MMMM DD, hh:mm A")}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="chat-bubble-body">
                                                                        <p>{message.message}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {message.sent != loggedUserId.user._id && (
                                                                <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000m.jpg)" }}></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                })}
                                                {/* <div class="chat-item">
                                                    <div class="row align-items-end justify-content-end">
                                                        <div class="col col-lg-6">
                                                            <div class="chat-bubble chat-bubble-me">
                                                                <div class="chat-bubble-title">
                                                                    <div class="row">
                                                                        <div class="col chat-bubble-author">Paweł Kuna</div>
                                                                        <div class="col-auto chat-bubble-date">09:32</div>
                                                                    </div>
                                                                </div>
                                                                <div class="chat-bubble-body">
                                                                    <p>Hey guys, I just pushed a new commit on the <code>dev</code> branch. Can you have a look and tell me what you think?</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000m.jpg)" }}></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="chat-item">
                                                    <div class="row align-items-end">
                                                        <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/002m.jpg)" }}></span>
                                                        </div>
                                                        <div class="col col-lg-6">
                                                            <div class="chat-bubble">
                                                                <div class="chat-bubble-title">
                                                                    <div class="row">
                                                                        <div class="col chat-bubble-author">Mallory Hulme</div>
                                                                        <div class="col-auto chat-bubble-date">09:34</div>
                                                                    </div>
                                                                </div>
                                                                <div class="chat-bubble-body">
                                                                    <p>Sure Paweł, let me pull the latest updates.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="input-group input-group-flat">
                                            <input type="text" class="form-control" name="message" value={formData.message} autocomplete="off" onChange={handleChange} placeholder="Type message" />
                                            <span class="input-group-text">
                                                <a href="#" rel="noopener" class="demo-icons-list-item" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="location" data-bs-original-title="location" onClick={sendMessage}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path></svg>
                                                </a>
                                                {/* <a href="#" class="link-secondary" data-bs-toggle="tooltip" aria-label="Clear search" data-bs-original-title="Clear search">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M9 10l.01 0"></path><path d="M15 10l.01 0"></path><path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path></svg>
                                                </a>
                                                <a href="#" class="link-secondary ms-2" data-bs-toggle="tooltip" aria-label="Add notification" data-bs-original-title="Add notification">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path></svg>
                                                </a> */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Chat;