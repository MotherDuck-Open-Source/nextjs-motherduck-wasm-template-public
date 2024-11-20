import { useCallback, useState } from 'react';
import { useMotherDuckClientState } from '@/motherduck/context/motherduckClientContext';
import { zStringLabelNumericDataRow, StringLabelNumericDataRow } from '@/app/demo/types/StringLabelNumericDataRow';


function fetchZipcodeDataQuery(complaint_type: string | null, year_range: [number, number] | null) {
    let query = `select zipcode as label, sum(count)::int as value from complaints_details where 1 = 1`;
    if (complaint_type) {
        query += ` and Type = '${complaint_type}'`
    }
    if (year_range) {
        query += ` and year >= ${Math.floor(year_range?.[0] + 0.5)} and year <= ${Math.floor(year_range?.[1] + 0.5)}`
    }
    query += ` group by zipcode`
    return query
}

const useFetchZipcodeData = (complaintType: string | null, yearRange: [number, number], detailsByYearQuerySuccess: boolean) => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    function hasLabel(item: StringLabelNumericDataRow): item is StringLabelNumericDataRow & { label: number } {
        return item.label !== undefined
    }

    const fetchZipcodeData = useCallback(async () => {
        // cached data is not available yet
        if (!detailsByYearQuerySuccess) {
            return [];
        }
        try {
            const safe_result = await safeEvaluateQuery(fetchZipcodeDataQuery(complaintType, yearRange));
            if (safe_result.status === 'success') {
                return safe_result.result.data.toRows().map(row => {
                    const parseResult = zStringLabelNumericDataRow.safeParse(row);
                    if (!parseResult.success) {
                        throw new Error(`Failed to parse zipcode data row: ${parseResult.error}`);
                    }
                    return parseResult.data;
                }).filter(hasLabel).map(d => ({ zipcode: d.label, value: d.value }));
            } else {
                setError('Query failed with error: ' + safe_result.err);
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }, [safeEvaluateQuery, complaintType, yearRange, detailsByYearQuerySuccess]);

    return { fetchZipcodeData, error };
};

export default useFetchZipcodeData;