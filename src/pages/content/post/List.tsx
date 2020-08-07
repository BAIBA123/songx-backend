import React, { useEffect, useState } from "react";

import moment from "moment";
import http from "../../../lib/http";
import { Link } from "react-router-dom";
import { Table, Button, message, Modal } from "antd";
import { CheckCircleTwoTone, PauseCircleTwoTone, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';


export default () => {
  const [tableData, setTableData] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: "标题",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      render: (text: any, record: any, index: number) => moment(record.date).format('YYYY-MM-DD')
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any, index: number) => 
        record.status ? <CheckCircleTwoTone className="text-xl" twoToneColor="#52c41a" /> : <PauseCircleTwoTone className="text-xl" twoToneColor="#E6A23C"/>
    },
    {
      title: "操作",
      dataIndex: "opts",
      key: "opts",
      render: (text: any, record: any) => (
        <div className="text-xl">
          <DeleteTwoTone onClick={() => del(record._id)} twoToneColor="#F56C6C" className="mr-4" />
          <Link to={`/content/post/${record._id}`}>
            <EditTwoTone twoToneColor="#409EFF" />
          </Link>
        </div>
      ),
    },
  ];

  const add = () => {};
  const del = async (id: string) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: any = await http.delete(`post/${id}`);
        message.success(res.msg);
        getPostList();
      },
    });
  };

  const getPostList = async () => {
    const res: any = await http.get("post");
    setTableData(res.items);
  };

  useEffect(() => {
    getPostList();
  }, []);

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Link to="/content/post/add">
          <Button type="primary" onClick={add}>
            添加
          </Button>
        </Link>
      </div>
      <Table dataSource={tableData} columns={columns} rowKey="_id" />
    </div>
  );
};
