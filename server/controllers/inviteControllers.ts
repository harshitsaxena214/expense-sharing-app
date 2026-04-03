import { Response } from "express";
import { AuthenticatedRequest } from "../types/authTypes.js";
import db from "../lib/db.js";
import crypto from "crypto";

export const generateInviteLink = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const groupId = req.params.groupId as string;

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.group.update({
      where: { id: groupId },
      data: { inviteToken, inviteExpiry },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${inviteToken}`;

    return res.status(200).json({
      success: true,
      message: "Invite link generated",
      inviteLink,
      expiresAt: inviteExpiry,
    });
  } catch (error) {
    console.error("Error generating invite link:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating invite link",
    });
  }
};

// ─── Preview Invite (show group info before joining) ──────────────────────────
export const previewInvite = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const inviteToken = req.params.inviteToken as string;

    const group = await db.group.findUnique({
      where: { inviteToken },
      select: {
        id: true,
        name: true,
        inviteExpiry: true,
        members: { select: { id: true } },
        creator: { select: { name: true } },
      },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    if (group.inviteExpiry && group.inviteExpiry < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Invite link has expired",
      });
    }

    return res.status(200).json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        memberCount: group.members.length,
        createdBy: group.creator.name,
        expiresAt: group.inviteExpiry,
      },
    });
  } catch (error) {
    console.error("Error previewing invite:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching invite details",
    });
  }
};

// ─── Join via Invite Token ─────────────────────────────────────────────────────
export const joinViaInvite = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const inviteToken = req.params.inviteToken as string;
    const userId = req.user!.id;

    const group = await db.group.findUnique({
      where: { inviteToken },
      include: { members: true },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link",
      });
    }

    if (group.inviteExpiry && group.inviteExpiry < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Invite link has expired",
      });
    }

    const alreadyMember = group.members.some((m) => m.userId === userId);
    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this group",
      });
    }

    const nameConflict = group.members.some(
      (m) =>
        m.userId === null &&
        m.name.toLowerCase() === req.user!.name.toLowerCase(),
    );

    const member = await db.groupMember.create({
      data: {
        name: nameConflict ? `${req.user!.name} (joined)` : req.user!.name,
        userId,
        groupId: group.id,
        role: "MEMBER",
      },
    });

    return res.status(201).json({
      success: true,
      message: `Joined "${group.name}" successfully`,
      member,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return res.status(500).json({
      success: false,
      message: "Error joining group",
    });
  }
};

export const revokeInviteLink = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const groupId = req.params.groupId as string;

    await db.group.update({
      where: { id: groupId },
      data: { inviteToken: null, inviteExpiry: null },
    });

    return res.status(200).json({
      success: true,
      message: "Invite link revoked",
    });
  } catch (error) {
    console.error("Error revoking invite link:", error);
    return res.status(500).json({
      success: false,
      message: "Error revoking invite link",
    });
  }
};
