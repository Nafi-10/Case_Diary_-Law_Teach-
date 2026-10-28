import { useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  LoaderCircle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({
  children,
  tone = "",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span
      className={`badge ${tone || String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      <span className="badge-dot" />
      {children}
    </span>
  );
}
export function Avatar({
  name,
  size = "",
  index = 0,
}: {
  name: string;
  size?: string;
  index?: number;
}) {
  return (
    <span className={`avatar ${size} avatar-${index % 4}`} aria-label={name}>
      {name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")}
    </span>
  );
}
export function PageHeader({
  className = "",
  eyebrow,
  title,
  description,
  actions,
}: {
  className?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className={`page-header ${className}`}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </div>
  );
}
export function Panel({
  title,
  meta,
  action,
  children,
  className = "",
}: {
  title?: string;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-header">
          <div className="panel-title">
            <h2>{title}</h2>
            {meta}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function TextLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}
export function EmptyState({
  title = "Nothing here just yet",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <FileSearch size={27} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function LoadingSkeleton() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="spin" />
      <p>Loading your workspace…</p>
    </div>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <EmptyState
      title="We couldn’t load this view"
      description="Your changes in other views are still available. Try loading this view again."
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
}
export function Modal({
  title,
  description,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-inner">
        <header className="modal-heading">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
export function Field({
  label,
  children,
  hint,
  error,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
      {error && (
        <small className="field-error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item, index) => (
        <button
          key={item}
          role="tab"
          aria-selected={value === item}
          tabIndex={value === item ? 0 : -1}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
          onKeyDown={(e) => {
            let next = index;
            if (e.key === "ArrowRight") next = (index + 1) % items.length;
            else if (e.key === "ArrowLeft")
              next = (index - 1 + items.length) % items.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = items.length - 1;
            else return;
            e.preventDefault();
            onChange(items[next]);
            (
              e.currentTarget.parentElement?.children[next] as HTMLButtonElement
            )?.focus();
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className={`check-row ${checked ? "completed" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="custom-check">{checked && <Check size={12} />}</span>
      <span>{children}</span>
    </label>
  );
}
export function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (n: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="pagination">
      <span>
        Showing {total ? (page - 1) * perPage + 1 : 0}–
        {Math.min(page * perPage, total)} of {total} cases
      </span>
      <div>
        <button
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => onChange(i + 1)}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
export function downloadText(
  filename: string,
  contents: string,
  type = "text/plain",
) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
