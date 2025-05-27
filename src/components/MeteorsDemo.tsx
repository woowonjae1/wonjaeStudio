"use client";

import React, { Suspense } from "react";
import { Meteors } from "@/components/ui/meteors";
import { ArrowRight } from "lucide-react";

interface MeteorsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  onExploreClick?: () => void;
}

// Fallback component in case of error
function MeteorsCardFallback(props: Omit<MeteorsCardProps, 'children'> & {children: React.ReactNode}) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-slate-900 p-4 ${props.className}`}>
      <div className="relative z-10 h-full w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">{props.title}</h3>
            <p className="mb-4 text-gray-300">{props.description}</p>
            <div className="text-gray-200">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeteorsCard({
  title,
  description,
  children,
  className = "",
  onExploreClick,
}: MeteorsCardProps) {
  // Using error boundary pattern with fallback
  try {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 p-4 ${className}`}>
        <div className="relative z-10 h-full w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-slate-500 p-2">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                </div>
              </div>
              <p className="mb-4 text-gray-300">{description}</p>
              <div className="text-gray-200">{children}</div>
            </div>
            
            {onExploreClick && (
              <button
                onClick={onExploreClick}
                className="mt-6 w-full rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2 text-center font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-700"
              >
                Explore
              </button>
            )}
          </div>
        </div>
        
        {/* Wrap Meteors in Suspense to handle potential loading issues */}
        <Suspense fallback={null}>
          <Meteors number={20} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error rendering MeteorsCard:", error);
    return <MeteorsCardFallback title={title} description={description} className={className} onExploreClick={onExploreClick} children={children} />;
  }
} 