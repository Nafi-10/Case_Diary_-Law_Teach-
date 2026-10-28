import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Keep growing lists usable without making the desktop overview taller. */
export function PagedItems({
  items,
  label,
  empty,
  pageSize = 3,
}: {
  items: ReactNode[];
  label: string;
  empty: ReactNode;
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(items.length / pageSize);
  const current = Math.min(page, Math.max(0, pages - 1));
  return (
    <div className="paged-items">
      <div className="paged-items-body">
        {items.length
          ? items.slice(current * pageSize, (current + 1) * pageSize)
          : empty}
      </div>
      {items.length > pageSize && (
        <nav className="compact-pagination" aria-label={`${label} pagination`}>
          <span aria-live="polite">
            {current * pageSize + 1}–
            {Math.min((current + 1) * pageSize, items.length)} of {items.length}
          </span>
          <div>
            <button
              className="icon-button"
              aria-label={`Previous ${label}`}
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              className="icon-button"
              aria-label={`Next ${label}`}
              disabled={current >= pages - 1}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
