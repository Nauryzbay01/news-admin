export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type TipTapContent = Record<string, unknown>

export interface CategoryResponse {
  id: string
  nameKk: string
  nameRu: string
  sortOrder: number
  isImportant: boolean
}

export interface CategoryCreateRequest {
  nameKk: string
  nameRu: string
  sortOrder: number
  isImportant: boolean
}

export type CategoryUpdateRequest = CategoryCreateRequest

export interface NewsResponse {
  id: string
  slug: string
  title: string
  coverImageUrl: string
  content: TipTapContent
  authorName?: string
  status: NewsStatus
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  categories: string[]
  metaDescription?: string
}

export interface NewsCreateRequest {
  slug: string
  title: string
  coverImageUrl: string
  content: TipTapContent
  categoryIds: string[]
  metaDescription?: string
}

export type NewsUpdateRequest = NewsCreateRequest

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
