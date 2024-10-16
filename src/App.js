import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Component from './Component';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Component} />
        <Route path="/admin" component={AdminDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
