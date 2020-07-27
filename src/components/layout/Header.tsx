import React from 'react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: Function;
}

export default function Header(props: HeaderProps) {
  const {setCollapsed, collapsed} = props

  return (
    <div className={`flex items-center px-6 h-12 bg-white shadow absolute top-0 right-0 transform duration-300 ${collapsed ? 'left-20' : 'left-56'}`}>
      <button onClick={() => setCollapsed(!collapsed)}>toggle</button>
    </div>
  )
}