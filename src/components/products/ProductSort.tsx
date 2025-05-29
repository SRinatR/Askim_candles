"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest Arrivals" },
];

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "relevance") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
