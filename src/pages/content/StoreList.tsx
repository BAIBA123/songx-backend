import React, { useState, useEffect } from "react"
import moment from "moment"
import http from "../../lib/http"
import { PlusOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons"
import { Table, Form, Input, Button, Modal, message, DatePicker, Rate, Upload } from "antd"

export default () => {
  const [form] = Form.useForm()
  const [total, setTotal] = useState(0) // 总页数
  const [optType, setOptType] = useState("add") // 操作: 编辑 || 添加
  const [visible, setVisible] = useState(false) // 编辑弹窗
  const [editId, setEditId] = useState<string>() // 编辑id
  const [tableData, setTableData] = useState([])
  const [fileList, setFileList] = useState<any>()
  const pageConf = {
    total: total,
    onChange: (pageNo: number) => getStoreList(pageNo),
  }

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) => `${index + 1}`,
    },
    {
      title: "封面",
      dataIndex: "pic",
      key: "pic",
      render: (val: any) => {
        return <img src={val} className="h-20" alt="" />
      },
    },
    {
      title: "关键词",
      dataIndex: "keyword",
      key: "keyword",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "评分",
      dataIndex: "star",
      key: "star",
    },
    {
      title: "日期",
      dataIndex: "start_date",
      key: "start_date",
      render: (val: any) => moment(val).format("YYYY-MM-DD HH:MM:SS"),
    },
    {
      title: "操作",
      dataIndex: "opt",
      key: "opt",
      render: (text: string, record: any) => (
        <div className="text-xl">
          <DeleteTwoTone
            onClick={() => del(record._id)}
            twoToneColor="#F56C6C"
            className="mr-4"
          />
          <EditTwoTone onClick={() => edit(record)} twoToneColor="#409EFF" />
        </div>
      ),
    },
  ]

  const getStoreList = async (pageNo: number = 1) => {
    const res: any = await http.get("store", { params: { pageNo } })
    setTableData(res.items)
    setTotal(res.total)
  }

  const add = () => {
    setVisible(true)
    setOptType("add")
    setFileList([])
  }

  const edit = (record: any) => {
    setVisible(true)
    setOptType("edit")
    setEditId(record._id)
    form.setFieldsValue({
      pic: record.pic,
      link: record.link,
      star: record.star,
      keyword: record.keyword,
      name: record.name,
      start_date: moment(record.start_date, "YYYY-MM-DD"),
    })
    let list = [
      {
        uid: record._id,
        url: record.pic,
      },
    ]
    setFileList(list)
  }

  const del = (_id: string) => {
    Modal.confirm({
      content: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      async onOk() {
        const res: any = await http.delete(`store/${_id}`)
        message.success(res.msg)
        getStoreList()
      },
    })
  }

  const submit = async () => {
    try {
      let data = await form.validateFields()
      optType === "add"
        ? await http.post("store", data)
        : await http.put(`store/${editId}`, data)
      message.success({ content: "添加成功！" })
      setVisible(false)
      setOptType("add")
      getStoreList()
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
  }

  const cancel = () => {
    form.resetFields()
    setVisible(false)
  }

  const uploadChange = (info: any) => {
    setFileList(info.fileList)
    const { status, response } = info.file
    status === "done" && form.setFieldsValue({ pic: response.url })
  }

  useEffect(() => {
    getStoreList()
  }, [])

  return (
    <div className="base-box">
      <div className="text-right mb-4">
        <Button type="primary" onClick={add}>
          添加
        </Button>
      </div>

      <Table dataSource={tableData} columns={columns} pagination={pageConf} bordered rowKey="_id" />

      <Modal
        centered
        title="编辑"
        onOk={submit}
        visible={visible}
        onCancel={cancel}
      >
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入书名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="链接"
            name="link"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="图片"
            name="pic"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              fileList={fileList}
              listType="picture-card"
              onChange={(info) => uploadChange(info)}
              action={process.env.REACT_APP_UPLOADS_API}
            >
              {fileList && fileList.length >= 1 ? null : <PlusOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item
            label="关键词"
            name="keyword"
            rules={[{ required: true, message: "请输入标签" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="评分" name="star">
            <Rate allowHalf />
          </Form.Item>

          <Form.Item
            label="日期"
            name="start_date"
            rules={[{ required: true, message: "选择阅读开始时间" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
