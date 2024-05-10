import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; 

// Async thunks
export const fetchAllTeachers = createAsyncThunk('teachers/fetchAllTeachers', async () => {
    const { data } = await axios.get('/teachers');
    return data;
});

export const fetchTeacherById = createAsyncThunk('teachers/fetchTeacherById', async (id) => {
    const { data } = await axios.get(`/teacher/${id}`);
    return data;
});

export const createTeacher = createAsyncThunk('teachers/createTeacher', async (teacherData) => {
    const { data } = await axios.post('/teacher/create', teacherData);
    return data;
});

export const updateTeacher = createAsyncThunk('teachers/updateTeacher', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/teacher/update/${id}`, updatedData);
    return data;
});

export const deleteTeacher = createAsyncThunk('teachers/deleteTeacher', async (id) => {
    await axios.delete(`/teacher/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    teachers: [],
    currentTeacher: null,
    status: 'idle',
    error: null,
};

// Slice definition
const teachersSlice = createSlice({
    name: 'teachers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTeachers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.teachers = action.payload;
            })
            .addCase(fetchAllTeachers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTeacherById.fulfilled, (state, action) => {
                state.currentTeacher = action.payload;
            })
            .addCase(createTeacher.fulfilled, (state, action) => {
                state.teachers.push(action.payload);
            })
            .addCase(updateTeacher.fulfilled, (state, action) => {
                const index = state.teachers.findIndex(teacher => teacher._id === action.payload._id);
                if (index !== -1) {
                    state.teachers[index] = action.payload;
                }
            })
            .addCase(deleteTeacher.fulfilled, (state, action) => {
                state.teachers = state.teachers.filter(teacher => teacher._id !== action.payload);
            });
    },
});

export const teachersReducer = teachersSlice.reducer;