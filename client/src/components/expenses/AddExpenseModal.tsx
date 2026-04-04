"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Member } from "@/types";
import { useGroupStore } from "@/store/groupStore";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  amount: z.coerce.number().positive("Must be positive"),
  paidByMemberId: z.string().min(1, "Select who paid"),
  splitMemberIds: z.array(z.string()).min(1, "Select at least one member"),
});

type Form = z.infer<typeof schema>;

type Props = {
  groupId: string;
  members: Member[];
  currentMember: { id: string; role: string } | null;
};

export default function AddExpenseModal({ groupId, members, currentMember }: Props) {
  const [open, setOpen] = useState(false);
  const addExpense = useGroupStore((s) => s.addExpense);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      paidByMemberId: currentMember?.id ?? "",
      splitMemberIds: members.map((m) => m.id), // default: split among all
    },
  });

  const splitMemberIds = watch("splitMemberIds");

  const toggleSplitMember = (memberId: string) => {
    const current = splitMemberIds ?? [];
    const updated = current.includes(memberId)
      ? current.filter((id) => id !== memberId)
      : [...current, memberId];
    setValue("splitMemberIds", updated);
  };

  const onSubmit = async (data: Form) => {
    await addExpense(groupId, data);
    reset();
    setOpen(false);
  };

  // Non-admin can only pick themselves as payer
  const payerOptions =
    currentMember?.role === "ADMIN"
      ? members
      : members.filter((m) => m.id === currentMember?.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition-colors">
          + Add Expense
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#13131a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Title</label>
            <input
              {...register("title")}
              placeholder="e.g. Dinner"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Amount (₹)</label>
            <input
              {...register("amount")}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
          </div>

          {/* Paid by */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Paid by</label>
            <select
              {...register("paidByMemberId")}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {payerOptions.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#13131a]">
                  {m.name}
                </option>
              ))}
            </select>
            {errors.paidByMemberId && (
              <p className="text-red-400 text-xs">{errors.paidByMemberId.message}</p>
            )}
          </div>

          {/* Split among */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Split among</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleSplitMember(m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    splitMemberIds?.includes(m.id)
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            {errors.splitMemberIds && (
              <p className="text-red-400 text-xs">{errors.splitMemberIds.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}