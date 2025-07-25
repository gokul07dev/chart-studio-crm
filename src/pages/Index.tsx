import React from 'react';
import { ChartWidget } from '@/components/ChartWidget';
import { DealsTable } from '@/components/DealsTable';

const Index = () => {
  const chartData = [
    { name: 'Won', value: 80, color: 'hsl(var(--chart-1))' },
    { name: 'Test', value: 20, color: 'hsl(var(--chart-2))' },
    { name: 'Pending', value: 15, color: 'hsl(var(--chart-3))' },
    { name: 'Lost', value: 10, color: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Chart Section */}
      <div className="h-screen">
        <ChartWidget 
          data={chartData}
          onSettingsChange={(settings) => console.log('Settings updated:', settings)}
        />
      </div>
      
      {/* Deals Table Section */}
      <div className="p-6">
        <DealsTable />
      </div>
    </div>
  );
};

export default Index;
