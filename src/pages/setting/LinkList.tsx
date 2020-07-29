import React, { useState, useEffect } from "react";
import { Table, Form, Input, Button, Modal, message, Upload } from "antd";
import http from '../../lib/http'
import { PlusOutlined } from '@ant-design/icons';

const { Column } = Table;

interface ILink {
  _id: string, 
  name: string, 
  pic: string,
  link: string
}

export default function LinkList() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [optType, setOptType] = useState('add');
  const [editId, setEditId] = useState<string>()

  const edit = (record: ILink) => {
    setVisible(true);
    setOptType('edit')
    setEditId(record._id)
    form.setFieldsValue({
      name: record.name,
      pic: record.pic,
      link: record.link
    });
  };

  const del = (_id: number) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: {msg: string} = await http.delete(`link/${_id}`)
        message.success(res.msg)
        getLinkList()
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
      optType === 'add' ? await http.post('link', data) : await http.put(`link/${editId}`, data)
      message.success({content: '添加成功！'})
      setVisible(false)
      setOptType('add')
      getLinkList()
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
  };

  const cancel = () => {
    form.resetFields()
    setVisible(false);
  };

  const getLinkList = async () => {
    const res: [] = await http.get('link')
    setTableData(res)
  }

  const uploadChange = (info: any) => {
    const { status, response } = info.file
    if (status === 'done') {
      form.setFieldsValue({ pic: response.url });
    }
  }

  useEffect(() => {
    getLinkList()
  }, [])

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Button type="primary" onClick={() => add()}>添加</Button>
      </div>
      <Table dataSource={tableData} bordered rowKey='_id'>
        <Column title="序号" width="5%" render={(text, record, index) => `${index + 1}`} />
        <Column title="名称" dataIndex="name" />
        <Column title="图片" dataIndex="pic" render={val => { return <div style={{ backgroundImage: `url(${val})` }} className="rounded-full h-20 w-20 bg-cover bg-center shadow-lg border" /> }} />
        <Column title="链接" dataIndex="link" />
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
          <Form.Item label="封面" name="pic" rules={[{ required: true, message: "请上传封面" }]} >
            <Upload
              action="http://127.0.0.1:9876/backend/api/uploads"
              listType="picture-card"
              onChange={info => uploadChange(info)}
            >
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item label="名称" name="name" rules={[{ required: true, message: "请填写名称" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="链接" name="link" rules={[{ required: true, message: "请填写链接" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
