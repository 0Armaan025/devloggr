import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App.jsx'
import SignUpPage from './page/sign-up/SignUpPage.jsx';
import LoginPage from './page/log-in/LogInComponent.jsx';
import DashboardPage from './page/dashboard/DashboardPage.jsx';
import ProjectPage from './page/project/ProjectPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/project/:name" element={<ProjectPage />} />
      </Routes>
    </Router>
  </StrictMode>,
  document.getElementById('root')

)
