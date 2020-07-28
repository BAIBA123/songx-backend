import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, Modal, message } from "antd";
import http from '../../lib/http'

const { Column } = Table;

export default function TagList() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState();
  const [optType, setOptType] = useState('add');
  const [editId, setEditId] = useState<string>()

  const edit = (record: { name: string, _id: string }) => {
    setVisible(true);
    setOptType('edit')
    setEditId(record._id)
    form.setFieldsValue({
      name: record.name
    });
  };

  const del = (_id: number) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: {msg: string} = await http.delete(`tag/${_id}`)
        message.success(res.msg)
        getTagList()
      },
    });
  };

  const add = () => {
    setVisible(true);
    setOptType('add')
  }

  const submit = async () => {
    try {
      let data = await form.validateFields()
      optType === 'add' ? await http.post('tag', data) : await http.put(`tag/${editId}`, data)
      message.success({content: '添加成功！'})
      setVisible(false)
      setOptType('add')
      getTagList()
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
  };

  const cancel = () => {
    form.resetFields()
    setVisible(false);
  };

  const getTagList = async () => {
    const res = await http.get('tag')
    setTableData(res)
  }

  useEffect(() => {
    getTagList()
  }, [])

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Button type="primary" onClick={() => add()}>添加</Button>
      </div>
      <Table dataSource={tableData} bordered rowKey='_id'>
        <Column title="序号" width="20%" render={(text, record, index) => `${index + 1}`} />
        <Column title="名称" dataIndex="name" />
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
        onOk={() => submit()}
        onCancel={() => cancel()}
      >
        <Form name="basic" form={form}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
