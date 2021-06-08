import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
      NavLink,
    Link
} from 'react-router-dom';
import Logo from './logo.svg';
import UploadForm from './components/UploadForm';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import Upload from './pages/Upload';

function App() {
  return (
    <>
      <Router>
        <div id="nav">
          <Link className="hover" to="/">
            <img id="navImage" src={Logo} alt={'Logo'} height='100%' width='auto'/>
          </Link>
          
          <div id="navLinkContainer">
            <NavLink className="navLink" to="/upload">Upload</NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/">
            <LandingPage/>
          </Route>
          <Route path="/upload/">
              <Upload />
          </Route>
          
        </Switch>   
      </Router>
    </>
  )
}

export default App