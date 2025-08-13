import React, { useEffect, useState, useRef } from 'react';
import {  Layout,  Typography,  Card,  Space,  Button,  Avatar,  message,  Divider,  Modal, Tag, Form, Input,} from 'antd';


const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const DEFAULT_PROFILE = {
  name: 'Frederico Sarren',
  class: '11 RPL',
  description:
    "Hi, I'm a student at SMK Tri Ratna, majoring in Software Engineering. I love to learn how to code (LIES).",
  avatar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Ider-SV-UAIGXyYVFv0V9FQHsQJoNfPxBA&s',
  tags: ['JavaScript', 'HTML/CSS', 'React'],
};

export default function Profil() {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const prevProfileRef = useRef(null);

  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    message.success('Hi.');

    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('profile_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          setProfile((cur) => {
            if (JSON.stringify(cur) !== JSON.stringify(parsed)) return parsed;
            return cur;
          });
        }
      }
    } catch (e) {
      console.warn('Could not read profile from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (profile) localStorage.setItem('profile_v1', JSON.stringify(profile));
        else localStorage.removeItem('profile_v1');
      }
    } catch (e) {
      console.warn('Could not persist profile', e);
    }
  }, [profile]);

  const openEditor = () => {
    if (!profile) return;
    setEditing(true);
    setVisible(true);
    form.setFieldsValue({
      name: profile.name,
      description: profile.description,
      class: profile.class,
    });
  };

  const openDelete = () => {
    if (!profile) return;
    setEditing(false);
    setVisible(true);
  };

  const handleOk = async () => {
    if (editing) {
      try {
        const values = await form.validateFields();
        prevProfileRef.current = profile;
        const updated = {
          ...profile,
          name: values.name,
          description: values.description,
          class: values.class || profile.class,
        };
        setProfile(updated);
        setVisible(false);
        message.success('Profile saved.');
      } catch {
      }
    } else {
      prevProfileRef.current = profile;
      setProfile(null);
      setVisible(false);

      const key = `delete_${Date.now()}`;
      const undo = () => {
        if (prevProfileRef.current) {
          setProfile(prevProfileRef.current);
          prevProfileRef.current = null;
          message.success('Profile restored.');
        }
        message.destroy(key);
      };

      message.open({
        content: 'Profile deleted.',
        key,
        duration: 5,
        btn: (
          <Button type="link" onClick={undo}>
            Undo
          </Button>
        ),
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
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
                <Avatar size={72} src={profile?.avatar} alt="Profile" />
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {profile ? profile.name : 'No profile'}
                  </Title>
                  <Text type="secondary">{profile ? profile.class : '-'}</Text>
                </div>
              </Space>

              <div>
                {profile &&
                  profile.tags.map((t) => (
                    <Tag key={t} style={{ marginBottom: 6 }}>
                      {t}
                    </Tag>
                  ))}
              </div>
            </Space>

            <Paragraph>{profile ? profile.description : 'This profile has been deleted.'}</Paragraph>

            <Divider />
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" onClick={openEditor} disabled={!profile}>
                Edit
              </Button>
              <Button danger onClick={openDelete} disabled={!profile}>
                Delete
              </Button>

              {!profile && (
                <Button
                  onClick={() => {
                    setProfile(DEFAULT_PROFILE);
                    message.success('Default profile restored.');
                  }}
                >
                  Restore default
                </Button>
              )}
            </Space>
          </Space>
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center' }}>©2025 RICO'S PROFILE</Footer>

      <Modal
        title={editing ? 'Edit Profile' : 'Delete Profile'}
        open={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={editing ? 'Save' : 'Delete'}
        okButtonProps={{ danger: !editing }}
      >
        {editing ? (
          <Form form={form} layout="vertical" initialValues={{ name: profile?.name, description: profile?.description }}>
            <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Class" name="class">
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        ) : (
          <Paragraph>
            Are you sure you want to delete <strong>{profile?.name}</strong>?
            <br />
            <strong>Note:</strong> You can undo right after deleting.
          </Paragraph>
        )}
      </Modal>
    </Layout>
  );
}