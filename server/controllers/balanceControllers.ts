import { Response } from "express";
import { AuthenticatedRequest } from "../types/authTypes.js";
import db from "../lib/db.js";
import {
  calculateNetBalances,
  simplifyDebts,
  round,
} from "../helpers/balanceHelper.js";

// Generate Settlements
export const generateSettlements = async (
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
      include: { splits: true },
    });

    if (expenses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No expenses found",
        balanceSummary: [],
        settlements: [],
      });
    }

    const members = await db.groupMember.findMany({
      where: { groupId },
    });

    const memberMap = new Map(members.map((m) => [m.id, m]));

    // Core calculation (delegated to helpers)
    const balances = calculateNetBalances(expenses);
    const rawSettlements = simplifyDebts(balances);

    // Attach member names to settlements
    const settlements = rawSettlements.map((s) => ({
      fromId: s.fromId,
      fromName: memberMap.get(s.fromId)?.name ?? "Unknown",
      toId: s.toId,
      toName: memberMap.get(s.toId)?.name ?? "Unknown",
      amount: s.amount,
    }));

    // Balance summary for all members
    const balanceSummary = members.map((m) => ({
      memberId: m.id,
      memberName: m.name,
      netBalance: round(balances.get(m.id) ?? 0),
    }));

    // Persist: clear old PENDING, save new ones atomically
    await db.$transaction(async (tx) => {
      await tx.settlement.deleteMany({
        where: { groupId, status: "PENDING" },
      });

      if (rawSettlements.length > 0) {
        await tx.settlement.createMany({
          data: rawSettlements.map((s) => ({
            groupId,
            fromId: s.fromId,
            toId: s.toId,
            amount: s.amount,
            status: "PENDING",
          })),
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Settlements generated successfully",
      balanceSummary,
      settlements,
    });
  } catch (error) {
    console.error("Error generating settlements:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating settlements",
    });
  }
};

// Get Settlements
export const getSettlements = async (
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

    const settlements = await db.settlement.findMany({
      where: { groupId },
      include: {
        from: true,
        to: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      settlements,
    });
  } catch (error) {
    console.error("Error fetching settlements:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching settlements",
    });
  }
};

// Mark Settlement as Settled
export const markSettled = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settlementId, groupId } = req.params as {
      settlementId: string;
      groupId: string;
    };
    const userId = req.user!.id;

    const settlement = await db.settlement.findFirst({
      where: { id: settlementId, groupId },
      include: { from: true },
    });

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: "Settlement not found",
      });
    }

    if (settlement.status === "SETTLED") {
      return res.status(400).json({
        success: false,
        message: "Settlement is already marked as settled",
      });
    }

    const requestingMember = await db.groupMember.findFirst({
      where: { groupId, userId },
    });

    if (!requestingMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const isDebtor = settlement.fromId === requestingMember.id;
    const isAdmin = requestingMember.role === "ADMIN";

    if (!isDebtor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the payer or an admin can mark this as settled",
      });
    }

    const updated = await db.settlement.update({
      where: { id: settlementId },
      data: { status: "SETTLED" },
      include: { from: true, to: true },
    });

    return res.status(200).json({
      success: true,
      message: "Settlement marked as settled",
      settlement: updated,
    });
  } catch (error) {
    console.error("Error marking settlement:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking settlement",
    });
  }
};
