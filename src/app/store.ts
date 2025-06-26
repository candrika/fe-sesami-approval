import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import leaveReducer from '../features/auth/leaveSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        leave:leaveReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch;