"use client";

import { useMemo, useState } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task, TaskStatus } from "@/types/dashboard";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

// "Review" removed — not a valid DB enum value
const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo",        title: "To Do"       },
  { id: "in_progress", title: "In Progress" },
  { id: "done",        title: "Done"        },
];

export function KanbanBoard() {
  const { tasks, setTasksOptimistic, syncTaskPositions } = useDashboardStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.status === col.id).sort((a, b) => a.position - b.position),
    }));
  }, [tasks]);

  // For progress stats (passed to Done column)
  const totalByStatus = useMemo(() => ({
    todo:        tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done:        tasks.filter(t => t.status === "done").length,
    review:      0,
  }), [tasks]);

  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId   = over.id   as string;
    if (activeId === overId) return;

    const isActiveTask  = active.data.current?.type === "Task";
    const isOverTask    = over.data.current?.type   === "Task";
    const isOverColumn  = over.data.current?.type   === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setTasksOptimistic((() => {
        const ai = tasks.findIndex(t => t.id === activeId);
        const oi = tasks.findIndex(t => t.id === overId);
        if (tasks[ai].status !== tasks[oi].status) {
          const tmp = [...tasks];
          tmp[ai] = { ...tmp[ai], status: tasks[oi].status };
          return arrayMove(tmp, ai, oi);
        }
        return tasks;
      })());
    }

    if (isOverColumn) {
      setTasksOptimistic((() => {
        const ai = tasks.findIndex(t => t.id === activeId);
        if (tasks[ai].status !== overId) {
          const tmp = [...tasks];
          tmp[ai] = { ...tmp[ai], status: overId as TaskStatus };
          return arrayMove(tmp, ai, ai);
        }
        return tasks;
      })());
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId   = over.id   as string;
    if (activeId === overId) return;

    if (active.data.current?.type === "Task") {
      setTasksOptimistic((() => {
        const ai = tasks.findIndex(t => t.id === activeId);
        let oi   = tasks.findIndex(t => t.id === overId);
        if (oi === -1) oi = tasks.filter(t => t.status === over.id).length;

        let newTasks = arrayMove(tasks, ai, oi).map((t, idx) => ({ ...t, position: idx }));
        syncTaskPositions(newTasks.map(t => ({ id: t.id, status: t.status, position: t.position })));
        return newTasks;
      })());
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }),
  };

  return (
    <div className="h-full w-full overflow-x-auto pb-4 scrollbar-hide px-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {/* 3 equal columns */}
        <div className="grid grid-cols-3 gap-5 h-full min-w-[720px]">
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              status={col.id}
              title={col.title}
              tasks={col.tasks}
              totalByStatus={totalByStatus}
            />
          ))}
        </div>

        {typeof document !== "undefined" && createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
