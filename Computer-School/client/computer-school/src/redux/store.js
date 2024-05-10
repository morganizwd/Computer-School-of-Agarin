import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { teachersReducer } from './slices/teachers';
import { scheduleReducer } from './slices/schedules';
import { locationsReducer } from './slices/locations';
import { groupsReducer } from './slices/groups';
import { coursesReducer } from './slices/courses';
import { assignmentsReducer } from './slices/assignments';
import { assignmentResultsReducer } from './slices/assignmentResults';

const store = configureStore({
    reducer: {
        auth: authReducer,
        groups: groupsReducer,
        courses: coursesReducer,
        teachers: teachersReducer,
        schedules: scheduleReducer,
        locations: locationsReducer,
        assignments: assignmentsReducer,
        assignmentResults: assignmentResultsReducer
    }
});

export default store;