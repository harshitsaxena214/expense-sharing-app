// Types 
export type ExpenseWithSplits = {
  amount: any;
  paidById: string;
  splits: { memberId: string }[];
};

export type RawSettlement = {
  fromId: string;
  toId: string;
  amount: number;
};