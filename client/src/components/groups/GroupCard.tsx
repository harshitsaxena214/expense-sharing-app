"use client";

import { useRouter } from "next/navigation";
import { Group } from "@/types";
import { Trash2 } from "lucide-react";
import axios from "@/lib/axios";
import { useGroupStore } from "@/store/groupStore";

type Props = {
  group: Group;
};

export default function GroupCard({ group }: Props) {
  const router = useRouter();
  const fetchGroups = useGroupStore((s) => s.fetchGroups); // ← only change

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`/groups/${group.id}`);
      fetchGroups();
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/groups/${group.id}`)}
      className="bg-[#13131a] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-indigo-500/40 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-base">{group.name}</h3>
          <p className="text-gray-500 text-xs">
            {group.members.length} members
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        {group.members.slice(0, 5).map((m) => (
          <div
            key={m.id}
            title={m.name}
            className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-medium uppercase text-indigo-300"
          >
            {m.name[0]}
          </div>
        ))}
        {group.members.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-400">
            +{group.members.length - 5}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <p className="text-xs text-gray-500">by {group.creator.name}</p>
        <span className="text-indigo-400 text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
          Open Group →
        </span>
      </div>
    </div>
  );
}