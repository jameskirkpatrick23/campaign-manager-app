import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import routes from './routes';

class App extends Component {
  render() {
    return (
      <div className="App">{routes.map(route => <Route {...route} />)}</div>
    );
  }
}

export default App;
