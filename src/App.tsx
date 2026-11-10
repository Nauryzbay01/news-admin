import { App as AntApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

export default function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#2563eb',
          colorBgLayout: '#e8edf4',
          borderRadius: 10,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          Button: {
            primaryShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            controlHeight: 44,
            fontWeight: 500,
          },
          Table: {
            headerBg: '#f8fafc',
            borderColor: '#e2e8f0',
          },
        },
      }}
    >
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}
