import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  variant?: "default" | "subtle" | "button";
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  external = false,
  variant = "default",
}) => {
  const baseClasses = "transition-all duration-200 ease-out";

  const variantClasses = {
    default:
      "text-foreground hover:bg-blog-accent-light border-b border-transparent hover:border-blog-accent",
    subtle: "text-muted-foreground hover:text-foreground",
    button: "btn btn-secondary",
  };

  const linkClasses = cn(baseClasses, variantClasses[variant], className);

  if (external) {
    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClasses}>
      {children}
    </NextLink>
  );
};
