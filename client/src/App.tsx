import React, {useEffect, useState} from 'react';
import {w3cwebsocket as W3CWebSocket} from "websocket";
import 'antd/dist/antd.css'
import {Avatar, Card, Input} from "antd";
import Meta from "antd/es/card/Meta";

const client = new W3CWebSocket('ws://127.0.0.1:8000')
const {Search} = Input
type message = {
    message: string,
    user: string
}

function App() {

    const [UserName, setUserName] = useState('');
    const [textMessage, setTextMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messages, setMessages] = useState<message[]>([]);


    useEffect(() => {
        client.onopen = () => {
            console.log('websocket client connected')
        }
        client.onmessage = (message: any) => {
            const dataFormServer = JSON.parse(message.data);
            console.log('got reply: ', dataFormServer)
            if (dataFormServer.type === 'message') {
                setMessages(prevState => {
                    return [...prevState, {
                        message: dataFormServer.message,
                        user: dataFormServer.user
                    }]
                })
            }
        }
    }, []);

    const sendMessage = (value: string) => {
        client.send(JSON.stringify({
            type: 'message',
            message: value,
            user: UserName
        }))
        setTextMessage('')
    }
    const search = (value: string) => {
        setIsLoggedIn(true)
        setUserName(value)
    }

    return (
        <div className="App">
            {!isLoggedIn ?
                <div style={{padding: '200px 40px'}}>
                    <Search
                        placeholder="Enter Username"
                        enterButton="Login"
                        size="large"
                        onSearch={search}
                    />
                </div>
                :
                <>
                    <div>
                        {messages.map((message, index) =>

                                <Card key={`${message.user}-${message.message}-${index}`} style={{width: "300px", margin: "10px"}}>
                                    <Meta
                                        avatar={<Avatar>{message.user[0].toLocaleUpperCase()}</Avatar>}
                                        title={message.user}
                                        description={message.message}/>
                                </Card>
                            )
                        }
                    </div>
                    <Search
                        style={{position:'absolute',bottom: 0,left:0}}
                        placeholder="Enter message"
                        enterButton="Send"
                        size="large"
                        onSearch={sendMessage}
                        onChange={(e)=>{ setTextMessage(e.target.value) }}
                        value={textMessage}
                    />
                    {/*<button onClick={sendMessage}>send message</button>*/}
                </>

            }
        </div>
    );
}

export default App;
