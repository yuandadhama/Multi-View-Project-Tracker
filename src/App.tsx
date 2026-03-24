import { useAppStore } from "./store/AppStore";
import { useCollabSim } from "./hooks/useCollabSim";
import { useUrlFilters } from "./hooks/useUrlFilters";
import { TopBar } from "./components/TopBar";
import { FilterBar } from "./components/filters/FilterBar";
import { KanbanView } from "./components/kanban/KanbanView";
import { ListView } from "./components/list/ListView";
import { TimelineView } from "./components/timeline/TimelineView";
import type { Filters, ViewType } from "./types";

function App() {
  const { state, dispatch, filteredTasks } = useAppStore();
  const presence = useCollabSim(state.tasks);

  // Sync filters to URL
  useUrlFilters(state.filters);

  function handleStatusChange(id: string, status: string) {
    dispatch({ type: "SET_TASK_STATUS", id, status: status as any });
  }

  function handleFiltersChange(filters: Filters) {
    dispatch({ type: "SET_FILTERS", filters });
  }

  function handleClearFilters() {
    dispatch({ type: "CLEAR_FILTERS" });
  }

  function handleViewChange(view: ViewType) {
    dispatch({ type: "SET_VIEW", view });
  }

  return (
    <div className="h-screen flex flex-col bg-bg text-ink font-body overflow-hidden">
      <TopBar
        view={state.view}
        onViewChange={handleViewChange}
        presence={presence}
        totalTasks={state.tasks.length}
        filteredCount={filteredTasks.length}
      />
      <FilterBar
        filters={state.filters}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />
      <main className="flex-1 flex flex-col min-h-0 pt-3">
        {state.view === "kanban" && (
          <KanbanView
            tasks={filteredTasks}
            presence={presence}
            onStatusChange={handleStatusChange}
          />
        )}
        {state.view === "list" && (
          <ListView
            tasks={filteredTasks}
            presence={presence}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
          />
        )}
        {state.view === "timeline" && <TimelineView tasks={filteredTasks} />}
      </main>
    </div>
  );
}

export default App;
