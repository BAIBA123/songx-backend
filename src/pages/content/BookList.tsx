import React, { useState, useEffect } from "react";

import moment from "moment";
import http from "../../lib/http";
import NoteList from "./NoteList";
import { Table, Form, Input, Button, Modal, message, DatePicker, Rate, Upload, Select } from "antd";
import { PlusOutlined, DeleteTwoTone, EditTwoTone, UnorderedListOutlined } from "@ant-design/icons";

interface Book {
  _id: string;
  pic: string;
  name: string;
  star: number;
  author: string;
  end_date: Date;
  start_date: Date;
}

export default function BookList() {
  const { Column } = Table;
  const { Option } = Select;
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0); // 总页数
  const [picSrc, setPicSrc] = useState(""); // 图片预览弹窗
  const [tagList, setTagList] = useState([]);
  const [bookInfo, setBookInfo] = useState({}); // 图片预览弹窗
  const [optType, setOptType] = useState("add"); // 操作: 编辑 || 添加
  const [visible, setVisible] = useState(false); // 编辑弹窗
  const [tableData, setTableData] = useState([]); // 列表数据
  const [editId, setEditId] = useState<string>(); // 编辑id
  const [showNote, setShowNote] = useState(false); // 图片预览弹窗
  const [picVisible, setPicVisible] = useState(false); // 图片预览弹窗
  const [defaultFileList, setDefaultFileList] = useState<any>(); 
  const pageConf = {
    total: total,
    onChange: (pageNo: number) => getBookList(pageNo),
  };

  const edit = (record: Book) => {
    setVisible(true);
    setOptType("edit");
    setEditId(record._id);
    form.setFieldsValue({
      pic: record.pic,
      star: record.star,
      name: record.name,
      author: record.author,
      end_date: moment(record.end_date, "YYYY-MM-DD"),
      start_date: moment(record.start_date, "YYYY-MM-DD"),
    });
    let list = [
      {
        uid: record._id,
        url: record.pic
      }
    ]
    setDefaultFileList(list)
  };

  const del = (_id: number) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: any = await http.delete(`book/${_id}`);
        message.success(res.msg);
        getBookList();
      },
    });
  };

  const add = () => {
    setVisible(true);
    setOptType("add");
    setDefaultFileList([])
  };

  const submit = async () => {
    try {
      let data = await form.validateFields();
      optType === "add"
        ? await http.post("book", data)
        : await http.put(`book/${editId}`, data);
      message.success({ content: "添加成功！" });
      setVisible(false);
      setOptType("add");
      getBookList();
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const uploadChange = (info: any) => {
    const { status, response } = info.file;
    status === "done" && form.setFieldsValue({ pic: response.url });
  };

  const getBookList = async (pageNo: number = 1) => {
    const res: any = await http.get("book", { params: { pageNo } });
    setTableData(res.items);
    setTotal(res.total);
  };

  const getTagList = async () => {
    const res: any = await http.get("tag");
    setTagList(res.items);
  };

  const picPreview = (val: string) => {
    setPicVisible(true);
    setPicSrc(val);
  };

  const drawerClose = () => {
    setShowNote(false);
  };

  const showDrawer = (id: string, name: string) => {
    setShowNote(true);
    setBookInfo({ id, name });
  };

  useEffect(() => {
    getBookList();
    getTagList();
  }, []);

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Button type="primary" onClick={() => add()}>
          添加
        </Button>
      </div>
      <Table dataSource={tableData} pagination={pageConf} bordered rowKey="_id">
        <Column
          title="序号"
          render={(text, record, index) => `${index + 1}`}
          width="5%"
        />
        <Column
          title="封面"
          dataIndex="pic"
          render={(val) => {
            return (
              <img
                src={val}
                onClick={() => picPreview(val)}
                className="h-20"
                alt=""
              />
            );
          }}
        />
        <Column title="书名" dataIndex="name" width="20%" />
        <Column title="作者" dataIndex="author"  width="20%"  />
        <Column
          title="标签"
          dataIndex="tags"
          render={(val) => (
            <>
              {val.map((item: { _id: string; name: string }) => {
                return (
                  <Button
                    type="primary"
                    className="mr-1 mb-1"
                    size="small"
                    key={item._id}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </>
          )}
        />
        <Column title="评分" dataIndex="star" width="5%" />
        <Column
          title="操作"
          key="action"
          width="10%"
          render={(record) => (
            <div className="text-xl">
              <EditTwoTone 
                className="cursor-pointer mr-4"
                twoToneColor="#409EFF" 
                onClick={() => edit(record)}
              />
              <DeleteTwoTone 
                onClick={() => del(record._id)} 
                twoToneColor="#F56C6C" 
                className="mr-4" 
              />
              <UnorderedListOutlined
                className="cursor-pointer"
                onClick={() => showDrawer(record._id, record.name)}
              />
            </div>
          )}
        />
      </Table>

      <Modal
        centered
        title="编辑"
        visible={visible}
        onOk={submit}
        onCancel={cancel}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="书名"
            name="name"
            rules={[{ required: true, message: "请输入书名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="作者"
            name="author"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="封面"
            name="pic"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              listType="picture-card"
              defaultFileList={defaultFileList}
              onChange={(info) => uploadChange(info)}
              action="http://127.0.0.1:9876/backend/api/uploads"
            >
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
            rules={[{ required: true, message: "请选择标签" }]}
          >
            <Select mode="multiple" allowClear>
              {tagList &&
                tagList.map((item: { _id: string; name: string }) => {
                  return (
                    <Option value={item._id} key={item._id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="评分"
            name="star"
            rules={[{ required: true, message: "选择评分" }]}
          >
            <Rate allowHalf defaultValue={3} />
          </Form.Item>

          <Form.Item
            label="开始时间"
            name="start_date"
            rules={[{ required: true, message: "选择阅读开始时间" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="结束时间"
            name="end_date"
            rules={[{ required: true, message: "选择阅读结束时间" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览 */}
      <Modal
        centered
        title="预览"
        visible={picVisible}
        onCancel={() => setPicVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={picSrc} />
      </Modal>

      {/* 笔记 */}
      <NoteList
        visible={showNote}
        bookInfo={bookInfo}
        onClose={drawerClose}
      ></NoteList>
    </div>
  );
}