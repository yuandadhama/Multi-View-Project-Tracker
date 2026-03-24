import React, { createContext, useContext, useReducer, useMemo } from "react";
import type { Task, Filters, ViewType } from "../types";
import { generateTasks } from "../data/generator";
import { applyFilters, parseFiltersFromURL, EMPTY_FILTERS } from "../utils";

interface AppState {
  tasks: Task[];
  filters: Filters;
  view: ViewType;
}

const initialState: AppState = {
  tasks: generateTasks(500),
  filters: parseFiltersFromURL(),
  view: "kanban",
};

type Action =
  | { type: "SET_TASK_STATUS"; id: string; status: Task["status"] }
  | { type: "SET_FILTERS"; filters: Filters }
  | { type: "SET_VIEW"; view: ViewType }
  | { type: "CLEAR_FILTERS" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_TASK_STATUS":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, status: action.status } : t,
        ),
      };
    case "SET_FILTERS":
      return { ...state, filters: action.filters };
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "CLEAR_FILTERS":
      return { ...state, filters: EMPTY_FILTERS };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  filteredTasks: Task[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredTasks = useMemo(
    () => applyFilters(state.tasks, state.filters),
    [state.tasks, state.filters],
  );

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTasks }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppProvider");
  return ctx;
}
