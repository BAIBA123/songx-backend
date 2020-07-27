import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Layout from "./components/layout/Index";
import Index from './pages/index/Index'
import Post from './pages/post/Index'
import Read from './pages/read/Index'

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/index" component={Index} />
            <Route exact path="/post/list" component={Post} />
            <Route exact path="/read/list" component={Read} />
            <Redirect from="/" to="/index"/>
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
