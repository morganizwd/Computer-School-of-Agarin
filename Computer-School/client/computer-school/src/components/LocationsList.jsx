import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLocations } from '../redux/slices/locations'; // Убедитесь, что путь импорта соответствует вашей структуре
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const LocationsList = () => {
    const dispatch = useDispatch();
    const locations = useSelector((state) => state.locations.locations);
    const status = useSelector((state) => state.locations.status);
    const error = useSelector((state) => state.locations.error);

    useEffect(() => {
        dispatch(fetchAllLocations());
    }, [dispatch]);

    if (status === 'loading') {
        return <Typography>Loading locations...</Typography>;
    }

    if (status === 'failed') {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <Paper sx={{ margin: 2, padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Locations List
            </Typography>
            <List>
                {locations.map((location) => (
                    <ListItem key={location._id} divider>
                        <ListItemText
                            primary={`Address: ${location.address}`}
                            secondary={`Room Number: ${location.roomNumber}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default LocationsList;