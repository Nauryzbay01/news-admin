import { FileTextOutlined, FolderOutlined, RiseOutlined } from '@ant-design/icons'
import { Card, Col, Row, Spin, Statistic, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery, useGetNewsListQuery } from '@/api/ainaApi'
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

export function DashboardPage() {
  const { data: newsPage, isLoading: newsLoading } = useGetNewsListQuery({
    page: 0,
    size: 100,
  })
  const { data: categories = [], isLoading: catLoading } = useGetCategoriesQuery()

  const articles = newsPage?.content ?? []
  const published = articles.filter((a) => a.status === 'PUBLISHED').length
  const drafts = articles.filter((a) => a.status === 'DRAFT').length

  const columns: ColumnsType<NewsResponse> = [
    {
      title: 'Заголовок',
      dataIndex: 'title',
      render: (title, record) => (
        <Link to={`/news/${record.id}`} className="font-medium text-blue-600 hover:underline">
          {title}
        </Link>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 120,
      render: (status: NewsStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Обновлено',
      dataIndex: 'updatedAt',
      width: 180,
      render: (v?: string) => (v ? new Date(v).toLocaleString('ru-RU') : '—'),
    },
  ]

  if (newsLoading || catLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <PageShell title="Дашборд" breadcrumbs={[{ label: 'Дашборд' }]}>
      <Row gutter={[20, 20]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card className="stat-card-databoard">
            <Statistic
              title="Всего новостей"
              value={newsPage?.totalElements ?? articles.length}
              prefix={<FileTextOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card-databoard">
            <Statistic
              title="Опубликовано"
              value={published}
              prefix={<RiseOutlined className="text-emerald-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card-databoard">
            <Statistic
              title="Категорий"
              value={categories.length}
              prefix={<FolderOutlined className="text-violet-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        className="stat-card-databoard"
        title="Последние материалы"
        extra={<span className="text-sm text-slate-400">Черновиков: {drafts}</span>}
      >
        <Table
          className="table-card-databoard"
          rowKey="id"
          columns={columns}
          dataSource={articles.slice(0, 5)}
          pagination={false}
        />
      </Card>
    </PageShell>
  )
}
