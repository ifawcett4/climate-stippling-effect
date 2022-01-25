import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './stylesheets/Styleguide.scss';

import Intro from './components/Intro'
import Camera from './components/Camera'
import Results from "./components/Results";
import Share from "./components/Share";
import Filter from "./components/Filter"
import QRcode from "./components/QRcode"


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Intro/>} />
          <Route path="/camera" element={<Camera/>} />
          <Route path="/results" element={<Results/>} />
          <Route path="/share" element={<Share/>} />
          <Route path="/filter" element={<Filter/>} />
          <Route path="/qr" element={<QRcode/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
