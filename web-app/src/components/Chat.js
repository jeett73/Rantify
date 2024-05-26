
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { useParams, Link } from 'react-router-dom';
import ProductServices from '../services/products';
const ProductServicesObj = new ProductServices();

function Chat({ socket }) {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    scrollToBottom();
    useEffect(() => {
        listAllChats();
    }, [])
    let loggedUserId = localStorage.getItem("user");
    loggedUserId = JSON.parse(loggedUserId)

    const listAllChats = async () => {
        const listAllChat = await ProductServicesObj.getUserChats(userId, loggedUserId.user._id);
        console.log(listAllChat);
        setChats(listAllChat)
    }

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
            sent: userId,
            message: formData.message
        }])
        socket.emit('sendMessageToUser', { receivedBy: userId, sendBy: loggedUserId.user._id, message: formData.message });
        setFormData({
            message: ''
        })
    }

    // Receive messages
    // socket.on('message', (message) => {
    //     console.log('Received message:', message);
    // });

    // Function to handle received messages
    const handleMessage = (message) => {
        console.log('Received message:', message);
        setMessages(prevMessages => [...prevMessages, {
            sent: loggedUserId.user._id,
            message: message
        }])
    }
    // Function to scroll to the bottom of the chat container

    // Scroll to bottom on component update whenever new message is added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Listen for incoming messages when component mounts
        socket.on('message', handleMessage);

        // Clean up event listener when component unmounts
        return () => {
            socket.off('message', handleMessage);
        };
    }, []);
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
                                    <div class="card-body p-0 scrollable" style={{ "maxHeight": "35rem" }}>
                                        <div class="nav flex-column nav-pills" role="tablist">
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3 active" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="true">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000m.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Paweł Kuna</div>
                                                        <div class="text-secondary text-truncate w-100">Sure Paweł, let me pull the latest updates.</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar">JL</span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Jeffie Lewzey</div>
                                                        <div class="text-secondary text-truncate w-100">I'm on it too 👊</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/002m.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Mallory Hulme</div>
                                                        <div class="text-secondary text-truncate w-100">I see you've refactored the <code>calculateStatistics</code> function. The code is much cleaner now.</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/003m.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Dunn Slane</div>
                                                        <div class="text-secondary text-truncate w-100">Yes, I thought it was getting a bit cluttered.</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/000f.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Emmy Levet</div>
                                                        <div class="text-secondary text-truncate w-100">The commit message is descriptive, too. Good job on mentioning the issue number it fixes.</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/001f.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Maryjo Lebarree</div>
                                                        <div class="text-secondary text-truncate w-100">I noticed you added some new dependencies in the <code>package.json</code>. Did you also update the <code>README</code> with the setup instructions?</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar">EP</span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Egan Poetz</div>
                                                        <div class="text-secondary text-truncate w-100">Oops, I forgot. I'll add that right away.</div>
                                                    </div>
                                                    <div class="col-auto">🌴</div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/002f.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Kellie Skingley</div>
                                                        <div class="text-secondary text-truncate w-100">I see a couple of edge cases we might not be handling in the <code>calculateStatistic</code> function. Should I open an issue for that?</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar" style={{ "backgroundImage": "url(./static/avatars/003f.jpg)" }}></span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Christabel Charlwood</div>
                                                        <div class="text-secondary text-truncate w-100">Yes, Bob. Please do. We should not forget to handle those.</div>
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#chat-1" class="nav-link text-start mw-100 p-3" id="chat-1-tab" data-bs-toggle="pill" role="tab" aria-selected="false" tabindex="-1">
                                                <div class="row align-items-center flex-fill">
                                                    <div class="col-auto"><span class="avatar">HS</span>
                                                    </div>
                                                    <div class="col text-body">
                                                        <div>Haskel Shelper</div>
                                                        <div class="text-secondary text-truncate w-100">Alright, once the <code>README</code> is updated, I'll merge this commit into the main branch. Nice work, Paweł.</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
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
                                                                            <div class="col chat-bubble-author">{loggedUserId.user.firstName}</div>
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
                <footer class="footer footer-transparent d-print-none">
                    <div class="container-xl">
                        <div class="row text-center align-items-center flex-row-reverse">
                            <div class="col-lg-auto ms-lg-auto">
                                <ul class="list-inline list-inline-dots mb-0">
                                    <li class="list-inline-item"><a href="https://tabler.io/docs" target="_blank" class="link-secondary" rel="noopener">Documentation</a></li>
                                    <li class="list-inline-item"><a href="./license.html" class="link-secondary">License</a></li>
                                    <li class="list-inline-item"><a href="https://github.com/tabler/tabler" target="_blank" class="link-secondary" rel="noopener">Source code</a></li>
                                    <li class="list-inline-item">
                                        <a href="https://github.com/sponsors/codecalm" target="_blank" class="link-secondary" rel="noopener">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-pink icon-filled icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                                            Sponsor
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-12 col-lg-auto mt-3 mt-lg-0">
                                <ul class="list-inline list-inline-dots mb-0">
                                    <li class="list-inline-item">
                                        Copyright © 2023
                                        <a href="." class="link-secondary">Tabler</a>.
                                        All rights reserved.
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="./changelog.html" class="link-secondary" rel="noopener">
                                            v1.0.0-beta20
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
export default Chat;