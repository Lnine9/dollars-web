import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import MsgBubble from "./MsgBubble";
import {MSG_TYPE} from "../constant";
import {Button, message} from "antd";
import {saveMsgHistory} from "../utils";

function ChatContainer({currentChat, socket, currentUser}, ref) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState();

  useImperativeHandle(ref, () => ({
    pushMsg: (msg) => {
      setArrivalMessage(msg)
    },
  }));

  useEffect(() => {
    let history = JSON.parse(localStorage.getItem(currentChat.userId));
    if (!history || !(history instanceof Array)) {
      history = []
    }
    setMessages(history)
  }, [currentChat.userId])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleSendMsg = (val) => {
    if (socket.current.readyState !== WebSocket.OPEN){
      message.warn('与服务器断开连接，请刷新页面')
    }
    const msg = {
      from: currentUser.userId,
      to: currentChat.userId,
      msg: val,
    }
    socket.current.sendMsg(MSG_TYPE.CHAT,msg)
    setMessages((prev) => [...prev, msg])
    saveMsgHistory(currentChat.userId, msg)
  };

  useEffect(() => {
    scrollRef.current?.scrollTo(0,scrollRef.current.scrollHeight)
  },[messages])

  return (
    <Container>
      <header className="chat-header">
        <div className="user-details">
          <div className="username">
            <div>{currentChat?.username || ''}</div>
          </div>
        </div>
      </header>
      <article className="chat-messages" ref={scrollRef}>
        {
          messages.map((item, index) => (
            <MsgBubble className='msg' from={item.from} msg={item.msg} isMe={item.from === currentUser.userId}
                       key={index}/>
          ))
        }
      </article>
      <ChatInput className='chat-input' handleSendMsg={handleSendMsg}/>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .chat-header {
    height: 60px;
    display: flex;
    align-items: end;
    background-color: var(--back);
    padding: 0 20px;
    flex-shrink: 0;
    border-bottom: 2px solid var(--border);
    font-size: 25px;
  }

  .chat-messages {
    flex-shrink: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 10px 20px;
    background: var(--back);
    overflow-y: scroll;
    padding-bottom: 80px;

    &::-webkit-scrollbar {
      width: 0.5rem;

      &-thumb {
        background-color: rgba(140, 140, 140, 0.68);
        border-radius: 1rem;
      }
    }

    .msg {
      width: 100%;
    }
    
    .my-msg {
      .msg-content {
        background-color: var(--c-1);
        color: white;
      }
    }
  }

  .chat-input {
    background: var(--back);
    height: 200px;
    flex-shrink: 0;
  }
`;

export default forwardRef(ChatContainer);
