import React from 'react'
import { Breadcrumb } from 'antd';

export default () => {
  return (
    <div className="border rounded p-4">
      <Breadcrumb>
        <Breadcrumb.Item>控制台</Breadcrumb.Item>
        <Breadcrumb.Item>配置管理</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}