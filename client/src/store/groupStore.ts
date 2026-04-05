import { create } from "zustand";
import axios from "@/lib/axios";
import { Group, Expense, Settlement, BalanceSummary } from "@/types";

type GroupStore = {
  // Dashboard
  groups: Group[];
  groupsLoading: boolean;
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  unmarkSettled: (groupId: string, settlementId: string) => Promise<void>;

  // Group detail
  currentGroup: Group | null;
  currentMember: { id: string; role: string } | null;
  expenses: Expense[];
  expensesLoading: boolean;
  fetchGroupDetail: (groupId: string) => Promise<void>;
  fetchExpenses: (groupId: string) => Promise<void>;
  addExpense: (
    groupId: string,
    data: {
      title: string;
      amount: number;
      paidByMemberId: string;
      splitMemberIds: string[];
    },
  ) => Promise<void>;

  // Settlements
  settlements: Settlement[];
  balanceSummary: BalanceSummary[];
  settlementsLoading: boolean;
  fetchSettlements: (groupId: string) => Promise<void>;
  generateSettlements: (groupId: string) => Promise<void>;
  markSettled: (groupId: string, settlementId: string) => Promise<void>;
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  // Dashboard
  groups: [],
  groupsLoading: false,

  fetchGroups: async () => {
    set({ groupsLoading: true });
    try {
      const res = await axios.get("/groups");
      set({ groups: res.data.groups });
    } finally {
      set({ groupsLoading: false });
    }
  },

  createGroup: async (name) => {
    const res = await axios.post("/groups/create", { name });
    set((s) => ({ groups: [res.data.group, ...s.groups] }));
  },

  // Group Detail
  currentGroup: null,
  currentMember: null,
  expenses: [],
  expensesLoading: false,

  fetchGroupDetail: async (groupId) => {
    const [groupRes, memberRes] = await Promise.all([
      axios.get("/groups"),
      axios.get(`/groups/${groupId}/me`),
    ]);
    const group = groupRes.data.groups.find((g: Group) => g.id === groupId);
    set({
      currentGroup: group ?? null,
      currentMember: memberRes.data.member,
    });
  },

  fetchExpenses: async (groupId) => {
    set({ expensesLoading: true });
    try {
      const res = await axios.get(`/groups/${groupId}/expenses`);
      set({ expenses: res.data.expenses });
    } finally {
      set({ expensesLoading: false });
    }
  },

  addExpense: async (groupId, data) => {
    const res = await axios.post(`/groups/${groupId}/expenses/add`, data);
    set((s) => ({ expenses: [res.data.expense, ...s.expenses] }));
  },

  // Settlements
  settlements: [],
  balanceSummary: [],
  settlementsLoading: false,

  fetchSettlements: async (groupId) => {
    set({ settlementsLoading: true });
    try {
      const res = await axios.get(`/groups/${groupId}/expenses/settlements`);
      set({ settlements: res.data.settlements });
    } finally {
      set({ settlementsLoading: false });
    }
  },

  generateSettlements: async (groupId) => {
    const res = await axios.post(
      `/groups/${groupId}/expenses/settlements/generate`,
    );
    set({
      settlements: res.data.settlements,
      balanceSummary: res.data.balanceSummary,
    });
  },

  markSettled: async (groupId, settlementId) => {
    await axios.patch(
      `/groups/${groupId}/expenses/settlements/${settlementId}/settle`,
    );
    set((s) => ({
      settlements: s.settlements.map((item) =>
        item.id === settlementId ? { ...item, status: "SETTLED" } : item,
      ),
    }));
  },

  unmarkSettled: async (groupId, settlementId) => {
    await axios.patch(
      `/groups/${groupId}/expenses/settlements/${settlementId}/unsettle`,
    );
    set((s) => ({
      settlements: s.settlements.map((item) =>
        item.id === settlementId ? { ...item, status: "PENDING" } : item,
      ),
    }));
  },
}));
