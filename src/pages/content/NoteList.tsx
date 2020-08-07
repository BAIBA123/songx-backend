import React, { useState, useEffect, useCallback } from "react";

import moment from 'moment';
import http from "../../lib/http";
import { Drawer, Button, Modal, Form, DatePicker, Input, message } from "antd";

interface NoteProps {
  visible: boolean;
  onClose: () => void;
  bookInfo: { id?: string; name?: string };
}

export default function NoteList(props: NoteProps) {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState('');
  const [noteList, setNoteList] = useState([]);
  const { visible, onClose, bookInfo } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const titleNode: React.ReactNode = (
    <div className="flex items-center">
      <h3>《{bookInfo.name}》</h3>
      <Button
        className="ml-auto"
        onClick={() => setModalVisible(true)}
        type="primary"
      >
        添加
      </Button>
    </div>
  );

  const getNoteList = useCallback(async () => {
    const res = await http.get("note", { params: { book_id: bookInfo.id } });
    setNoteList(res.items);
  }, [bookInfo])

  const okFn = async () => {
    let data = await form.validateFields();
    data = Object.assign({}, data, { book_id: bookInfo.id });
    editId ? await http.put(`note/${editId}`, data) : await http.post("note", data);
    setModalVisible(false);
    message.success("添加成功");
    getNoteList();
    form.resetFields()
  };

  const del = async (id: string) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        await http.delete(`note/${id}`);
        message.success("删除成功");
        getNoteList();
      },
    });
  };

  const edit = (item: { _id: string, date: Date, content: string }) => {
    setModalVisible(true)
    form.setFieldsValue({
      date: moment(item.date, 'YYYY-MM-DD'),
      content: item.content
    });
    setEditId(item._id)
  }

  useEffect(() => {
    getNoteList()
  }, [getNoteList])

  return (
    <div>
      <Drawer
        width="40%"
        title={titleNode}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {noteList && noteList.map((item: { _id: string; date: Date; content: string }) => {
          return (
            <div
              key={item._id}
              className=" border-dashed border-gray-300 border-b py-3"
            >
              <p className="mb-2 flex">
                <span className="text-xs text-gray-600">{item.date}</span>
                <span className="cursor-pointer text-green-600 ml-auto" onClick={() => edit(item)}>编辑</span>
                <span className="cursor-pointer text-red-600 ml-1" onClick={() => del(item._id)}>
                  删除
                </span>
              </p>
              <p>{item.content}</p>
            </div>
          );
        })}
      </Drawer>

      <Modal
        centered
        title="笔记"
        visible={modalVisible}
        onOk={okFn}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          name="noteForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          form={form}
        >
          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
