import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; // предполагается, что axios уже настроен для взаимодействия с твоим API

// Async thunks
export const fetchAllSchedules = createAsyncThunk('schedule/fetchAllSchedules', async () => {
    const { data } = await axios.get('/schedules');
    return data;
});

export const fetchScheduleById = createAsyncThunk('schedule/fetchScheduleById', async (id) => {
    const { data } = await axios.get(`/schedule/${id}`);
    return data;
});

export const createSchedule = createAsyncThunk('schedule/createSchedule', async (scheduleData) => {
    const { data } = await axios.post('/schedule/create', scheduleData);
    return data;
});

export const updateSchedule = createAsyncThunk('schedule/updateSchedule', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/schedule/update/${id}`, updatedData);
    return data;
});

export const deleteSchedule = createAsyncThunk('schedule/deleteSchedule', async (id) => {
    await axios.delete(`/schedule/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    schedules: [],
    currentSchedule: null,
    status: 'idle',
    error: null,
};

// Slice definition
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSchedules.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllSchedules.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.schedules = action.payload;
            })
            .addCase(fetchAllSchedules.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchScheduleById.fulfilled, (state, action) => {
                state.currentSchedule = action.payload;
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.schedules.push(action.payload);
            })
            .addCase(updateSchedule.fulfilled, (state, action) => {
                const index = state.schedules.findIndex(schedule => schedule._id === action.payload._id);
                if (index !== -1) {
                    state.schedules[index] = action.payload;
                }
            })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.schedules = state.schedules.filter(schedule => schedule._id !== action.payload);
            });
    },
});

export const scheduleReducer = scheduleSlice.reducer;