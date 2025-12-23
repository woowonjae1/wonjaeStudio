import React from "react";
import { Container } from "@/components/ui";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-16">
      <Container>
        <div className="flex h-16 items-center justify-between text-sm text-muted-foreground">
          <div>© {currentYear} WOOWONJAE</div>

          <div className="flex items-center space-x-6">
            <a
              href="mailto:contact@woowonjae.top"
              className="hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              Email
            </a>
            <a
              href="/rss.xml"
              className="hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              RSS
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
