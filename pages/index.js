import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Space, Button, Avatar, message, Divider, Modal, Tag, Form, Input } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function Profil() {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    message.success('Welcome to your profile page!');
  }, []);

  const openEditor = () => {
    setEditing(true);
    setVisible(true);
    form.setFieldsValue({
      name: 'Frederico Sarren',
      description:
        "Hello. Did you know that I am currently feeling numb? Help. Anyway, I'm a student at SMK Tri Ratna, majoring in Software Engineering. I love to learn how to code (LIES).",
    });
  };

  const openDelete = () => {
    setEditing(false);
    setVisible(true);
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 18, marginRight: 24 }}>SMK Tri Ratna</div>
      </Header>

      <Content style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: 520 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space align="center" size="middle" style={{ justifyContent: 'space-between', width: '100%' }}>
              <Space align="center">
                <Avatar
                  size={72}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Ider-SV-UAIGXyYVFv0V9FQHsQJoNfPxBA&s"
                  alt="Profile"
                />
                <div>
                  <Title level={3} style={{ margin: 0 }}>Frederico Sarren</Title>
                  <Text type="secondary">11 RPL</Text>
                </div>
              </Space>

              <div>
                <Tag>JavaScript</Tag>
                <Tag>HTML/CSS</Tag>
                <Tag>React</Tag>
              </div>
            </Space>

            <Paragraph>
              Hello. Did you know that I am currently feeling numb? Help.
              Anyway, I'm a student at SMK Tri Ratna, majoring in Software Engineering. I love to learn how to code (LIES).
            </Paragraph>

            <Divider />
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" onClick={openEditor}>Edit</Button>
              <Button danger onClick={openDelete}>Delete</Button>
            </Space>
          </Space>
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center' }}>©2025 RICO'S PROFILE</Footer>

      <Modal
        title={editing ? 'Edit Profile' : 'Delete Profile'}
        open={visible}
        onCancel={() => setVisible(false)}
        okText={editing ? 'Save' : 'Delete'}
        okButtonProps={{ danger: !editing }}
      >
        {editing ? (
          <Form form={form} layout="vertical">
            <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        ) : (
          <Paragraph>
            Are you sure?  
            <br />
            <strong>Note:</strong> It won't do anything.
          </Paragraph>
        )}
      </Modal>
    </Layout>
  );
}
