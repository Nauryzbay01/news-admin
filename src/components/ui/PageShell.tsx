import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageShellProps {
  title: string
  breadcrumbs: BreadcrumbItem[]
  extra?: ReactNode
  children: ReactNode
}

export function PageShell({ title, breadcrumbs, extra, children }: PageShellProps) {
  return (
    <div className="page-surface">
      <nav className="page-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="flex items-center">
          <HomeOutlined />
        </Link>
        {breadcrumbs.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <RightOutlined className="page-breadcrumbs-sep text-[10px]" />
            {item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="page-title-row">
        <h1 className="page-title">{title}</h1>
        {extra}
      </div>
      {children}
    </div>
  )
}

interface FormSectionProps {
  number: number
  title: string
  children: ReactNode
}

export function FormSection({ number, title, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <div className="form-section-head">
        <span className="form-section-num">{number}</span>
        <h2 className="form-section-title">{title}</h2>
      </div>
      {children}
    </section>
  )
}
