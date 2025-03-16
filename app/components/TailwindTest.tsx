// app/components/TailwindTest.tsx
import React from 'react';

interface TailwindTestProps {
  title?: string;
}

export function TailwindTest({ title = "Tailwind Test" }: TailwindTestProps) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-medium text-black mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 border rounded">
          <p className="text-gray-700">This is a test component</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            <li>Test item 1</li>
            <li>Test item 2</li>
            <li>Test item 3</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded bg-gray-50">
          <p className="text-gray-700">Another test section</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            <li>Another item 1</li>
            <li>Another item 2</li>
            <li>Another item 3</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col space-y-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
          Primary Button
        </button>
        
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none">
          Secondary Button
        </button>
        
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
          Danger Button
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <div className="flex items-center p-2 bg-gray-100 rounded mb-2">
          <span className="font-medium text-gray-700">Status:</span> Active
        </div>
        <div className="flex items-center p-2 bg-green-100 rounded mb-2">
          <span className="font-medium text-gray-700">Success:</span> Complete
        </div>
        <div className="flex items-center p-2 bg-yellow-100 rounded mb-2">
          <span className="font-medium text-gray-700">Warning:</span> Pending
        </div>
        <div className="flex items-center p-2 bg-red-100 rounded mb-2">
          <span className="font-medium text-gray-700">Error:</span> Failed
        </div>
      </div>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        This is a test component for Tailwind styles
      </p>
    </div>
  );
}