import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CategoryCreateRequest,
  CategoryResponse,
  CategoryUpdateRequest,
  LoginRequest,
  LoginResponse,
  NewsCreateRequest,
  NewsResponse,
  NewsUpdateRequest,
  PageResponse,
} from '@/api/types'
import { logout } from '@/features/auth/authSlice'
import { isMockAccessToken } from '@/features/auth/mockAuth'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { accessToken: string | null } }).auth
      .accessToken
    if (token && !isMockAccessToken(token)) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  const token = (api.getState() as { auth: { accessToken: string | null } }).auth
    .accessToken
  if (result.error && result.error.status === 401 && !isMockAccessToken(token)) {
    api.dispatch(logout())
  }
  return result
}

export const ainaApi = createApi({
  reducerPath: 'ainaApi',
  baseQuery,
  tagTypes: ['Category', 'News'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => '/api/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    createCategory: builder.mutation<CategoryResponse, CategoryCreateRequest>({
      query: (body) => ({
        url: '/api/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; body: CategoryUpdateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    getNewsList: builder.query<PageResponse<NewsResponse>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 }) => ({
        url: '/api/news',
        params: { page, size },
      }),
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map(({ id }) => ({ type: 'News' as const, id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),
    getNewsByUuid: builder.query<NewsResponse, string>({
      query: (id) => `/api/news/uuid/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'News', id }],
    }),
    createNews: builder.mutation<NewsResponse, NewsCreateRequest>({
      query: (body) => ({
        url: '/api/news',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),
    updateNews: builder.mutation<NewsResponse, { id: string; body: NewsUpdateRequest }>({
      query: ({ id, body }) => ({
        url: `/api/news/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
    deleteNews: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),
    publishNews: builder.mutation<NewsResponse, string>({
      query: (id) => ({
        url: `/api/news/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
    unpublishNews: builder.mutation<NewsResponse, string>({
      query: (id) => ({
        url: `/api/news/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetNewsListQuery,
  useGetNewsByUuidQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  usePublishNewsMutation,
  useUnpublishNewsMutation,
} = ainaApi
