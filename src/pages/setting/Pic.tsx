import React, { useState, useEffect } from "react";
import http from "../../lib/http";
import { PlusOutlined } from "@ant-design/icons";
import { Table, Form, Button, Modal, message, Upload } from "antd";

interface IPic {
  _id: string;
  pic: string;
}

export default () => {
  const { Column } = Table;
  const [form] = Form.useForm();
  const [editId, setEditId] = useState("");
  const [picSrc, setPicSrc] = useState("");
  const [visible, setVisible] = useState(false);
  const [optType, setOptType] = useState("add");
  const [tableData, setTableData] = useState([]);
  const [picVisible, setPicVisible] = useState(false);
  const [defaultFileList, setDefaultFileList] = useState<any>();

  const edit = (record: IPic) => {
    setVisible(true);
    setOptType("edit");
    setEditId(record._id);
    form.setFieldsValue({
      pic: record.pic,
    });
    let list = [
      {
        uid: record._id,
        status: 'done',
        url: record.pic,
      }
    ];
    setDefaultFileList([...list])
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
  };

  const submit = async () => {
    try {
      let data = await form.validateFields();
      optType === "add" ? await http.post("pic", data) : await http.put(`pic/${editId}`, data);
      message.success({ content: "添加成功！" });
      setVisible(false);
      setOptType("add");
      getPicList();
      form.resetFields();
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

  const uploadChange = (info: any) => {
    const { status, response } = info.file;
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
        visible={visible}
        onOk={submit}
        onCancel={cancel}
      >
        <Form name="basic" form={form}>
          <Form.Item
            label="封面"
            name="pic"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              defaultFileList={defaultFileList}
              action="http://127.0.0.1:9876/backend/api/uploads"
              listType="picture-card"
              onChange={(info) => uploadChange(info)}
            >
              <PlusOutlined />
            </Upload>
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
