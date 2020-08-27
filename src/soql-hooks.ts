import { useState } from 'react';
import { IQuery, QueryParams } from 'open-soql/modules/types';

export function useSoql<R>(query: IQuery, params?: QueryParams) {
    const [loading, setLoading] = useState(null as (boolean | null));
    const [err, setErr] = useState(null as (any | null));
    const [data, setData] = useState(null as (R[] | null));
    
    const refetch = () => {
        query.execute<R>(params)
            .then(d => {
                setLoading(false);
                setErr(null);
                setData(d);
            })
            .catch(e => {
                setLoading(false);
                setErr(e);
                setData(null);
            });
        setLoading(true);
        setErr(null);
        setData(null);
    };

    if (loading === null) {
        refetch();
    }

    return { loading, err, data, refetch };
}
