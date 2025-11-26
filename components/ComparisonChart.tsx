import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PlanResult, PlanType } from '../types';

interface ComparisonChartProps {
  results: PlanResult[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  
  // We want to color the bars based on the Plan Type to be consistent with the rest of the UI
  // But Recharts standard "stack" or group makes that tricky if we just use "Fees" and "Interest" keys.
  // Instead, we will use specific fill colors.

  const data = results.map(r => ({
    name: r.type,
    Fees: r.costs.totalFirstYearCost,
    Interest: r.costs.interestEarned,
  }));

  // Nummus Brand Colors
  const COLOR_FEES = '#393939'; // Dark Grey for Fees (Costs)
  const COLOR_INTEREST = '#00A79D'; // Brand Primary for Gains (Interest)

  // OR if we want to color code the BARS themselves by plan... 
  // Standard bar charts usually color by metric series. 
  // Let's stick to Metric series for clarity in comparison.
  // Fees = Dark Grey / Red tint? 
  // Interest = Gold? 
  // Let's use Brand Primary (Turquoise) for Interest (Positive) and a Neutral Dark Grey for Fees (Negative/Cost).

  return (
    <div className="bg-navy-800 border border-white/5 rounded-2xl p-6 shadow-xl h-[400px]">
      <h3 className="text-lg font-display font-semibold text-white mb-4">Cost vs Value Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2C3A39" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#B0B0B0" 
            tick={{ fill: '#B0B0B0', fontSize: 12, fontFamily: 'Inter' }} 
            axisLine={{ stroke: '#2C3A39' }}
          />
          <YAxis 
            stroke="#B0B0B0" 
            tick={{ fill: '#B0B0B0', fontSize: 12, fontFamily: 'Inter' }}
            tickFormatter={(value) => `$${value}`}
            axisLine={{ stroke: '#2C3A39' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E1F1F', borderColor: '#2C3A39', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ fontFamily: 'Inter' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Inter' }} />
          
          {/* Fees Bar - Neutral Grey/Reddish to indicate cost */}
          <Bar dataKey="Fees" name="Total Fees" fill="#717171" radius={[4, 4, 0, 0]} />
          
          {/* Interest Bar - Gold to indicate Value/Gain */}
          <Bar dataKey="Interest" name="Interest Earned" fill="#F0C556" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;