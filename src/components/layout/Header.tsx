import React from 'react';
import {Button} from 'antd'

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: Function;
}

export default function Header(props: HeaderProps) {
  const {setCollapsed, collapsed} = props

  return (
    <div className={`flex items-center px-6 h-12 bg-white shadow absolute top-0 right-0 transform duration-300 ${collapsed ? 'left-20' : 'left-56'}`}>
      <Button onClick={() => setCollapsed(!collapsed)} type="primary" >
        {collapsed ? '展开' : '关闭'}
      </Button>
    </div>
  )
}