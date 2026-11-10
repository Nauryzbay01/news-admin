import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useDeleteNewsMutation,
  useGetCategoriesQuery,
  useGetNewsListQuery,
  usePublishNewsMutation,
  useUnpublishNewsMutation,
} from '@/api/ainaApi'
import type { NewsResponse, NewsStatus } from '@/api/types'
import { PageShell } from '@/components/ui/PageShell'

const statusColors: Record<NewsStatus, string> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
  ARCHIVED: 'warning',
}

const statusLabels: Record<NewsStatus, string> = {
  DRAFT: 'Черновик',
  PUBLISHED: 'Опубликовано',
  ARCHIVED: 'В архиве',
}

export function NewsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const { data, isLoading, isFetching } = useGetNewsListQuery({ page, size: pageSize })
  const { data: categories = [] } = useGetCategoriesQuery()
  const [deleteNews] = useDeleteNewsMutation()
  const [publishNews] = usePublishNewsMutation()
  const [unpublishNews] = useUnpublishNewsMutation()

  const articles = data?.content ?? []

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.nameRu])),
    [categories],
  )

  const columns: ColumnsType<NewsResponse> = [
    {
      title: 'Заголовок',
      dataIndex: 'title',
      render: (title) => <span className="font-medium text-slate-800">{title}</span>,
    },
    {
      title: 'Категории',
      dataIndex: 'categories',
      width: 180,
      render: (ids: string[]) =>
        ids.map((id) => categoryById[id] ?? id.slice(0, 8)).join(', ') || '—',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 120,
      render: (status: NewsStatus) => (
        <Tag color={statusColors[status]} className="rounded-md">
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Обновлено',
      dataIndex: 'updatedAt',
      width: 170,
      render: (v?: string) => (v ? new Date(v).toLocaleString('ru-RU') : '—'),
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/news/${record.id}`)}
            aria-label="Редактировать"
          />
          {record.status !== 'PUBLISHED' ? (
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              title="Опубликовать"
              onClick={async () => {
                try {
                  await publishNews(record.id).unwrap()
                  message.success('Опубликовано')
                } catch {
                  message.error('Не удалось опубликовать')
                }
              }}
            />
          ) : (
            <Button
              type="text"
              icon={<StopOutlined />}
              title="Снять с публикации"
              onClick={async () => {
                try {
                  await unpublishNews(record.id).unwrap()
                  message.success('Снято с публикации')
                } catch {
                  message.error('Не удалось снять с публикации')
                }
              }}
            />
          )}
          <Popconfirm
            title="Удалить новость?"
            onConfirm={async () => {
              try {
                await deleteNews(record.id).unwrap()
                message.success('Удалено')
              } catch {
                message.error('Не удалось удалить')
              }
            }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Удалить" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageShell
      title="Новости"
      breadcrumbs={[{ label: 'Новости' }]}
      extra={
        <Link to="/news/new">
          <Button type="primary" size="large" icon={<PlusOutlined />}>
            Создать новость
          </Button>
        </Link>
      }
    >
      <Table
        className="table-card-databoard"
        rowKey="id"
        columns={columns}
        dataSource={articles}
        loading={isLoading || isFetching}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements ?? 0,
          showSizeChanger: true,
          onChange: (p, size) => {
            setPage(p - 1)
            setPageSize(size)
          },
        }}
      />
    </PageShell>
  )
}
