"use client";

import React from 'react';
import { MeteorsCard } from '@/components/MeteorsDemo';

export default function MeteorsTestPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meteors Component Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MeteorsCard 
            title="Test Card 1" 
            description="This is a simple test card to verify our Meteors component is working correctly."
          >
            <div>
              <span className="font-medium">Features:</span>
              <ul className="list-disc list-inside mt-2">
                <li>Meteor animation effect</li>
                <li>Gradient background</li>
                <li>Frosted glass effect</li>
                <li>Custom styling</li>
              </ul>
            </div>
          </MeteorsCard>
          
          <MeteorsCard 
            title="Test Card 2" 
            description="This card has an explore button to test the click functionality."
            onExploreClick={() => alert('Explore clicked!')}
          >
            <div>
              <span className="font-medium">Click the button below:</span>
            </div>
          </MeteorsCard>
        </div>
      </div>
    </div>
  );
} 