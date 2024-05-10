import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; // предполагается, что axios уже настроен для взаимодействия с твоим API

// Async thunks
export const fetchAllGroups = createAsyncThunk('groups/fetchAllGroups', async () => {
    const { data } = await axios.get('/groups');
    return data;
});

export const fetchGroupById = createAsyncThunk('groups/fetchGroupById', async (id) => {
    const { data } = await axios.get(`/group/${id}`);
    return data;
});

export const createGroup = createAsyncThunk('groups/createGroup', async (groupData) => {
    const { data } = await axios.post('/group/create', groupData);
    return data;
});

export const updateGroup = createAsyncThunk('groups/updateGroup', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/group/update/${id}`, updatedData);
    return data;
});

export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (id) => {
    await axios.delete(`/group/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    groups: [],
    currentGroup: null,
    status: 'idle',
    error: null,
};

// Slice definition
const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGroups.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllGroups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.groups = action.payload;
            })
            .addCase(fetchAllGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchGroupById.fulfilled, (state, action) => {
                state.currentGroup = action.payload;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload);
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                const index = state.groups.findIndex(group => group._id === action.payload._id);
                if (index !== -1) {
                    state.groups[index] = action.payload;
                }
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(group => group._id !== action.payload);
            });
    },
});

export const groupsReducer = groupsSlice.reducer;