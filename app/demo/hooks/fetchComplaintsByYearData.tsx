import { useCallback, useState } from 'react';
import { useMotherDuckClientState } from '@/motherduck/context/motherduckClientContext';
import { zNumeric2DDataRow, Numeric2DDataRow } from '@/app/demo/types/Numeric2DDataRow';

const COUNT_BY_YEAR_QUERY = `select year(created_date)::int as label, count(*)::int as value
from sample_data.nyc.service_requests
where label < 2023
and agency_name = 'New York City Police Department'
group by 1
order by 1;`

const useFetchComplaintsByYearData = () => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    function hasLabel(item: Numeric2DDataRow): item is Numeric2DDataRow & { label: number } {
        return item.label !== undefined
    }

    const fetchYearCountData = useCallback(async () => {
        try {
            const safe_result = await safeEvaluateQuery(COUNT_BY_YEAR_QUERY);
            if (safe_result.status === "success") {
                return safe_result.result.data.toRows().map(row => {
                    const parseResult = zNumeric2DDataRow.safeParse(row);
                    if (!parseResult.success) {
                        throw new Error(`Failed to parse count by year query row: ${parseResult.error}`);
                    }
                    return parseResult.data;
                }).filter(hasLabel).map(d => ({ year: d.label, value: d.value }));
            } else {
                setError("Query failed with error: " + safe_result.err);
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }, [safeEvaluateQuery]);

    return { fetchYearCountData, error };
}

export default useFetchComplaintsByYearData;