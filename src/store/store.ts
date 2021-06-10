import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from '@store/app';

export const store = configureStore({
    reducer: {
        app: appReducer,
    },
})
