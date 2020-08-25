import React, { useState, useEffect } from "react";
import http from "../../lib/http";
import { PlusOutlined } from "@ant-design/icons";
import { Table, Form, Button, Modal, message, Upload, Input } from "antd";

interface IPic {
  _id: string;
  pic: string;
  title: string;
}

export default () => {
  const { Column } = Table;
  const [form] = Form.useForm();
  const [editId, setEditId] = useState("");
  const [picSrc, setPicSrc] = useState("");
  const [visible, setVisible] = useState(false);
  const [optType, setOptType] = useState("add");
  const [tableData, setTableData] = useState([]);
  const [fileList, setFileList] = useState<any>();
  const [picVisible, setPicVisible] = useState(false);

  const edit = (record: IPic) => {
    setVisible(true);
    setOptType("edit");
    setEditId(record._id);
    form.setFieldsValue({
      pic: record.pic,
      title: record.title
    });
    let list = [
      {
        uid: record._id,
        status: 'done',
        url: record.pic,
      }
    ];
    setFileList([...list])
  };

  const del = (_id: number) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: any = await http.delete(`pic/${_id}`);
        message.success(res.msg);
        getPicList();
      },
    });
  };

  const add = () => {
    setVisible(true);
    setOptType("add");
    form.resetFields();
    setFileList([])
  };

  const submit = async () => {
    try {
      let data = await form.validateFields();
      optType === "add" ? await http.post("pic", data) : await http.put(`pic/${editId}`, data);
      message.success({ content: "添加成功！" });
      setVisible(false);
      setOptType("add");
      getPicList();
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const getPicList = async () => {
    const res: any = await http.get("pic");
    setTableData(res.items);
  };

  const uploadChange = ({file, fileList}: any) => {
    setFileList(fileList)
    const { status, response } = file;
    status === "done" && form.setFieldsValue({ pic: response.url });
  };

  const picPreview = (val: string) => {
    setPicSrc(val);
    setPicVisible(true);
  };

  useEffect(() => {
    getPicList();
  }, []);

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Button type="primary" onClick={add}>
          添加
        </Button>
      </div>
      <Table dataSource={tableData} bordered rowKey="_id">
        <Column
          title="序号"
          width="5%"
          render={(text, record, index) => `${index + 1}`}
        />
        <Column
          title="图片"
          dataIndex="pic"
          render={(val) => {
            return (
              <img
                src={val}
                onClick={() => picPreview(val)}
                alt=""
                className=" h-64"
              />
            );
          }}
        />
        <Column 
          title="标题"
          key="title"
          dataIndex="title"
        />
        <Column
          title="操作"
          key="action"
          width="20%"
          render={(record) => (
            <>
              <Button
                className="cursor-pointer mr-4"
                size="small"
                type="primary"
                onClick={() => edit(record)}
              >
                编辑
              </Button>
              <Button
                className="cursor-pointer mr-4"
                size="small"
                type="primary"
                danger
                onClick={() => del(record._id)}
              >
                删除
              </Button>
            </>
          )}
        />
      </Table>

      <Modal
        centered
        title="编辑"
        onOk={submit}
        visible={visible}
        onCancel={cancel}
      >
        <Form form={form}>
          <Form.Item
            label="封面"
            name="pic"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              fileList={fileList}
              listType="picture-card"
              onChange={({file, fileList}) => uploadChange({file, fileList})}
              action={process.env.REACT_APP_UPLOADS_API}
            >
              {fileList && fileList.length >= 1 ? null : <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请填写标题" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览 */}
      <Modal
        centered
        width="80%"
        title="预览"
        visible={picVisible}
        onCancel={() => setPicVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={picSrc} />
      </Modal>
    </div>
  );
};
