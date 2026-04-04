"use client";

import { useState, KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, X } from "lucide-react";
import axios from "@/lib/axios";
import { useGroupStore } from "@/store/groupStore";

type Props = { groupId: string };

export default function AddGhostMemberModal({ groupId }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchGroupDetail = useGroupStore((s) => s.fetchGroupDetail);

  const addTag = (value: string) => {
    const name = value.trim();
    if (name && !members.includes(name)) {
      setMembers((prev) => [...prev, name]);
    }
    setInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(",")) {
      addTag(val.slice(0, -1));
    } else {
      setInput(val);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "") {
      setMembers((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (name: string) => {
    setMembers((prev) => prev.filter((n) => n !== name));
  };

  const handleClose = () => {
    setMembers([]);
    setInput("");
    setError("");
    setOpen(false);
  };

  const onSubmit = async () => {
    const remaining = input.trim();
    const allMembers =
      remaining && !members.includes(remaining)
        ? [...members, remaining]
        : members;

    if (allMembers.length === 0) {
      setError("Add at least one member name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await Promise.all(
        allMembers.map((name) =>
          axios.post(`/groups/${groupId}/ghost`, { name })
        )
      );
      await fetchGroupDetail(groupId);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : setOpen(true))}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#13131a] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add offline members
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-400 -mt-1">
          Add members who don&apos;t have an account. They can be included in
          expense splits.
        </p>

        <div className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">
              Names{" "}
              <span className="text-gray-600 text-xs">(separate by comma)</span>
            </label>

            {/* Tag input */}
            <div
              className="min-h-[42px] flex flex-wrap gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-indigo-500 transition-colors cursor-text"
              onClick={() => document.getElementById("ghost-input")?.focus()}
            >
              {members.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs px-2 py-0.5 rounded-full"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeTag(name)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                id="ghost-input"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={members.length === 0 ? "e.g. Rahul, Priya, Sam" : ""}
                className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
            </div>
            <p className="text-xs text-gray-600">
              Press <kbd className="bg-white/10 px-1 rounded">Enter</kbd> or{" "}
              <kbd className="bg-white/10 px-1 rounded">,</kbd> after each name
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-white/10 hover:border-white/20 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {loading ? "Adding..." : "Add Members"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}