const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const { rows } = await db.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const { rows } = await db.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
