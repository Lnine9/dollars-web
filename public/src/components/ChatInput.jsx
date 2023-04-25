import React, {useState} from "react";
import styled from "styled-components";
import TextArea from "antd/es/input/TextArea";
import {FileImageOutlined} from "@ant-design/icons";
import {message} from "antd";
import Upload from "antd/es/upload/Upload";
import {getBase64} from "../utils";

export default function ChatInput({ handleSendMsg, className }) {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event?.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const uploadProps = {
    customRequest: async ({file}) => {
      const isImg = file.type === 'image/png';

      if (!isImg) {
        message.error(`${file.name} 不是png类型`);
        return
      }

      const base64 = await getBase64(file);

      handleSendMsg(base64);
    },
  };

  return (
    <Container className={className}>
      <div className="tool-bar">
        <Upload className='button' {...uploadProps} showUploadList={false}>
          <FileImageOutlined/>
        </Upload>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <TextArea
          bordered={false}
          className='input'
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          onPressEnter={(event) => {
            if (event.ctrlKey){
              setMsg(prevState => prevState+'\n')
            } else {
              event.preventDefault()
              sendChat()
            }
          }}
        />
        <button type="submit">
          Send
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;

  .tool-bar {
    width: 100%;
    padding: 4px 10px;
    box-shadow: 0 3px 12px #d3d3d3;

    .button {
      width: 1.5rem;
      height: 1.5rem;
      color: #656565;
      border: none;
      background: none;
      cursor: pointer;
    }
  }

  .input-container {
    width: 100%;
    flex: 1;
    position: relative;
    background-color: #ffffff34;

    .input {
      width: 100%;
      height: 75% !important;
      background-color: transparent;
      padding: 0.2rem 1rem;
      margin-bottom: 2rem;
      font-size: 1.1rem;
      resize: none;

      &:focus {
        outline: none;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    button {
      padding: 0.3rem 1.2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--mars);
      border: none;
      position: absolute;
      bottom: 3px;
      right: 5px;
      color: white;
      font-size: 17px;
      cursor: pointer;
    }
  }
`;
