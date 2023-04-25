import React, {useEffect, useState, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {MSG_TYPE, RESP_CODE, USER_KEY, WS_HOST} from "../constant";
import Menu from "../components/Menu";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import {Input, message, Modal} from "antd";
import setupSocket from "../socket";
import {addFriend, getContacts} from "../api/user";
import {UserOutlined} from "@ant-design/icons";
import Welcome from "../components/Welcome";
import {saveMsgHistory} from "../utils";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const chatContainerRef = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const currentChatRef = useRef(currentChat);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isShowAdd, setShowAdd] = useState(false)
  const inputRef = useRef();

  const getContacts0 =useCallback(() => {
    getContacts(currentUser.userId).then(
      res => {
        if (res.code === 200 && res.data) {
          setContacts(res.data.map(item => ({
            userId: item.id,
            username: item.name,
          })))
        }
      },
      () => {
      }
    )
  },[currentUser])

  useEffect(() => {
    if (!localStorage.getItem(USER_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(localStorage.getItem(USER_KEY))
      );
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser){
      return;
    }
    getContacts0()
  }, [currentUser, getContacts0])

  const changeChat = useCallback((user) => {
    setCurrentChat(user)
    currentChatRef.current = user
  }, [setCurrentChat])

  const onAddFriend = useCallback(() => {
    setShowAdd(true);
  }, [setShowAdd])

  const onAddFriendSubmit = () => {
    if (inputRef.current.input.value!=='')
      addFriend(currentUser.userId, inputRef.current.input.value).then(
        res=>{
          if (res.code === RESP_CODE.SUCCESS){
            message.success('添加好友成功')
            inputRef.current.input.value = ''
            setShowAdd(false)
            getContacts0()
          } else {
            message.error('添加失败')
          }
        },
        () => {}
      )
  }

  useEffect(() => {
    if (currentUser && !socket.current) {
      socket.current = setupSocket(WS_HOST, currentUser.userId)
      socket.current.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        console.log(data)
        switch (data.messageType) {
          case MSG_TYPE.ERROR:
            message.error('通讯错误')
            break
          case MSG_TYPE.CHAT:
            const msg = {
              from: data.from,
              to: data.to,
              msg: data.msg,
            }
            if (data.from === currentChatRef.current.userId) {
              chatContainerRef.current && chatContainerRef.current.pushMsg(msg)
            }
            saveMsgHistory(msg.from, msg)
            break
          case MSG_TYPE.CHAT_SEND_RESP:
            if (!data.success){
              message.info(data.result)
            }
            break
          default:
            break
        }
      }
    }
  }, [currentUser])

  return (
    <Container>
      <div className='container'>
        <div className='left'>
          <Menu user={currentUser}/>
        </div>
        <div className='mid'>
          <Contacts contacts={contacts} changeChat={changeChat} currentUser={currentUser} onAddFriend={onAddFriend} />
        </div>
        <div className='right'>
          {
            currentChat ? (
              <ChatContainer currentChat={currentChat} socket={socket} ref={chatContainerRef} currentUser={currentUser}/>
            ):(
              <Welcome username={currentUser?.username || ''} />
            )
          }
        </div>
      </div>
      <Modal
        visible={isShowAdd}
        onCancel={() => {setShowAdd(false)}}
        onOk={onAddFriendSubmit}
        okText='添加'
        cancelText='取消'
        closable={false}
      >
        <Input ref={inputRef} placeholder='输入好友ID' prefix={<UserOutlined/>} />
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  .container {
    height: 720px;
    width: 1360px;
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 8px 12px 40px #008C8C90;
  }

  .left {
    width: 66px;
  }

  .mid {
    width: 240px;
  }

  .right {
    flex: 1;
  }
`;
