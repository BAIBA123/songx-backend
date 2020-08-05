import React, { useEffect, useState } from "react";
import http from "../../../lib/http";
import { Link } from "react-router-dom";
import { Table, Button, message, Modal } from "antd";

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
      dataIndex: "title",
      key: "title",
      width: "40%",
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any, index: number) =>
        `${record.status ? "已发布" : "暂存"}`,
    },
    {
      title: "状态",
      dataIndex: "opts",
      key: "opts",
      render: (text: any, record: any) => (
        <>
          <span onClick={() => del(record._id)}>删除 {record.name}</span>
          <Link to={`/content/post/${record._id}`}>
            <span>编辑</span>
          </Link>
        </>
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
  const edit = () => {};

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
      <Table dataSource={tableData} columns={columns} />;
    </div>
  );
};
