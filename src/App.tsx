import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Layout from "./components/layout/Index";
import Index from './pages/index/Index'
import MenuList from './pages/setting/MenuList'
import TagList from './pages/setting/TagList'
import LinkList from './pages/setting/LinkList'
import MainPic from './pages/setting/Pic'

import PostList from './pages/content/post/List'
import PostAdd from './pages/content/post/Add'
import AppList from './pages/content/AppList'
import BookList from './pages/content/BookList'
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
            <Route exact path="/setting/linkList" component={LinkList} />
            <Route exact path="/setting/mainPic" component={MainPic} />

            <Route exact path="/content/appList" component={AppList} />
            <Route exact path="/content/bookList" component={BookList} />
            <Route exact path="/content/post/list" component={PostList} />
            <Route exact path="/content/post/add" component={PostAdd} />
            <Route exact path="/content/post/:id" component={PostAdd} />
            <Route exact path="/content/storeList" component={StoreList} />

            <Redirect from="/" to="/index"/>
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
