import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import {ConfigProvider} from "antd";

export default function App() {

  ConfigProvider.config({
    theme:{
      primaryColor: '#008C8C'
    }
  })

  return (
    <ConfigProvider prefixCls=''>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
