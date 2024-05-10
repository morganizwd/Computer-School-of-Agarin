import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; // предполагается, что axios уже настроен для взаимодействия с твоим API

// Async thunks
export const fetchAllCourses = createAsyncThunk('courses/fetchAllCourses', async () => {
    const { data } = await axios.get('/courses');
    return data;
});

export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (id) => {
    const { data } = await axios.get(`/course/${id}`);
    return data;
});

export const createCourse = createAsyncThunk('courses/createCourse', async (courseData) => {
    const { data } = await axios.post('/course/create', courseData);
    return data;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/course/update/${id}`, updatedData);
    return data;
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id) => {
    await axios.delete(`/course/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    courses: [],
    currentCourse: null,
    status: 'idle',
    error: null,
};

// Slice definition
const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCourses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex(course => course._id === action.payload._id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courses = state.courses.filter(course => course._id !== action.payload);
            });
    },
});

export const coursesReducer = coursesSlice.reducer;