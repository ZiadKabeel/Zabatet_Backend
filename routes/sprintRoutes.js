import express from 'express';
import {
    createSprint,
    getSprintsByBoard,
    getSprintById,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    addTasksToSprint,
    removeTasksFromSprint
} from '../controllers/sprintController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();
router.use(authMiddleware);


router.post('/', createSprint);
router.get('/board/:boardId', getSprintsByBoard);
router.get('/:id', getSprintById);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

router.patch('/:id/start', startSprint);
router.patch('/:id/complete', completeSprint);
router.patch('/:id/tasks/add', addTasksToSprint);
router.patch('/:id/tasks/remove', removeTasksFromSprint);

export default router;
