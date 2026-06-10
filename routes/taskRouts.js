import {
    createTask, getAllTasks, getTasksByBoard, getTaskById,
    updateTask, deleteTask, getTasksBySprint,
    assignUserToTask, updateTaskStatus, addLabelsToTask,
    updateTaskPriority, assignStoryPoints, moveTaskToSprint
} from '../controllers/taskController.js';
import express from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Create a new task
router.post('/', createTask);
// Get all tasks
router.get('/', getAllTasks);
// Get tasks by board ID
router.get('/board/:boardId', getTasksByBoard);
// Get tasks by sprint ID
router.get('/sprint/:sprintId', getTasksBySprint);

// Priority / points / sprint
router.patch('/:id/priority', updateTaskPriority);
router.patch('/:id/story-points', assignStoryPoints);
router.patch('/:id/move-to-sprint', moveTaskToSprint);

// Get a specific task by ID
router.get('/:id', getTaskById);
// Update a task (full update)
router.put('/:id', updateTask);
// Delete a task
router.delete('/:id', deleteTask);
// Assign a user to a task
router.put('/:id/assignee', assignUserToTask);
// Update task status
router.put('/:id/status', updateTaskStatus);
// Add labels to a task
router.put('/:id/labels', addLabelsToTask);

export default router;