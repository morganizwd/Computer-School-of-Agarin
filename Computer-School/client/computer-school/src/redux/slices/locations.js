import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios'; 

// Async thunks
export const fetchAllLocations = createAsyncThunk('locations/fetchAllLocations', async () => {
    const { data } = await axios.get('/locations');
    return data;
});

export const fetchLocationById = createAsyncThunk('locations/fetchLocationById', async (id) => {
    const { data } = await axios.get(`/location/${id}`);
    return data;
});

export const createLocation = createAsyncThunk('locations/createLocation', async (locationData) => {
    const { data } = await axios.post('/location/create', locationData);
    return data;
});

export const updateLocation = createAsyncThunk('locations/updateLocation', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/location/update/${id}`, updatedData);
    return data;
});

export const deleteLocation = createAsyncThunk('locations/deleteLocation', async (id) => {
    await axios.delete(`/location/delete/${id}`);
    return id;
});

// Initial state
const initialState = {
    locations: [],
    currentLocation: null,
    status: 'idle',
    error: null,
};

// Slice definition
const locationsSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLocations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLocations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.locations = action.payload;
            })
            .addCase(fetchAllLocations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchLocationById.fulfilled, (state, action) => {
                state.currentLocation = action.payload;
            })
            .addCase(createLocation.fulfilled, (state, action) => {
                state.locations.push(action.payload);
            })
            .addCase(updateLocation.fulfilled, (state, action) => {
                const index = state.locations.findIndex(location => location._id === action.payload._id);
                if (index !== -1) {
                    state.locations[index] = action.payload;
                }
            })
            .addCase(deleteLocation.fulfilled, (state, action) => {
                state.locations = state.locations.filter(location => location._id !== action.payload);
            });
    },
});

export const locationsReducer = locationsSlice.reducer;
