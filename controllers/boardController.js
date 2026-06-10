import Board from '../models/Board.js';
import Task from '../models/Task.js';
import Workspace from '../models/Workspace.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper: ensure caller is a member/owner of the workspace
const ensureWorkspaceAccess = async (workspaceId, req) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new ApiError(404, 'Workspace not found');

    const userId = req.user?._id || req.user?.id;
    const isOwner = workspace.owner.toString() === userId?.toString();
    const isMember = workspace.members.some(m => m.toString() === userId?.toString());


    if (!isOwner && !isMember) {
        throw new ApiError(403, 'You do not have access to this workspace');
    }
    return workspace;
};

// POST /api/boards  — create a board inside a workspace
export const createBoard = asyncHandler(async (req, res) => {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
        throw new ApiError(400, 'Name and workspaceId are required');
    }

    await ensureWorkspaceAccess(workspaceId, req);

    const board = await Board.create({ name, workspaceId });

    return res
        .status(201)
        .json(new ApiResponse(201, board, 'Board created successfully'));
});

// GET /api/boards  — get all boards (admin use)
export const getAllBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find().populate('workspaceId', 'name');
    return res.status(200).json(new ApiResponse(200, boards, 'Boards fetched successfully'));
});

// GET /api/boards/workspace/:workspaceId  — boards scoped to a workspace
export const getBoardsByWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    await ensureWorkspaceAccess(workspaceId, req);
    const boards = await Board.find({ workspaceId }).sort({ createdAt: 1 });
    return res.status(200).json(new ApiResponse(200, boards, 'Boards fetched successfully'));
});

// GET /api/boards/:id
export const getBoardById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findById(id).populate('workspaceId', 'name');
    if (!board) throw new ApiError(404, 'Board not found');
    await ensureWorkspaceAccess(board.workspaceId, req);
    return res.status(200).json(new ApiResponse(200, board, 'Board fetched successfully'));
});

// PUT /api/boards/:id
export const updateBoard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const board = await Board.findById(id);
    if (!board) throw new ApiError(404, 'Board not found');
    await ensureWorkspaceAccess(board.workspaceId, req);

    board.name = name ?? board.name;
    await board.save();

    return res.status(200).json(new ApiResponse(200, board, 'Board updated successfully'));
});

// DELETE /api/boards/:id
export const deleteBoard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findById(id);
    if (!board) throw new ApiError(404, 'Board not found');
    await ensureWorkspaceAccess(board.workspaceId, req);

    // Cascade delete tasks belonging to this board
    await Task.deleteMany({ boardId: id });
    await Board.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, null, 'Board and its tasks deleted successfully'));
});