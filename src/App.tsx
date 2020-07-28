import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Layout from "./components/layout/Index";
import Index from './pages/index/Index'
import MenuList from './pages/setting/MenuList'
import TagList from './pages/setting/TagList'
import PostList from './pages/content/PostList'
import AppList from './pages/content/AppList'
import ReadList from './pages/content/ReadList'
import StoreList from './pages/content/StoreList'

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/index" component={Index} />
            <Route exact path="/setting/tagList" component={TagList} />
            <Route exact path="/setting/menuList" component={MenuList} />

            <Route exact path="/content/appList" component={AppList} />
            <Route exact path="/content/readList" component={ReadList} />
            <Route exact path="/content/postList" component={PostList} />
            <Route exact path="/content/storeList" component={StoreList} />

            <Redirect from="/" to="/index"/>
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
