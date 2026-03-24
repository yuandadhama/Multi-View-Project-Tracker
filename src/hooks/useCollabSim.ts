import { useState, useEffect, useRef } from "react";
import type { Task, Presence } from "../types";
import { USERS } from "../data/constants";

function rndInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SIM_USER_IDS = USERS.slice(0, 4).map((u) => u.id);

export function useCollabSim(tasks: Task[]): Presence {
  const [presence, setPresence] = useState<Presence>({});
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    // Seed initial positions
    const initial: Presence = {};
    SIM_USER_IDS.forEach((uid, i) => {
      const t = tasksRef.current[i * 20];
      if (t) initial[uid] = t.id;
    });
    setPresence(initial);

    const intervals = SIM_USER_IDS.map((uid) =>
      window.setInterval(
        () => {
          const tasks = tasksRef.current;
          if (!tasks.length) return;
          const newTask = tasks[rndInt(0, Math.min(tasks.length - 1, 120))];
          setPresence((prev) => ({ ...prev, [uid]: newTask.id }));
        },
        rndInt(3000, 7000),
      ),
    );

    return () => intervals.forEach(clearInterval);
  }, []);

  return presence;
}
