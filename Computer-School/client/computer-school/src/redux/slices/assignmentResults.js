import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; // предполагается, что axios уже настроен для взаимодействия с твоим API

// Async thunks
export const fetchAllAssignmentResults = createAsyncThunk('assignmentResults/fetchAllAssignmentResults', async () => {
    const { data } = await axios.get('/assignmentResults');
    return data;
});

export const fetchAssignmentResultById = createAsyncThunk('assignmentResults/fetchAssignmentResultById', async (id) => {
    const { data } = await axios.get(`/assignmentResult/${id}`);
    return data;
});

export const createAssignmentResult = createAsyncThunk('assignmentResults/createAssignmentResult', async (assignmentResultData) => {
    const { data } = await axios.post('/assignmentResult/create', assignmentResultData);
    return data;
});

export const updateAssignmentResult = createAsyncThunk('assignmentResults/updateAssignmentResult', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/assignmentResult/update/${id}`, updatedData);
    return data;
});

export const deleteAssignmentResult = createAsyncThunk('assignmentResults/deleteAssignmentResult', async (id) => {
    await axios.delete(`/assignmentResult/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    assignmentResults: [],
    currentAssignmentResult: null,
    status: 'idle',
    error: null,
};

// Slice definition
const assignmentResultsSlice = createSlice({
    name: 'assignmentResults',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAssignmentResults.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllAssignmentResults.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.assignmentResults = action.payload;
            })
            .addCase(fetchAllAssignmentResults.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAssignmentResultById.fulfilled, (state, action) => {
                state.currentAssignmentResult = action.payload;
            })
            .addCase(createAssignmentResult.fulfilled, (state, action) => {
                state.assignmentResults.push(action.payload);
            })
            .addCase(updateAssignmentResult.fulfilled, (state, action) => {
                const index = state.assignmentResults.findIndex(result => result._id === action.payload._id);
                if (index !== -1) {
                    state.assignmentResults[index] = action.payload;
                }
            })
            .addCase(deleteAssignmentResult.fulfilled, (state, action) => {
                state.assignmentResults = state.assignmentResults.filter(result => result._id !== action.payload);
            });
    },
});

export const assignmentResultsReducer = assignmentResultsSlice.reducer;