import React from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md";
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  className,
  variant = "default",
  size = "sm",
  onClick,
}) => {
  const baseClasses = "tag";

  const variantClasses = {
    default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-secondary/20",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
