import React, { useState } from "react";
import Header from "./Header";
import LeftMenu from "./LeftMenu";

interface LayoutProps {
  children: React.ReactElement;
}

export default (props: LayoutProps) => {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <LeftMenu collapsed={collapsed}></LeftMenu>
      <Header collapsed={collapsed} setCollapsed={setCollapsed}></Header>
      <div
        className={`transform duration-300 absolute p-6 top-12 bottom-0 right-0 ${
          collapsed ? "left-20" : "left-56"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
