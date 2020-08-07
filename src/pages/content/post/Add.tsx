import React, { useState, useEffect, useCallback } from "react";
import E from "wangeditor";
import moment from "moment";
import http from "../../../lib/http";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, DatePicker, Switch, message, Upload } from "antd";

export default (props: any) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (value: any) => {
    props.match.params.id ? await http.put(`post/${props.match.params.id}`, Object.assign(value, { content })) : await http.post('post', Object.assign(value, { content }))
    message.success("保存成功！");
    props.history.replace("/content/post/list");
  };

  const initEditor = () => {
    const editor = new E(document.querySelector("#editor"));
    editor.customConfig.onchange = () => {
      setContent(editor.txt.html());
    };
    editor.create(); //创建
    return editor
  };

  const getPost = useCallback(async () => {
    const res: any = await http.get(`post/${props.match.params.id}`);
    form.setFieldsValue({
      name: res.item.name,
      status: res.item.status,
      date: moment(res.item.date, "YYYY-MM-DD"),
    });
    const editor = initEditor()
    editor.txt.html(res.item.content)
  }, [form, props.match.params.id]);

  const uploadChange = (info: any) => {
    const { status, response } = info.file;
    status === "done" && form.setFieldsValue({ pic: response.url });
  };

  useEffect(() => {
    props.match.params.id ? getPost() : initEditor();
  }, [getPost, props.match.params.id]);

  return (
    <div className="base-box">
      <Form
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="标题"
          rules={[{ required: true, message: "标题必填" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="内容">
          <div id="editor"></div>
        </Form.Item>

        <Form.Item
            name="pic"
            label="封面"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              listType="picture-card"
              action="http://127.0.0.1:9876/backend/api/uploads"
              onChange={(info) => uploadChange(info)}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>

        <Form.Item label="关键词"></Form.Item>

        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: "日期必填" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item name="status" label="上线" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 2, span: 14 }}>
          <Button onClick={onReset}>重置</Button>
          <Button type="primary" htmlType="submit" className="ml-2">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
