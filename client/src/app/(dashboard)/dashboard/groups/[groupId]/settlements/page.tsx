"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGroupStore } from "@/store/groupStore";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function SettlementsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const {
    currentGroup,
    currentMember,
    settlements,
    balanceSummary,
    settlementsLoading,
    fetchGroupDetail,
    fetchSettlements,
    generateSettlements,
    markSettled,
    unmarkSettled,
  } = useGroupStore();

  useEffect(() => {
    fetchGroupDetail(groupId);
    fetchSettlements(groupId);
  }, [groupId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateSettlements(groupId);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkSettled = async (settlementId: string) => {
    await markSettled(groupId, settlementId);
  };

  const handleUnmarkSettled = async (settlementId: string) => {
    await unmarkSettled(groupId, settlementId);
  };

  const totalExpenses = settlements.reduce((sum, s) => sum + Number(s.amount), 0);
  const pending = settlements.filter((s) => s.status === "PENDING");
  const settled = settlements.filter((s) => s.status === "SETTLED");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <button
          onClick={() => router.push(`/dashboard/groups/${groupId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Group
        </button>
        <span className="font-bold text-lg">
          Sett<span className="text-indigo-400">Lix</span>
        </span>
        <div className="w-24" />
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">
            Settlement
          </p>
          <h1 className="text-3xl font-bold">{currentGroup?.name}</h1>
          <p className="text-gray-400 text-sm">
            Total: ₹{totalExpenses.toFixed(2)} across{" "}
            {currentGroup?.members.length ?? 0} members
          </p>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {generating && <Loader2 className="w-4 h-4 animate-spin" />}
          {generating ? "Generating..." : "Generate Settlements"}
        </button>

        {/* Settlements */}
        {settlementsLoading ? (
          <p className="text-gray-500 text-sm text-center">Loading...</p>
        ) : settlements.length === 0 ? (
          <div className="bg-[#13131a] border border-white/10 rounded-2xl p-10 text-center text-gray-500 text-sm">
            No settlements yet. Click "Generate Settlements" to calculate.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Pending */}
            {pending.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Pending
                </p>
                {pending.map((s) => {
                  const isDebtor = s.fromId === currentMember?.id;
                  const isAdmin = currentMember?.role === "ADMIN";
                  const canSettle = isDebtor || isAdmin;2

                  return (
                    <div
                      key={s.id}
                      className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{s.from.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{s.to.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{s.amount}</span>
                        {canSettle && (
                          <button
                            onClick={() => handleMarkSettled(s.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            Mark Settled
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Settled */}
            {settled.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Settled
                </p>
                {settled.map((s) => {
                  const isReceiver = s.toId === currentMember?.id;
                  const isAdmin = currentMember?.role === "ADMIN";
                  const canUnsettle = isReceiver || isAdmin;

                  return (
                    <div
                      key={s.id}
                      className="bg-[#13131a] border border-white/10 rounded-2xl p-4 flex items-center justify-between opacity-60"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span>{s.from.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                        <span>{s.to.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{s.amount}</span>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {canUnsettle && (
                          <button
                            onClick={() => handleUnmarkSettled(s.id)}
                            className="text-xs text-gray-500 hover:text-yellow-400 border border-white/10 hover:border-yellow-400/30 px-2.5 py-1 rounded-lg transition-all"
                          >
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Balance Summary */}
            {balanceSummary.length > 0 && (
              <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Balance Summary
                </p>
                {balanceSummary.map((b) => (
                  <div key={b.memberId} className="flex justify-between text-sm">
                    <span className="text-gray-300">{b.memberName}</span>
                    <span
                      className={
                        b.netBalance > 0
                          ? "text-green-400 font-medium"
                          : b.netBalance < 0
                          ? "text-red-400 font-medium"
                          : "text-gray-500"
                      }
                    >
                      {b.netBalance > 0
                        ? `+₹${b.netBalance}`
                        : b.netBalance < 0
                        ? `-₹${Math.abs(b.netBalance)}`
                        : "Settled up"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}