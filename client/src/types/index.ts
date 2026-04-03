export type User = {
  id: string;
  name: string;
  email: string;
};

export type Member = {
  id: string;
  name: string;
  role: "ADMIN" | "MEMBER";
  userId: string | null;
};

export type Group = {
  id: string;
  name: string;
  createdBy: string;
  creator: { name: string };
  members: Member[];
  createdAt: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: Member;
  splits: { id: string; member: Member }[];
  createdAt: string;
};

export type Settlement = {
  id: string;
  fromId: string;
  from: Member;
  toId: string;
  to: Member;
  amount: number;
  status: "PENDING" | "SETTLED";
};

export type BalanceSummary = {
  memberId: string;
  memberName: string;
  netBalance: number;
};

export type InvitePreview = {
  id: string;
  name: string;
  memberCount: number;
  createdBy: string;
};