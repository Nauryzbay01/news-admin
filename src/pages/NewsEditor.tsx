import { SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateNewsMutation,
  useGetCategoriesQuery,
  useGetNewsByUuidQuery,
  useUpdateNewsMutation,
} from '@/api/ainaApi'
import type { NewsStatus, TipTapContent } from '@/api/types'
import { RichTextEditor } from '@/components/RichTextEditor'
import { FormSection, PageShell } from '@/components/ui/PageShell'
import { SLUG_PATTERN, slugifyForApi } from '@/lib/slug'
import { emptyTipTapDoc, normalizeTipTapContent } from '@/lib/tiptapContent'

interface ArticleForm {
  title: string
  slug: string
  metaDescription?: string
  categoryIds: string[]
  coverImageUrl: string
}

const statusLabels: Record<NewsStatus, string> = {
  DRAFT: 'Черновик',
  PUBLISHED: 'Опубликовано',
  ARCHIVED: 'В архиве',
}

export function NewsEditorPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery()
  const {
    data: existing,
    isLoading: newsLoading,
    isError: newsError,
  } = useGetNewsByUuidQuery(id!, { skip: isNew || !id })

  const [createNews, { isLoading: creating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: updating }] = useUpdateNewsMutation()

  const [form] = Form.useForm<ArticleForm>()
  const [content, setContent] = useState<TipTapContent>(emptyTipTapDoc())
  const [slugTouched, setSlugTouched] = useState(false)
  const coverUrl = Form.useWatch('coverImageUrl', form)

  useEffect(() => {
    if (!isNew && newsError) {
      message.warning('Материал не найден')
      navigate('/news')
    }
  }, [isNew, newsError, navigate])

  useEffect(() => {
    if (existing) {
      form.setFieldsValue({
        title: existing.title,
        slug: existing.slug,
        metaDescription: existing.metaDescription,
        categoryIds: existing.categories,
        coverImageUrl: existing.coverImageUrl,
      })
      setContent(normalizeTipTapContent(existing.content))
      setSlugTouched(true)
    } else if (isNew && categories[0]) {
      form.setFieldValue('categoryIds', [categories[0].id])
    }
  }, [categories, existing, form, isNew])

  const onTitleChange = (title: string) => {
    if (!slugTouched) {
      form.setFieldValue('slug', slugifyForApi(title))
    }
  }

  const onFinish = async (values: ArticleForm) => {
    const payload = {
      slug: values.slug,
      title: values.title,
      coverImageUrl: values.coverImageUrl,
      content,
      categoryIds: values.categoryIds,
      metaDescription: values.metaDescription,
    }
    try {
      if (isNew) {
        const created = await createNews(payload).unwrap()
        message.success('Новость создана (черновик)')
        navigate(`/news/${created.id}`)
      } else {
        await updateNews({ id: id!, body: payload }).unwrap()
        message.success('Сохранено')
        navigate('/news')
      }
    } catch {
      message.error('Ошибка сохранения (проверьте slug и категории)')
    }
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.nameRu,
  }))

  const loading = (!isNew && newsLoading) || categoriesLoading
  const pageTitle = isNew ? 'Новая новость' : 'Редактирование'
  const breadcrumbTail = isNew ? 'Новая новость' : 'Редактирование'

  const publishValue = existing?.publishedAt ? dayjs(existing.publishedAt) : null

  return (
    <PageShell
      title={pageTitle}
      breadcrumbs={[
        { label: 'Новости', href: '/news' },
        { label: breadcrumbTail },
      ]}
      extra={
        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          loading={creating || updating}
          onClick={() => form.submit()}
        >
          Сохранить
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Form<ArticleForm>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="databoard-form"
          requiredMark={false}
        >
          <FormSection number={1} title="Основная информация">
            <Form.Item
              name="title"
              label="Заголовок"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input
                size="large"
                placeholder="Заголовок новости"
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </Form.Item>
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="slug"
                  label="Slug (URL)"
                  rules={[
                    { required: true, message: 'Обязательное поле' },
                    {
                      pattern: SLUG_PATTERN,
                      message: 'Только латиница, цифры и дефис',
                    },
                  ]}
                >
                  <Input
                    placeholder="zagolovok-novosti"
                    onChange={() => setSlugTouched(true)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="categoryIds"
                  label="Категории"
                  rules={[{ required: true, message: 'Выберите хотя бы одну' }]}
                >
                  <Select
                    mode="multiple"
                    options={categoryOptions}
                    placeholder="Выберите категории"
                    maxTagCount="responsive"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Дата публикации">
                  <DatePicker
                    className="w-full"
                    showTime
                    format="DD.MM.YYYY, HH:mm"
                    value={publishValue}
                    disabled
                    placeholder={isNew ? 'После публикации' : '—'}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                {!isNew && existing && (
                  <Form.Item label="Статус">
                    <Input value={statusLabels[existing.status]} disabled />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </FormSection>

          <FormSection number={2} title="Описание">
            <div className="editor-shell">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            <Form.Item name="metaDescription" label="Meta description (SEO)" className="!mt-4">
              <Input.TextArea rows={2} showCount maxLength={500} placeholder="Краткое описание для поисковиков" />
            </Form.Item>
          </FormSection>

          <FormSection number={3} title="Изображения">
            <Form.Item
              name="coverImageUrl"
              label="URL обложки"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
            <div className="cover-preview">
              {coverUrl ? (
                <img src={coverUrl} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
              ) : (
                <span className="cover-preview-empty">Здесь появится превью</span>
              )}
            </div>
            {existing?.authorName && (
              <Typography.Text type="secondary" className="mt-3 block text-sm">
                Автор: {existing.authorName}
              </Typography.Text>
            )}
          </FormSection>
        </Form>
      )}
    </PageShell>
  )
}
