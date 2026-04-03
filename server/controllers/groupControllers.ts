import { Request, Response } from "express";
import db from "../lib/db.js";
import { AuthenticatedRequest } from "../types/authTypes.js";

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name } = req.body;
    const userId = req.user.id;

    const group = await db.group.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: {
            name: req.user.name,
            userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating group",
    });
  }
};

export const getGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: true,
        creator: true,
      },
    });
    return res.status(200).json({
      success: true,
      groups,
      message: "Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching group:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createGhostUser = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId as string;
    const { name } = req.body;

    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const existingMember = group.members.find(
      (m) => m.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member with this name already exists",
      });
    }

    const member = await db.groupMember.create({
      data: {
        name: name.trim(),
        groupId,
        userId: null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Ghost member created successfully",
      member,
    });
  } catch (error) {
    console.error("Error creating ghost member:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating ghost member",
    });
  }
};
