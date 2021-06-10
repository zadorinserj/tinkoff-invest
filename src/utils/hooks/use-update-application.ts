import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { patchApplication } from '@store/application/actions';

export const useUpdateApplication = () => {
    const dispatch = useDispatch();
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

    const update = useCallback(() => dispatch(patchApplication()), [dispatch]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            update();
        }, 30000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [update]);

    return { update };
};
