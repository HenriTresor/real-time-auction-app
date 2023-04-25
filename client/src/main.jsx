import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContext from './context/AuthContext.jsx'
import AppContext from './context/AppContext.jsx'
import '@fontsource/roboto/500.css';
import { BrowserRouter as Router} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AppContext>
        <AuthContext>
          <App />
        </AuthContext>
     </AppContext>
    </Router>
  </React.StrictMode>,
)
