"use client";

import { useState, useMemo } from "react";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3, AlignRight } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task } from "@/types/dashboard";
import { TaskBlock } from "./TaskBlock";
import { CalendarSidebar } from "./CalendarSidebar";
import { DndContext, DragOverlay, closestCenter, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { createPortal } from "react-dom";

type ViewMode = 'month' | 'week' | 'day';

// Internal component for dropping tasks onto specific date cells
const DroppableDayCell = ({ date, isCurrentMonth, isSelected, isTodayActive, tasks, onClick }: any) => {
  const dateStr = format(date, "yyyy-MM-dd");
  const { isOver, setNodeRef } = useDroppable({
    id: dateStr,
    data: { type: "Cell", date: dateStr }
  });

  return (
    <div 
      ref={setNodeRef}
      onClick={onClick}
      className={`min-h-[140px] p-3 flex flex-col transition-all duration-300 cursor-pointer group
        ${!isCurrentMonth ? 'bg-surface-low/30' : 'bg-surface-standard'}
        ${isOver ? 'bg-primary/5 ring-2 ring-primary ring-inset' : ''}
        ${isSelected ? 'bg-primary/5 shadow-inner' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
         <span className={`text-[13px] font-black font-display w-8 h-8 flex items-center justify-center rounded-xl transition-all
           ${isTodayActive ? 'bg-primary text-surface-lowest shadow-lg shadow-primary/20' : !isCurrentMonth ? 'text-foreground/20' : 'text-foreground/60 group-hover:text-primary'}
         `}>
            {format(date, "d")}
         </span>
         {tasks.length > 0 && <span className="text-[9px] font-black font-display bg-surface-highest/40 px-2 py-0.5 rounded-full text-foreground/40 uppercase tracking-widest">{tasks.length}</span>}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide">
        {tasks.map((task: Task) => (
          <TaskBlock key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export function CalendarView() {
  const { tasks, rescheduleTask } = useDashboardStore();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Derive tasks
  const tasksWithDates = useMemo(() => tasks.filter(t => t.due_date), [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const dropDateStr = over.id as string; // 'yyyy-MM-dd'

    const draggedTask = tasksWithDates.find(t => t.id === taskId);
    if (!draggedTask || !draggedTask.due_date) return;
    
    const existingStr = format(new Date(draggedTask.due_date), "yyyy-MM-dd");
    
    // Only dispatch Supabase transaction if date was fundamentally altered
    if (existingStr !== dropDateStr) {
       // Construct a new ISO string preserving the local time if there was one, shifting only the day.
       // For mock purposes, we will just use the YYYY-MM-DDT12:00:00Z format safely.
       const newDateStr = new Date(`${dropDateStr}T12:00:00.000Z`).toISOString();
       await rescheduleTask(taskId, newDateStr);
    }
  };

  const nextDate = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
  };

  const prevDate = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
  };

  // Month Render Logic
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    for (let i = 0; i < 7; i++) {
        days.push(
          <div key={i} className="text-center font-black text-[10px] text-foreground/30 py-4 uppercase tracking-[0.2em] font-display">
             {format(addDays(startDate, i), "EEE")}
          </div>
        );
    }
    const daysHeader = <div className="grid grid-cols-7 w-full bg-surface-low">{days}</div>;
    days = [];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        // Find tasks for this day
        const dayTasks = tasksWithDates.filter(t => 
           t.due_date && isSameDay(new Date(t.due_date), cloneDay)
        );

        days.push(
          <DroppableDayCell 
             key={cloneDay.toISOString()}
             date={cloneDay}
             isCurrentMonth={isSameMonth(cloneDay, monthStart)}
             isSelected={isSameDay(cloneDay, selectedDate)}
             isTodayActive={isToday(cloneDay)}
             tasks={dayTasks}
             onClick={() => setSelectedDate(cloneDay)}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 w-full flex-1" key={day.toString()}>{days}</div>);
      days = [];
    }

    return (
      <div className="flex flex-col h-full bg-surface-standard rounded-[2.5rem] overflow-hidden min-w-[700px] md:min-w-0 shadow-inner shadow-black/5">
        {daysHeader}
        <div className="flex flex-col flex-1 overflow-y-auto gap-[1px] bg-surface-highest/10">
          {rows}
        </div>
      </div>
    );
  };

  // Mocking Week/Day for scaffolding (they use strict vertical arrays rather than grids)
  const renderWeekView = () => (
    <div className="flex flex-1 items-center justify-center text-foreground/50 flex-col gap-4">
      <Rows3 className="w-12 h-12 opacity-20" />
      <p>Week View construction ongoing contextually mapping hour matrices.</p>
    </div>
  );

  const renderDayView = () => (
    <div className="flex flex-1 items-center justify-center text-foreground/50 flex-col gap-4">
      <AlignRight className="w-12 h-12 opacity-20" />
      <p>Day View construction ongoing handling exact hourly overlaps.</p>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="hidden lg:block">
        <CalendarSidebar 
          selectedDate={selectedDate} 
          onSelectDate={(d) => { setSelectedDate(d); setCurrentDate(d); }} 
        />
      </div>

      <div className="flex-1 flex flex-col h-full bg-background px-4 md:px-6 pt-6">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground min-w-[240px]">
              {viewMode === 'month' && format(currentDate, "MMMM yyyy")}
              {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate), "MMM d")}`}
              {viewMode === 'day' && format(currentDate, "MMMM d, yyyy")}
            </h2>
            <div className="flex items-center gap-1 bg-surface-low p-1.5 rounded-2xl">
              <button onClick={prevDate} className="p-2 hover:bg-surface-highest rounded-xl transition text-foreground/40 hover:text-primary"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 font-bold font-display text-[10px] uppercase tracking-widest hover:bg-surface-highest rounded-xl transition text-foreground/50 hover:text-primary">Today</button>
              <button onClick={nextDate} className="p-2 hover:bg-surface-highest rounded-xl transition text-foreground/40 hover:text-primary"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="flex bg-surface-low p-1.5 rounded-2xl opacity-50 grayscale cursor-not-allowed" title="Week/Day views coming soon">
             <button className={`px-5 py-2 text-xs font-bold font-display uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all bg-primary text-surface-lowest shadow-lg shadow-primary/20`}><LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline">Month</span></button>
          </div>
        </div>

        {/* Matrix Container Wraps Context natively to prevent DOM detaching limits */}
        <div className="flex-1 min-h-0 w-full rounded-[2.5rem] overflow-x-auto md:overflow-hidden shadow-2xl shadow-black/20 scrollbar-hide">
          <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}

            {typeof document !== "undefined" && createPortal(
              <DragOverlay>
                {activeTask ? <TaskBlock task={activeTask} /> : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
