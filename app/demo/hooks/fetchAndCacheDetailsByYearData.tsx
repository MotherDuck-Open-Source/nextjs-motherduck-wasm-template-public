import { useCallback, useState } from "react";
import { useMotherDuckClientState } from "@/motherduck/context/motherduckClientContext";

const DETAILS_BY_YEAR_QUERY = `create temp table if not exists complaints_details as
select year(created_date)::int as year, complaint_type as type, incident_zip as zipcode, count(*)::int as count
from sample_data.nyc.service_requests
where year < 2023
and agency_name = 'New York City Police Department'
group by all
order by 1, 3 desc;`


const useFetchAndCacheDetailsByYearData = () => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [detailsByYearQuerySuccess, setDetailsByYearQuerySuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAndCacheDetailsByYearData = useCallback(async () => {
        setDetailsByYearQuerySuccess(false);
        try {
            const result = await safeEvaluateQuery(DETAILS_BY_YEAR_QUERY);
            if (result.status === "success") {
                setDetailsByYearQuerySuccess(true);
            } else {
                setError(`Query ${DETAILS_BY_YEAR_QUERY} failed with error: ${result.err}`)
            }
        } catch (error) {
            console.error(error);
        }
    }, [safeEvaluateQuery]);

    return { fetchAndCacheDetailsByYearData, detailsByYearQuerySuccess, error };
}

export default useFetchAndCacheDetailsByYearData;