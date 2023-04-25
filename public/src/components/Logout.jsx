import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {DisconnectOutlined} from "@ant-design/icons";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("确定登出吗？ （本地消息记录将会清空！）")){
      Object.entries(localStorage).map(
        x => x[0]
      ).filter(
        x => x.substring(0,1)!=="F"
      ).map(
        x => localStorage.removeItem(x))
      navigate("/login")
    }
  };
  return (
    <Button onClick={handleClick}>
      <DisconnectOutlined size='large' style={{color: "white"}} />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f52866;
  border: none;
  cursor: pointer;
  
`;
