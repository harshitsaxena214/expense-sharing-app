import { Response } from "express";
import { AuthenticatedRequest } from "../types/authTypes.js";
import db from "../lib/db.js";

export const addExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user!.id;

    // Already validated by zod — safe to destructure directly
    const { title, amount, paidByMemberId, splitMemberIds } = req.body;

    // Find requesting user's membership
    const requestingMember = await db.groupMember.findFirst({
      where: { groupId, userId },
    });

    if (!requestingMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    // Non-admin can only add expense paid by themselves
    if (
      requestingMember.role !== "ADMIN" &&
      requestingMember.id !== paidByMemberId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only add expenses paid by yourself",
      });
    }

    // Verify paidByMemberId belongs to this group
    const paidByMember = await db.groupMember.findFirst({
      where: { id: paidByMemberId, groupId },
    });

    if (!paidByMember) {
      return res.status(404).json({
        success: false,
        message: "Paying member not found in this group",
      });
    }

    // Verify all splitMemberIds belong to this group
    const splitMembers = await db.groupMember.findMany({
      where: { id: { in: splitMemberIds }, groupId },
    });

    if (splitMembers.length !== splitMemberIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more split members not found in this group",
      });
    }

    // Create expense + splits in a transaction
    const expense = await db.$transaction(async (tx) => {
      const newExpense = await tx.expense.create({
        data: {
          title,
          amount,
          groupId,
          paidById: paidByMemberId,
          splits: {
            create: splitMemberIds.map((memberId: string) => ({
              memberId,
            })),
          },
        },
        include: {
          paidBy: true,
          splits: {
            include: { member: true },
          },
        },
      });

      return newExpense;
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding expense",
    });
  }
};

// ─── Get All Expenses for a Group ─────────────────────────────────────────────
export const getGroupExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user!.id;

    const member = await db.groupMember.findFirst({
      where: { groupId, userId },
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const expenses = await db.expense.findMany({
      where: { groupId },
      include: {
        paidBy: true,
        splits: {
          include: { member: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses",
    });
  }
};

// ─── Delete Expense (Admin only) ──────────────────────────────────────────────
export const deleteExpense = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { expenseId, groupId } = req.params as {
      expenseId: string;
      groupId: string;
    };
    const userId = req.user!.id;

    const expense = await db.expense.findFirst({
      where: { id: expenseId, groupId },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // isAdmin middleware already verified admin access
    // Delete splits first then expense in a transaction
    await db.$transaction([
      db.split.deleteMany({ where: { expenseId } }),
      db.expense.delete({ where: { id: expenseId } }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting expense",
    });
  }
};
