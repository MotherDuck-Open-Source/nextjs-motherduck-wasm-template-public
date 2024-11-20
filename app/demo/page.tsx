"use client"

import useFetchAndCacheDetailsByYearData from './hooks/fetchAndCacheDetailsByYearData';
import useFetchComplaintsByYearData from './hooks/fetchComplaintsByYearData';
import useFetchTopComplaintsData from './hooks/fetchTopComplaintsData';
import useFetchZipcodeData from './hooks/fetchZipcodeData';
import useDebounce from './hooks/debounce';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const RangeSweepBarChart = dynamic(() => import('./viz/RangeSweepBarChart'), {
    ssr: false,
});
const NYCZipcodeHeatMap = dynamic(() => import('./viz/NYCZipcodeHeatMap'), { ssr: false });
const SelectableBarChart = dynamic(() => import('./viz/SelectableBarChart'), { ssr: false });

type VizContainerProps = {
    topLeftViz: React.ReactNode;
    bottomLeftViz: React.ReactNode;
    rightViz: React.ReactNode;
    className?: string;
    title?: string;
};

const VizContainer: React.FC<VizContainerProps> = ({
    topLeftViz,
    bottomLeftViz,
    rightViz,
    className = '',
    title
}) => {
    return (
        <div className={`w-full min-h-[800px] p-4 ${className}`}>
            {title && (
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            )}

            <div className="flex h-full gap-4">
                <div className="w-2/5 flex flex-col gap-4">
                    <div className="h-1/2 bg-white">
                        {topLeftViz}
                    </div>

                    <div className="h-3/8 bg-white rounded-lg ">
                        {bottomLeftViz}
                    </div>
                </div>

                <div className="w-2/3 h-4/5 bg-white rounded-lg ">
                    {rightViz}
                </div>
            </div>
        </div>
    );
};

export default function NYPDComplaintsCompletedViz() {
    const [complaintType, setComplaintType] = useState<string | null>(null);
    const [yearRange, setYearRange] = useState<[number, number]>([2010, 2023]);
    const debouncedYearRange = useDebounce(yearRange, 50);

    const { fetchAndCacheDetailsByYearData, detailsByYearQuerySuccess } = useFetchAndCacheDetailsByYearData();
    // MOTHERDUCK: Initial fetch of the NYPD complaints dataset from MotherDuck 
    useEffect(() => {
        fetchAndCacheDetailsByYearData();
    }, [fetchAndCacheDetailsByYearData]);

    const { fetchZipcodeData } = useFetchZipcodeData(complaintType, debouncedYearRange, detailsByYearQuerySuccess);
    const { fetchYearCountData } = useFetchComplaintsByYearData();
    const { fetchTopComplaintsData } = useFetchTopComplaintsData(debouncedYearRange, detailsByYearQuerySuccess);

    return (
        <div className="flex justify-center min-h-screen px-4 py-8">
            <div className="w-full md:w-3/4 lg:w-3/4 xl:w-3/4 h-3/5">
                <VizContainer
                    title="NYPD Complaints Visualization"
                    topLeftViz={<RangeSweepBarChart title="Number of Complaints by Year" onRangeChange={setYearRange} selectedRange={yearRange} fetchData={fetchYearCountData} />}
                    bottomLeftViz={<SelectableBarChart title="Top Complaints By Type" fetchData={fetchTopComplaintsData} onBarClick={setComplaintType} selectedBar={complaintType} />}
                    rightViz={<NYCZipcodeHeatMap fetchData={fetchZipcodeData} title="NYPD Complaints Received" />}
                />
            </div>
        </div>
    )

}
