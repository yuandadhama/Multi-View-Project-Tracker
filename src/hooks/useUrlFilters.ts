import { useEffect } from "react";
import type { Filters } from "../types";
import { serializeFilters } from "../utils";

export function useUrlFilters(filters: Filters) {
  useEffect(() => {
    const qs = serializeFilters(filters);
    const newUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [filters]);
}
