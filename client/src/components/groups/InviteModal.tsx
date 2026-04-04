"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, Copy, Check, QrCode, RefreshCw } from "lucide-react";
import axios from "@/lib/axios";

type Props = {
  groupId: string;
  groupName: string;
};

export default function InviteModal({ groupId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateLink = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`/groups/${groupId}/invite`);
      // extract just the token in case FRONTEND_URL is wrong on backend
      const token = res.data.inviteLink.split("/invite/")[1];
      setInviteLink(`${window.location.origin}/invite/${token}`);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      // Reset state when modal closes
      setInviteLink("");
      setShowQR(false);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()} // prevent GroupCard click
          className="flex items-center gap-1.5 border border-white/10 hover:border-indigo-500/40 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <Link2 className="w-3 h-3" />
          Invite
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#13131a] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Invite to {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {!inviteLink ? (
            // ── No link yet ──────────────────────────────────────────────────
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-400">
                Generate an invite link to share with others. Anyone with the
                link can join this group.
              </p>
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                onClick={generateLink}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {loading ? "Generating..." : "Generate Invite Link"}
              </button>
            </div>
          ) : (
            // ── Link generated ───────────────────────────────────────────────
            <div className="flex flex-col gap-4">
              {/* Link input + copy */}
              <div className="flex gap-2">
                <input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none truncate"
                />
                <button
                  onClick={copyLink}
                  className="border border-white/10 hover:border-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* QR toggle */}
              <button
                onClick={() => setShowQR((p) => !p)}
                className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white transition-colors"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </button>

              {/* QR Code */}
              {showQR && (
                <div className="flex justify-center p-5 bg-white rounded-2xl">
                  <QRCodeSVG value={inviteLink} size={200} />
                </div>
              )}

              {/* Regenerate */}
              <button
                onClick={generateLink}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {loading ? "Regenerating..." : "Regenerate link"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
