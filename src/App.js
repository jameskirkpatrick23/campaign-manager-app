import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/navbar';
import LoginSignup from './pages/login-signup/login-signup';
import { Route } from 'react-router-dom';
import routes from './routes';
import Splash from './pages/splash/index';

class App extends Component {
  render() {
    return (
      <div className="App">{routes.map(route => <Route {...route} />)}</div>
    );
  }
}

export default App;
