import { Response } from "express";
import { AuthenticatedRequest } from "../types/authTypes.js";
import db from "../lib/db.js";
import { calculateNetBalances, simplifyDebts, round } from "../helpers/balanceHelper.js";

// Generate Settlements
export const generateSettlements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user!.id;

    const member = await db.groupMember.findFirst({ where: { groupId, userId } });
    if (!member) {
      return res.status(403).json({ success: false, message: "You are not a member of this group" });
    }

    const expenses = await db.expense.findMany({
      where: { groupId },
      include: { splits: true },
    });

    if (expenses.length === 0) {
      return res.status(200).json({ success: true, balanceSummary: [], settlements: [] });
    }

    const members = await db.groupMember.findMany({ where: { groupId } });
    const balances = calculateNetBalances(expenses);
    const rawSettlements = simplifyDebts(balances);

    // Get already settled fromId→toId pairs
    const settledRecords = await db.settlement.findMany({
      where: { groupId, status: "SETTLED" },
    });
    const settledPairs = new Set(
      settledRecords.map((s) => `${s.fromId}-${s.toId}`)
    );

    // Filter out pairs that are already settled
    const newPendingSettlements = rawSettlements.filter(
      (s) => !settledPairs.has(`${s.fromId}-${s.toId}`)
    );

    await db.$transaction(async (tx) => {
      await tx.settlement.deleteMany({ where: { groupId, status: "PENDING" } });

      if (newPendingSettlements.length > 0) {
        await tx.settlement.createMany({
          data: newPendingSettlements.map((s) => ({
            groupId,
            fromId: s.fromId,
            toId: s.toId,
            amount: s.amount,
            status: "PENDING",
          })),
        });
      }
    });

    // Return full DB state
    const allSettlements = await db.settlement.findMany({
      where: { groupId },
      include: { from: true, to: true },
      orderBy: { createdAt: "desc" },
    });

    const balanceSummary = members.map((m) => ({
      memberId: m.id,
      memberName: m.name,
      netBalance: round(balances.get(m.id) ?? 0),
    }));

    return res.status(200).json({
      success: true,
      message: "Settlements generated successfully",
      balanceSummary,
      settlements: allSettlements,
    });
  } catch (error) {
    console.error("Error generating settlements:", error);
    return res.status(500).json({ success: false, message: "Error generating settlements" });
  }
};

// Get Settlements
export const getSettlements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId } = req.params as { groupId: string };
    const userId = req.user!.id;

    const member = await db.groupMember.findFirst({ where: { groupId, userId } });
    if (!member) {
      return res.status(403).json({ success: false, message: "You are not a member of this group" });
    }

    const settlements = await db.settlement.findMany({
      where: { groupId },
      include: { from: true, to: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, settlements });
  } catch (error) {
    console.error("Error fetching settlements:", error);
    return res.status(500).json({ success: false, message: "Error fetching settlements" });
  }
};

// Mark Settlement as Settled
export const markSettled = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settlementId, groupId } = req.params as { settlementId: string; groupId: string };
    const userId = req.user!.id;

    const settlement = await db.settlement.findFirst({
      where: { id: settlementId, groupId },
    });

    if (!settlement) {
      return res.status(404).json({ success: false, message: "Settlement not found" });
    }
    if (settlement.status === "SETTLED") {
      return res.status(400).json({ success: false, message: "Already settled" });
    }

    const requestingMember = await db.groupMember.findFirst({ where: { groupId, userId } });
    if (!requestingMember) {
      return res.status(403).json({ success: false, message: "Not a member" });
    }

    const isDebtor = settlement.fromId === requestingMember.id;
    const isAdmin = requestingMember.role === "ADMIN";
    if (!isDebtor && !isAdmin) {
      return res.status(403).json({ success: false, message: "Only the payer or admin can mark this settled" });
    }

    const updated = await db.settlement.update({
      where: { id: settlementId },
      data: { status: "SETTLED" },
      include: { from: true, to: true },
    });

    return res.status(200).json({ success: true, settlement: updated });
  } catch (error) {
    console.error("Error marking settlement:", error);
    return res.status(500).json({ success: false, message: "Error marking settlement" });
  }
};

// Unmark Settlement (receiver or admin only)
export const unmarkSettled = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settlementId, groupId } = req.params as { settlementId: string; groupId: string };
    const userId = req.user!.id;

    const settlement = await db.settlement.findFirst({
      where: { id: settlementId, groupId },
    });

    if (!settlement) {
      return res.status(404).json({ success: false, message: "Settlement not found" });
    }
    if (settlement.status !== "SETTLED") {
      return res.status(400).json({ success: false, message: "Settlement is not settled" });
    }

    const requestingMember = await db.groupMember.findFirst({ where: { groupId, userId } });
    if (!requestingMember) {
      return res.status(403).json({ success: false, message: "Not a member" });
    }

    const isReceiver = settlement.toId === requestingMember.id;
    const isAdmin = requestingMember.role === "ADMIN";
    if (!isReceiver && !isAdmin) {
      return res.status(403).json({ success: false, message: "Only the receiver or admin can undo this" });
    }

    const updated = await db.settlement.update({
      where: { id: settlementId },
      data: { status: "PENDING" },
      include: { from: true, to: true },
    });

    return res.status(200).json({ success: true, settlement: updated });
  } catch (error) {
    console.error("Error unsettling:", error);
    return res.status(500).json({ success: false, message: "Error unsettling" });
  }
};