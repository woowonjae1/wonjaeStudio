import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "content" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "default",
}) => {
  const sizeClasses = {
    default: "blog-container",
    content: "blog-content",
    wide: "blog-content-wide",
  };

  return <div className={cn(sizeClasses[size], className)}>{children}</div>;
};
