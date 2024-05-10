import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box my={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          IT школа Агарина
        </Typography>
        <img
          src="https://sun9-57.userapi.com/impf/c858016/v858016122/63e30/KTFMxKrkRqA.jpg?size=960x1280&quality=96&sign=7ed452c02c3bd44bc6ea525f6d70b3f8&type=album"
          alt="Agarin's Reactive School"
          style={{ maxWidth: '50%', height: 'auto', marginBottom: 20 }}
        />
        <Paper elevation={3} sx={{ padding: 2, width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Контактная информация</Typography>
          <Typography variant="body1">Телефон: +375 (29) 123-45-67</Typography>
          <Typography variant="body1">Email: agarin7@gmail.com</Typography>
          <Typography variant="body1">Рабочее время: Пн-Пт 9:00 - 23:30</Typography>
          <Typography variant="body1">Адрес: ул. агариновая, 12, Могилев, Беларусь</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
