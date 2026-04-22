"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGroupStore } from "@/store/groupStore";
import { useAuthStore } from "@/store/authStore";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import InviteModal from "@/components/groups/InviteModal";
import { Trash2, Users, LogOut, ChevronRight } from "lucide-react";
import axios from "@/lib/axios";

export default function DashboardPage() {
  const { groups, fetchGroups, groupsLoading } = useGroupStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const deleteGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    await axios.delete(`/groups/${groupId}`);
    fetchGroups();
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <span className="font-display text-xl font-bold">
            Split<span className="text-primary">Ease</span>
          </span>

          <div className="flex items-center gap-4">
            <CreateGroupModal />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-8 mt-16">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your expense groups
          </p>
        </div>

        {groupsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl h-44 animate-pulse"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.08] rounded-2xl gap-4">
            <Users className="w-10 h-10 text-gray-600" />
            <p className="text-gray-500 text-sm">No groups yet</p>
            <CreateGroupModal triggerLabel="Create your first group" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="group/card bg-[#0e0e1a] border border-white/[0.07] hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 transition-all"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{group.name}</h3>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {group.members.length} member
                      {group.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {group.createdBy === user?.id && (
                    <button
                      onClick={(e) => deleteGroup(e, group.id)}
                      className="opacity-0 group-hover/card:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Member avatars */}
                <div className="flex gap-1.5">
                  {group.members.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      title={m.name}
                      className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300"
                    >
                      {m.name[0].toUpperCase()}
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] text-gray-400">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/[0.05]" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <InviteModal groupId={group.id} groupName={group.name} />
                  <button
                    onClick={() => router.push(`/dashboard/groups/${group.id}`)}
                    className="flex items-center gap-1 text-indigo-400 text-xs font-medium hover:gap-1.5 transition-all"
                  >
                    Open <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
