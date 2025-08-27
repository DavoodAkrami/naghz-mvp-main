import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import courseReducer from './slices/courseSlice'
import fullCourseReducer from './slices/fullCourseSlice'
import coursePageReducer from './slices/coursePageSlice'
import userProgressReducer from './slices/userProgressSlice'
import aiReducer from './slices/aiSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        fullCourse: fullCourseReducer,
        coursePage: coursePageReducer,
        userProgress: userProgressReducer,
        ai: aiReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch