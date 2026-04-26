"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGroupStore } from "@/store/groupStore";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import AddGhostMemberModal from "@/components/groups/AddGhostMemberModal";
import { ArrowLeft } from "lucide-react";

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const {
    currentGroup,
    currentMember,
    expenses,
    expensesLoading,
    fetchGroupDetail,
    fetchExpenses,
  } = useGroupStore();

  useEffect(() => {
    fetchGroupDetail(groupId);
    fetchExpenses(groupId);
  }, [groupId]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const perPerson = currentGroup?.members.length
    ? totalExpenses / currentGroup.members.length
    : 0;

  if (!currentGroup)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  const isAdmin = currentMember?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-lg">
          Sett<span className="text-indigo-400">Lix</span>
        </span>
        <div className="w-16" />
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{currentGroup.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {currentGroup.members.length} member
              {currentGroup.members.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && <AddGhostMemberModal groupId={groupId} />}
            <AddExpenseModal
              groupId={groupId}
              members={currentGroup.members}
              currentMember={currentMember}
            />
            <button
              onClick={() =>
                router.push(`/dashboard/groups/${groupId}/settlements`)
              }
              className="border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Settlements
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Members
          </p>
          <div className="flex flex-wrap gap-2">
            {currentGroup.members.map((m) => (
              <div
                key={m.id}
                title={m.name}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1 pr-3 py-1"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase">
                  {m.name[0]}
                </div>
                <span className="text-sm text-gray-300">{m.name}</span>
                {!m.userId && (
                  <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">
                    offline
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Total Expenses", value: `₹${totalExpenses.toFixed(2)}` },
            { label: "Per Person", value: `₹${perPerson.toFixed(2)}` },
            { label: "Expenses Count", value: expenses.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#13131a] border border-white/10 rounded-2xl p-3 sm:p-5"
            >
              <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-bold mt-1 break-all">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Expenses */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Expenses
          </p>
          {expensesLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl h-16 animate-pulse"
                />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-[#13131a] border border-white/10 rounded-2xl p-10 text-center text-gray-500 text-sm">
              No expenses yet. Add one to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{expense.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">
                      Paid by {expense.paidBy.name} · split{" "}
                      {expense.splits.length} ways
                    </p>
                  </div>
                  <p className="font-semibold text-base sm:text-lg shrink-0">
                    ₹{Number(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}