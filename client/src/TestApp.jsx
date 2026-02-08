import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function TestApp() {
  return (
    <Router>
      <div>
        <h1>Test App</h1>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/user/profile" element={<div>Profile Works!</div>} />
          <Route path="/test" element={<div>Test Route Works!</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default TestApp;