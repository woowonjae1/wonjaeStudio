"use client";

import { useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import "./DataTable.css";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  loading?: boolean;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  total,
  page,
  totalPages,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
  loading,
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder = sortBy === key && sortOrder === "desc" ? "asc" : "desc";
    onSort(key, newOrder);
  };

  const getValue = (item: T, key: string): any => {
    return (item as any)[key];
  };

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={col.sortable ? "sortable" : ""}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span className="th-content">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      <span className="sort-icon">
                        {sortOrder === "asc" ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="loading-cell">
                  加载中...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={`${item.id}-${String(col.key)}`}>
                      {col.render
                        ? col.render(item)
                        : getValue(item, String(col.key))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="total-info">共 {total} 条</span>
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <IconChevronLeft size={18} />
          </button>
          <span className="page-info">
            {page} / {totalPages || 1}
          </span>
          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
