import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './Chat';
import Main from './Main';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/chat" element={<Chat />}></Route>
    </Routes>
  );
};

export default AppRoutes;
