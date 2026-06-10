import express from "express";
import {
    getUsers,
    getUsersByEmail,
    getUserById,
    getUserInfo,
    updateUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", authorize("Admin"), getUsers);

router.get("/me", getUserInfo);

router.get("/email/:email", getUsersByEmail);

router.get("/:id", authorize("Admin"), getUserById);

router.patch("/me", updateUser);

export default router;