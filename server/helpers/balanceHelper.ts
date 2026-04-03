import { ExpenseWithSplits, RawSettlement } from "../types/balanceTypes.js";

// Calculate Net Balances
// positive balance = others owe this member
// negative balance = this member owes others
export const calculateNetBalances = (
  expenses: ExpenseWithSplits[],
): Map<string, number> => {
  const balances = new Map<string, number>();

  const get = (id: string) => balances.get(id) ?? 0;

  for (const expense of expenses) {
    const amount = Number(expense.amount);
    const splitCount = expense.splits.length;

    if (splitCount === 0) continue;

    const sharePerPerson = amount / splitCount;

    // Payer gets credited the full amount
    balances.set(expense.paidById, get(expense.paidById) + amount);

    // Each split member gets debited their share
    for (const split of expense.splits) {
      balances.set(split.memberId, get(split.memberId) - sharePerPerson);
    }
  }

  return balances;
};

// Simplify Debts
// Greedy algorithm — minimizes number of transactions needed
export const simplifyDebts = (
  balances: Map<string, number>,
): RawSettlement[] => {
  const settlements: RawSettlement[] = [];

  const creditors: { id: string; amount: number }[] = []; // owed money
  const debtors: { id: string; amount: number }[] = []; // owe money

  for (const [id, balance] of balances.entries()) {
    const rounded = round(balance);
    if (rounded > 0.01) creditors.push({ id, amount: rounded });
    else if (rounded < -0.01) debtors.push({ id, amount: Math.abs(rounded) });
  }

  let i = 0; // creditor pointer
  let j = 0; // debtor pointer

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = round(Math.min(creditor.amount, debtor.amount));

    if (settleAmount > 0.01) {
      settlements.push({
        fromId: debtor.id, // debtor pays
        toId: creditor.id, // creditor receives
        amount: settleAmount,
      });
    }

    creditor.amount = round(creditor.amount - settleAmount);
    debtor.amount = round(debtor.amount - settleAmount);

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

// Utility
export const round = (value: number): number => Math.round(value * 100) / 100;
