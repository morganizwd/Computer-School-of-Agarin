import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchAllAssignments = createAsyncThunk('assignments/fetchAllAssignments', async () => {
    const { data } = await axios.get('/assignments');
    return data;
});

export const fetchAssignmentById = createAsyncThunk('assignments/fetchAssignmentById', async (id) => {
    const { data } = await axios.get(`/assignment/${id}`);
    return data;
});

export const createAssignment = createAsyncThunk('assignments/createAssignment', async (assignmentData) => {
    const { data } = await axios.post('/assignment/create', assignmentData);
    return data;
});

export const updateAssignment = createAsyncThunk('assignments/updateAssignment', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/assignment/update/${id}`, updatedData);
    return data;
});

export const deleteAssignment = createAsyncThunk('assignments/deleteAssignment', async (id) => {
    await axios.delete(`/assignment/delete/${id}`);
    return id;
});

const initialState = {
    assignments: [],
    currentAssignment: null,
    status: 'idle',
    error: null,
};

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAssignments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllAssignments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.assignments = action.payload;
            })
            .addCase(fetchAllAssignments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAssignmentById.fulfilled, (state, action) => {
                state.currentAssignment = action.payload;
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                state.assignments.push(action.payload);
            })
            .addCase(updateAssignment.fulfilled, (state, action) => {
                const index = state.assignments.findIndex(assignment => assignment._id === action.payload._id);
                if (index !== -1) {
                    state.assignments[index] = action.payload;
                }
            })
            .addCase(deleteAssignment.fulfilled, (state, action) => {
                state.assignments = state.assignments.filter(assignment => assignment._id !== action.payload);
            })
    },
});

export const assignmentsReducer = assignmentsSlice.reducer;