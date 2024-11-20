import { useState, useCallback } from 'react'
import { useMotherDuckClientState } from '@/motherduck/context/motherduckClientContext'
import { zStringLabelNumericDataRow, StringLabelNumericDataRow } from '@/app/demo/types/StringLabelNumericDataRow';


function fetchComplaintsByTypeQuery(year_range: [number, number] | null) {
    let query = `select type as label, sum(count)::int as value from complaints_details where 1 = 1`;
    if (year_range) {
        query += ` and year >= ${Math.floor(year_range?.[0] + 0.5)} and year <= ${Math.floor(year_range?.[1] + 0.5)}`
    }
    query += ` group by type order by value desc limit 10`
    return query
}

const useFetchTopComplaintsData = (yearRange: [number, number], detailsByYearQuerySuccess: boolean) => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    function hasLabel(item: StringLabelNumericDataRow): item is StringLabelNumericDataRow & { label: string } {
        return item.label !== undefined
    }

    const fetchTopComplaintsData = useCallback(async () => {
        if (!detailsByYearQuerySuccess) {
            return [];
        }

        try {
            const safeResult = await safeEvaluateQuery(fetchComplaintsByTypeQuery(yearRange));
            if (safeResult.status === "success") {
                return safeResult.result.data.toRows().map(row => {
                    const parseResult = zStringLabelNumericDataRow.safeParse(row);
                    if (!parseResult.success) {
                        throw new Error(`Failed to parse top complaints row: ${parseResult.error}`);
                    }
                    return parseResult.data;
                }).filter(hasLabel);
            } else {
                setError("Query failed with error: " + safeResult.err);
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }

    }, [safeEvaluateQuery, detailsByYearQuerySuccess, yearRange]);

    return { fetchTopComplaintsData, error };
}

export default useFetchTopComplaintsData