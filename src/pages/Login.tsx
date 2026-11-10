import { DashboardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/api/ainaApi'
import { useAppDispatch } from '@/app/hooks'
import { loginSuccess } from '@/features/auth/authSlice'
import {
  MOCK_ACCESS_TOKEN,
  MOCK_PASSWORD,
  MOCK_USERNAME,
  isMockAuthEnabled,
  validateMockCredentials,
} from '@/features/auth/mockAuth'

interface LoginForm {
  username: string
  password: string
}

function LoginBrandPanel() {
  return (
    <div className="login-split-brand">
      <div>
        <div className="sidebar-logo !mb-0">
          <div className="sidebar-logo-icon">
            <DashboardOutlined />
          </div>
          <span className="sidebar-logo-text">DataBoard</span>
        </div>
        <p className="mt-8 max-w-sm text-lg leading-relaxed text-slate-400">
          Удобная панель для новостей, категорий и медиа — всё в одном месте.
        </p>
      </div>
      <p className="sidebar-copy">© DataBoard {new Date().getFullYear()}</p>
    </div>
  )
}

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm<LoginForm>()
  const [login, { isLoading: apiLoading }] = useLoginMutation()
  const [mockLoading, setMockLoading] = useState(false)
  const mockAuth = isMockAuthEnabled()

  const onFinish = async (values: LoginForm) => {
    if (mockAuth) {
      setMockLoading(true)
      await new Promise((r) => setTimeout(r, 200))
      if (!validateMockCredentials(values.username, values.password)) {
        setMockLoading(false)
        message.error('Неверный логин или пароль')
        return
      }
      dispatch(
        loginSuccess({
          accessToken: MOCK_ACCESS_TOKEN,
          username: values.username,
        }),
      )
      setMockLoading(false)
      navigate('/')
      return
    }

    try {
      const { accessToken } = await login({
        username: values.username,
        password: values.password,
      }).unwrap()
      dispatch(loginSuccess({ accessToken, username: values.username }))
      navigate('/')
    } catch {
      message.error('Неверный логин или пароль')
    }
  }

  const loading = mockAuth ? mockLoading : apiLoading

  return (
    <div className="login-split">
      <LoginBrandPanel />
      <div className="login-split-form">
        <div className="login-card">
          <div className="mb-8">
            <Typography.Title level={3} className="!mb-1 !text-slate-900">
              Вход
            </Typography.Title>
            <Typography.Text type="secondary">
              {mockAuth ? 'Демо-доступ к панели' : 'Авторизация через aina API'}
            </Typography.Text>
          </div>
          <Form<LoginForm>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username: MOCK_USERNAME, password: MOCK_PASSWORD }}
            requiredMark={false}
            className="databoard-form"
          >
            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input prefix={<UserOutlined />} size="large" placeholder="admin" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Продолжить
            </Button>
          </Form>
          {mockAuth && (
            <Typography.Paragraph type="secondary" className="!mt-4 !mb-0 text-center text-xs">
              Демо: {MOCK_USERNAME} / {MOCK_PASSWORD}
            </Typography.Paragraph>
          )}
        </div>
      </div>
    </div>
  )
}
