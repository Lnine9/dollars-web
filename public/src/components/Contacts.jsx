import React, {useState} from "react";
import styled from "styled-components";
import Avatar from "./Avatar";
import {UserAddOutlined} from "@ant-design/icons";

export default function Contacts({contacts, changeChat, onAddFriend}) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Container>
      <div className="brand">
        <button className='add' onClick={onAddFriend} >
          <UserAddOutlined />
        </button>
      </div>
      <div className="contacts">
        {contacts.map((contact, index) => {
          return (
            <div
              key={contact.userId}
              className={`contact ${
                index === currentSelected ? "selected" : ""
              }`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <Avatar username={contact.username} className='avatar' size={40} />
              <div className="username">
                <h3>{contact.username}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--back2);
  border: 1px solid var(--border);

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-bottom: 1px solid var(--border);

    .add {
      height: 35px;
      line-height: 35px;
      width: 65px;
      border-radius: 4px;
      font-size: 25px;
      border: none;
      cursor: pointer;
      background-color: #ffb82e;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    overflow-y: scroll;
    flex: 1;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: rgba(210, 210, 210, 0.68);
        border-radius: 1rem;
      }
    }

    .contact {
      height: 3.5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 6px;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      border-top: 1px solid var(--border);
      border-left: 1px solid var(--border);
      box-shadow: 5px 5px 10px #d0d0d0;
    }

    .selected {
      background-color: var(--mars);

      .username h3 {
        color: white;
      }
    }
  }

`;
