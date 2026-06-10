import {
    createBoard,
    getAllBoards,
    getBoardsByWorkspace,
    getBoardById,
    updateBoard,
    deleteBoard
} from '../controllers/boardController.js';
import authMiddleware from '../middlewares/auth.js';
import express from 'express';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// All board routes require authentication
router.use(authMiddleware);

// GET /api/boards/workspace/:workspaceId — fetch boards for a specific workspace
router.get('/workspace/:workspaceId', getBoardsByWorkspace);

// POST /api/boards — create a board
router.post('/', createBoard);

// GET /api/boards — get all boards (admin)
router.get('/', authorize('Admin'), getAllBoards);

// GET /api/boards/:id
router.get('/:id', getBoardById);

// PUT /api/boards/:id
router.put('/:id', updateBoard);

// DELETE /api/boards/:id
router.delete('/:id', deleteBoard);

export default router;
