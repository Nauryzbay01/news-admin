import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Switch,
  Table,
  Tag,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/api/ainaApi'
import type { CategoryResponse } from '@/api/types'
import { FormSection, PageShell } from '@/components/ui/PageShell'

interface CategoryForm {
  nameKk: string
  nameRu: string
  sortOrder: number
  isImportant: boolean
}

export function CategoriesPage() {
  const { data: categories = [], isLoading, refetch } = useGetCategoriesQuery()
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [form] = Form.useForm<CategoryForm>()
  const [editForm] = Form.useForm<CategoryForm>()
  const [editing, setEditing] = useState<CategoryResponse | null>(null)

  const columns: ColumnsType<CategoryResponse> = [
    { title: 'Қазақша', dataIndex: 'nameKk' },
    { title: 'Русский', dataIndex: 'nameRu' },
    { title: 'Порядок', dataIndex: 'sortOrder', width: 100 },
    {
      title: 'Важная',
      dataIndex: 'isImportant',
      width: 100,
      render: (v: boolean) =>
        v ? <Tag color="red">Да</Tag> : <Tag color="default">Нет</Tag>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record)
              editForm.setFieldsValue({
                nameKk: record.nameKk,
                nameRu: record.nameRu,
                sortOrder: record.sortOrder,
                isImportant: record.isImportant,
              })
            }}
          />
          <Popconfirm
            title="Удалить категорию?"
            onConfirm={async () => {
              try {
                await deleteCategory(record.id).unwrap()
                message.success('Категория удалена')
              } catch {
                message.error('Не удалось удалить')
              }
            }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ]

  const onAdd = async (values: CategoryForm) => {
    try {
      await createCategory(values).unwrap()
      form.resetFields()
      form.setFieldsValue({ sortOrder: 0, isImportant: false })
      message.success('Категория добавлена')
    } catch {
      message.error('Не удалось создать')
    }
  }

  const onEditSave = async () => {
    if (!editing) return
    try {
      const values = await editForm.validateFields()
      await updateCategory({ id: editing.id, body: values }).unwrap()
      setEditing(null)
      message.success('Сохранено')
    } catch {
      message.error('Не удалось обновить')
    }
  }

  return (
    <PageShell title="Категории" breadcrumbs={[{ label: 'Категории' }]}>
      <FormSection number={1} title="Новая категория">
        <Form<CategoryForm>
          form={form}
          layout="vertical"
          onFinish={onAdd}
          initialValues={{ sortOrder: 0, isImportant: false }}
          className="databoard-form grid gap-4 md:grid-cols-2"
        >
          <Form.Item name="nameKk" label="Қазақша" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input placeholder="Саясат" />
          </Form.Item>
          <Form.Item name="nameRu" label="Русский" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input placeholder="Политика" />
          </Form.Item>
          <Form.Item name="sortOrder" label="Порядок сортировки">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="isImportant" label="Важная категория" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item className="md:col-span-2">
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={creating}>
              Добавить
            </Button>
            <Button type="link" onClick={() => refetch()} className="ml-2">
              Обновить список
            </Button>
          </Form.Item>
        </Form>
      </FormSection>

      <FormSection number={2} title="Все категории">
        <Table
          className="table-card-databoard"
          rowKey="id"
          columns={columns}
          dataSource={categories}
          loading={isLoading}
          pagination={false}
        />
      </FormSection>

      <Modal
        title="Редактирование категории"
        open={Boolean(editing)}
        onCancel={() => setEditing(null)}
        onOk={onEditSave}
        confirmLoading={updating}
        destroyOnHidden
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={editForm} layout="vertical" className="databoard-form">
          <Form.Item name="nameKk" label="Қазақша" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nameRu" label="Русский" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sortOrder" label="Порядок">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="isImportant" label="Важная" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  )
}
