import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

interface LeftMenuProps {
  collapsed: boolean;
}

export default (props: LeftMenuProps) => {
  const { SubMenu } = Menu;
  const { collapsed } = props;

  return (
    <Menu
      defaultSelectedKeys={["1"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      className={`h-full fixed left-0 top-0 bottom-0 ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      <Menu.Item key="1">
        <Link to="/">控制台</Link>
      </Menu.Item>
      <SubMenu key="2" title="配置管理">
        <Menu.Item key="2-1">
          <Link to="/setting/mainPic">首页图片</Link>
        </Menu.Item>
        <Menu.Item key="2-2">
          <Link to="/setting/menuList">菜单列表</Link>
        </Menu.Item>
        <Menu.Item key="2-3">
          <Link to="/setting/tagList">标签列表</Link>
        </Menu.Item>
        <Menu.Item key="2-4">
          <Link to="/setting/linkList">友链列表</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="3" title="内容管理">
        <Menu.Item key="3-1">
          <Link to="/content/postList">文章列表</Link>
        </Menu.Item>
        <Menu.Item key="3-2">
          <Link to="/content/bookList">阅读列表</Link>
        </Menu.Item>
        <Menu.Item key="3-3">
          <Link to="/content/appList">应用列表</Link>
        </Menu.Item>
        <Menu.Item key="3-4">
          <Link to="/content/storeList">收藏列表</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
}
