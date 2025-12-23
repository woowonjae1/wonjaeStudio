import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/notes",
  className = "",
}: PaginationProps) {
  // 如果只有一页，不显示分页
  if (totalPages <= 1) {
    return null;
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // 最多显示7个页码

    if (totalPages <= maxVisiblePages) {
      // 如果总页数不超过最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂的分页逻辑
      if (currentPage <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 生成页面URL
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="分页导航"
    >
      {/* 上一页 */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/20 transition-colors"
          aria-label="上一页"
        >
          ← 上一页
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground/50 border border-border/50 rounded-md cursor-not-allowed">
          ← 上一页
        </span>
      )}

      {/* 页码 */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                isCurrentPage
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:text-foreground border-border hover:bg-secondary/20"
              }`}
              aria-label={`第 ${pageNum} 页`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/20 transition-colors"
          aria-label="下一页"
        >
          下一页 →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-muted-foreground/50 border border-border/50 rounded-md cursor-not-allowed">
          下一页 →
        </span>
      )}
    </nav>
  );
}

// 简化版分页组件（只有上一页/下一页）
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  className?: string;
  showPageInfo?: boolean;
}

export function SimplePagination({
  currentPage,
  totalPages,
  basePath = "/notes",
  className = "",
  showPageInfo = true,
}: SimplePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  return (
    <nav
      className={`flex items-center justify-between ${className}`}
      aria-label="简单分页导航"
    >
      {/* 上一页 */}
      <div>
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/20 transition-colors"
          >
            ← 上一页
          </Link>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm text-muted-foreground/50 border border-border/50 rounded-md cursor-not-allowed">
            ← 上一页
          </span>
        )}
      </div>

      {/* 页面信息 */}
      {showPageInfo && (
        <span className="text-sm text-muted-foreground">
          第 {currentPage} 页，共 {totalPages} 页
        </span>
      )}

      {/* 下一页 */}
      <div>
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/20 transition-colors"
          >
            下一页 →
          </Link>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm text-muted-foreground/50 border border-border/50 rounded-md cursor-not-allowed">
            下一页 →
          </span>
        )}
      </div>
    </nav>
  );
}

// 页面跳转组件
interface PageJumperProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  className?: string;
}

export function PageJumper({
  currentPage,
  totalPages,
  basePath = "/notes",
  className = "",
}: PageJumperProps) {
  const [inputPage, setInputPage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const url = page === 1 ? basePath : `${basePath}?page=${page}`;
      window.location.href = url;
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center space-x-2 ${className}`}
    >
      <span className="text-sm text-muted-foreground">跳转到</span>
      <input
        type="number"
        min="1"
        max={totalPages}
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        className="w-16 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        placeholder={currentPage.toString()}
      />
      <span className="text-sm text-muted-foreground">页</span>
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        跳转
      </button>
    </form>
  );
}

export default Pagination;
