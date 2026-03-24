"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  featureId: string;
  currentStatus: string;
  productSlug: string;
}

export function BoardActions({ featureId, currentStatus, productSlug }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string | null) => {
    if (newStatus === null) return;
    setStatus(newStatus);

    try {
      await fetch(`/api/products/${productSlug}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: featureId, status: newStatus }),
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      setStatus(currentStatus);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="planned">Planned</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="declined">Declined</SelectItem>
      </SelectContent>
    </Select>
  );
}
