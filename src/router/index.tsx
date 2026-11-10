import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoginPage } from '@/pages/Login'

const DashboardPage = lazy(() =>
  import('@/pages/Dashboard').then((m) => ({ default: m.DashboardPage })),
)
const NewsListPage = lazy(() =>
  import('@/pages/NewsList').then((m) => ({ default: m.NewsListPage })),
)
const NewsEditorPage = lazy(() =>
  import('@/pages/NewsEditor').then((m) => ({ default: m.NewsEditorPage })),
)
const CategoriesPage = lazy(() =>
  import('@/pages/Categories').then((m) => ({ default: m.CategoriesPage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

function GuestRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

function AdminShell() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  )
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/news', element: <NewsListPage /> },
          { path: '/news/:id', element: <NewsEditorPage /> },
          { path: '/categories', element: <CategoriesPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
