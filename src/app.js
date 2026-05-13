const express = require('express');
const authRoutes = require('./routes/authRoutes');
const herbRoutes = require('./routes/herbRoutes');
const planRoutes = require('./routes/planRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/herbs', express.text({
  type: ['text/csv', 'application/csv']
}), herbRoutes);
app.use('/plans', planRoutes);
app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
