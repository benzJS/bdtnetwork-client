import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import routes from './routes';

import Header from './layouts/Header';
import Body from './layouts/Body';
import Home from './views/Home';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  state = {
    greeting: 'Hello World!'
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Body>
              <Route path='/' exact component={Home} />
              {
                routes.map(view => <Route key={view.path} path={view.path} component={view.component} />)
              }
            </Body>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
