const express = require('express');
const alertRoutes = require('./routes/alertRoutes');
const auditRoutes = require('./routes/auditRoutes');
const automationRoutes = require('./routes/automationRoutes');
const authRoutes = require('./routes/authRoutes');
const batchRoutes = require('./routes/batchRoutes');
const herbRoutes = require('./routes/herbRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const planRoutes = require('./routes/planRoutes');
const reportRoutes = require('./routes/reportRoutes');
const taskRoutes = require('./routes/taskRoutes');
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
app.use('/batches', batchRoutes);
app.use('/tasks', taskRoutes);
app.use('/measurements', measurementRoutes);
app.use('/alerts', alertRoutes);
app.use('/automation', automationRoutes);
app.use('/reports', reportRoutes);
app.use('/audit', auditRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
