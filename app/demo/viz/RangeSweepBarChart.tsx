"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';

type YearRange = [number, number];

interface YearValue {
  year: number;
  value: number;
}

interface YearRangeBarChartProps {
  title: string;
  selectedRange: YearRange;
  onRangeChange: (range: YearRange) => void;
  fetchData: () => Promise<YearValue[]>;
}

const selectorOptions = {
  buttons: [
    {
      step: "all",
      stepmode: "todate",
      value: 1,
      label: "All"
    },
    {
      step: "month",
      stepmode: "backward",
      value: 1,
      label: "1 Month"
    },
    {
      step: "year",
      stepmode: "backward",
      value: 1,
      label: "1 Year"
    }
  ]
};


const RangeSweepBarChart: React.FC<YearRangeBarChartProps> = ({ title, selectedRange, onRangeChange, fetchData }) => {
  const [yearData, setYearData] = useState<YearValue[]>([]);

  useEffect(() => {
    const initialFetch = async () => {
      const data = await fetchData();
      // onRangeChange(data.length > 0? [data[0].year, data[data.length - 1].year] : [2000, 2023]);
      setYearData(data);
    }
    initialFetch();
  }, [fetchData]);

  const handleRelayout = useCallback((event: Readonly<Plotly.PlotRelayoutEvent>) => {
    if (event['xaxis.range'] !== undefined) {

      const newRange: YearRange = [
        Number(event['xaxis.range'][0]),
        Number(event['xaxis.range'][1])
      ];
      onRangeChange(newRange);
    } else if (event['xaxis.range[0]'] !== undefined && event['xaxis.range[1]'] !== undefined) {

      const newRange: YearRange = [
        Number(event['xaxis.range[0]']),
        Number(event['xaxis.range[1]'])
      ];
      onRangeChange(newRange);
    }
  }, [onRangeChange]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Year Selected: {Math.floor(selectedRange?.[0] + 0.5)} - {Math.floor(selectedRange?.[1] + 0.5)}
        </div>
      </div>
      <Plot
        data={[
          {
            type: 'bar',
            x: yearData.map(d => d.year),
            y: yearData.map(d => d.value),
            marker: {
              color: '#3b82f6',
              opacity: 0.8
            },
            hovertemplate: 'Year: %{x}<br>Count: %{y}<extra></extra>'
          }
        ]}
        layout={{
          title: {
            text: title,
            font: {
              size: 20
            }
          },
          xaxis: {
            title: 'Year',
            range: selectedRange,
            type: 'linear',
            tickmode: 'linear',
            dtick: 1,
            fixedrange: true, // Make x-axis static
            // @ts-expect-error: not sure why step isn't the expected type
            rangeselector: selectorOptions,
            rangeslider: {}
          },
          yaxis: {
            title: 'Count',
            fixedrange: true // Prevent y-axis zooming
          },
          margin: { t: 50, r: 20, b: 40, l: 60 },
          showlegend: false
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            'lasso2d',
            'pan2d',
            'zoom2d',
            'autoScale2d',
            'resetScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'toggleSpikelines',
            'select2d',
          ],
          responsive: true
        }}
        style={{ width: '100%', height: '300px' }}
        onRelayout={handleRelayout}
      />
    </div>
  );
};


export default RangeSweepBarChart;