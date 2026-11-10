import {
  BellOutlined,
  DashboardOutlined,
  DownOutlined,
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Input } from "antd";
import { useMemo, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

type NavItem = {
  key: string;
  icon: ReactNode;
  label: string;
  path: string;
};

const mainNav: NavItem[] = [
  { key: "/", icon: <DashboardOutlined />, label: "Дашборд", path: "/" },
  { key: "/news", icon: <FileTextOutlined />, label: "Новости", path: "/news" },
  {
    key: "/categories",
    icon: <FolderOutlined />,
    label: "Категории",
    path: "/categories",
  },
];

const footerNav: NavItem[] = [
  {
    key: "help",
    icon: <QuestionCircleOutlined />,
    label: "Справка",
    path: "/help",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Настройки",
    path: "/settings",
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const username = useAppSelector((s) => s.auth.username);

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/news")) return "/news";
    if (path.startsWith("/categories")) return "/categories";
    return "/";
  }, [location.pathname]);

  const displayName =
    username && username !== "admin"
      ? username.charAt(0).toUpperCase() + username.slice(1)
      : "Администратор";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <DashboardOutlined />
          </div>
          <span className="sidebar-logo-text">DataBoard</span>
        </div>

        <nav className="sidebar-nav" aria-label="Основное меню">
          {mainNav.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-link ${selectedKey === item.key ? "sidebar-link--active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {footerNav.map((item) => (
            <button
              key={item.key}
              type="button"
              className="sidebar-link"
              onClick={() => {
                if (item.key === "help" || item.key === "settings") {
                  /* placeholder */
                } else {
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <p className="sidebar-copy">© DataBoard {new Date().getFullYear()}</p>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <Input
              placeholder="Поиск..."
              prefix={<span className="text-slate-400">⌕</span>}
              allowClear
            />
          </div>
          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-notify-btn"
              aria-label="Уведомления"
            >
              <BellOutlined />
              <span className="admin-notify-dot" />
            </button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Выйти",
                    onClick: () => {
                      dispatch(logout());
                      navigate("/login");
                    },
                  },
                ],
              }}
            >
              <button type="button" className="admin-user-btn">
                <Avatar
                  size={40}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username ?? "admin")}`}
                />
                <span className="admin-user-name hidden sm:inline">
                  {displayName}
                </span>
                <DownOutlined className="text-xs text-slate-400" />
              </button>
            </Dropdown>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
