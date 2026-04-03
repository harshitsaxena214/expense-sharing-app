import express from "express";
import {
  createGhostUser,
  createGroup,
  getGroups,
} from "../controllers/groupControllers.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  generateInviteLink,
  joinViaInvite,
  previewInvite,
  revokeInviteLink,
} from "../controllers/inviteControllers.js";
import { validate } from "../middlewares/validate.js";
import {
  createGroupSchema,
  ghostMemberSchema,
} from "../schemas/groupSchema.js";

const groupRouter = express.Router();

groupRouter.post(
  "/create",
  authMiddleware,
  validate(createGroupSchema),
  createGroup,
);
groupRouter.get("/", authMiddleware, getGroups);
groupRouter.post(
  "/:groupId/ghost",
  authMiddleware,
  isAdmin,
  validate(ghostMemberSchema),
  createGhostUser,
);

groupRouter.post(
  "/:groupId/invite",
  authMiddleware,
  isAdmin,
  generateInviteLink,
);
groupRouter.delete(
  "/:groupId/invite",
  authMiddleware,
  isAdmin,
  revokeInviteLink,
);

groupRouter.get("/invite/:inviteToken", authMiddleware, previewInvite);
groupRouter.post("/invite/:inviteToken/join", authMiddleware, joinViaInvite);

export default groupRouter;
