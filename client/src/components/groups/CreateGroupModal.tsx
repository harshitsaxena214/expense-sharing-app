"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGroupStore } from "@/store/groupStore";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Group name is required").max(50, "Too long"),
});
type Form = z.infer<typeof schema>;

export default function CreateGroupModal({
  triggerLabel = "New Group",
}: {
  triggerLabel?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const createGroup = useGroupStore((s) => s.createGroup);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try {
      setError("");
      await createGroup(data.name);
      reset();
      setOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to create group");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#13131a] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a new group
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-2"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Group name</label>
            <input
              {...register("name")}
              placeholder="e.g. Goa Trip, Flat Expenses"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { reset(); setOpen(false); }}
              className="flex-1 border border-white/10 hover:border-white/20 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}