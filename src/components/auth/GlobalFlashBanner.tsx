"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFlashFromCode } from "@/lib/auth/flash";

const toneStyles = {
  success: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
  },
  info: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
  },
} as const;

export function GlobalFlashBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const flashCode = searchParams.get("flash");
  const [dismissedCode, setDismissedCode] = useState<string | null>(null);

  const flash = useMemo(() => getFlashFromCode(flashCode), [flashCode]);

  if (!flash || flashCode === dismissedCode) return null;

  const style = toneStyles[flash.tone];

  return (
    <div
      style={{
        ...style,
        margin: "16px 24px 0",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{flash.title}</div>
        <div style={{ fontSize: 14 }}>{flash.message}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          setDismissedCode(flashCode);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("flash");
          const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
          router.replace(nextUrl, { scroll: false });
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
