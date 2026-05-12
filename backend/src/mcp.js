const express = require('express');
const router = express.Router();
const db = require('./db');

/**
 * Mock LLM-to-MCP Endpoint
 * Accepts JSON requests to satisfy function-calling workflows.
 * Expected payload:
 * {
 *   "action": "createTask" | "readTasks" | "updateTask" | "deleteTask",
 *   "payload": { ...arguments... }
 * }
 */
router.post('/', async (req, res) => {
  const { action, payload } = req.body;

  try {
    switch (action) {
      case 'readTasks': {
        const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      }

      case 'createTask': {
        const { title, description } = payload;
        if (!title) {
          return res.status(400).json({ success: false, error: 'Title is required for createTask' });
        }
        const { rows } = await db.query(
          'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
          [title, description || '']
        );
        return res.json({ success: true, data: rows[0], message: 'Task created' });
      }

      case 'updateTask': {
        const { id, title, description, completed } = payload;
        if (!id) {
          return res.status(400).json({ success: false, error: 'ID is required for updateTask' });
        }
        const { rows } = await db.query(
          'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed) WHERE id = $4 RETURNING *',
          [title, description, completed, id]
        );
        if (rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        return res.json({ success: true, data: rows[0], message: 'Task updated' });
      }

      case 'deleteTask': {
        const { id } = payload;
        if (!id) {
          return res.status(400).json({ success: false, error: 'ID is required for deleteTask' });
        }
        const { rowCount } = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (rowCount === 0) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        return res.json({ success: true, message: 'Task deleted' });
      }

      default:
        return res.status(400).json({ 
          success: false, 
          error: `Unknown action: ${action}. Supported actions: readTasks, createTask, updateTask, deleteTask` 
        });
    }
  } catch (error) {
    console.error('MCP Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
