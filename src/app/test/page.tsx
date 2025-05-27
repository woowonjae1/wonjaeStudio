'use client';

import React from 'react';
import { MeteorsCard } from '@/components/MeteorsDemo';

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MeteorsCard 
          title="Test Card" 
          description="This is a test card to verify the MeteorsCard component is working correctly."
        >
          <div>
            <span className="font-medium">Test Content:</span>
            <ul className="list-disc list-inside mt-2">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
              <li>Item 4</li>
            </ul>
          </div>
        </MeteorsCard>
      </div>
    </div>
  );
} 