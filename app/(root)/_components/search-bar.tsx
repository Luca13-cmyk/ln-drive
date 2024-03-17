"use client";
import { Button } from "@/components/ui/button";

import { useSearch } from "@/hooks/use-search";

import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const search = useSearch();

  return (
    <Button
      onClick={search.onOpen}
      className="text-muted-foreground text-xs gap-x-2"
      variant="outline"
      size="sm"
    >
      <SearchIcon className="h-4 w-4" />
      <p>Search</p>
    </Button>
  );
}
