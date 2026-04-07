"use client";

import { Subtask } from "@/types/dashboard";
import { Plus, X, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface SubtaskListProps {
  value: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}

export function SubtaskList({ value, onChange }: SubtaskListProps) {
  const addSubtask = () => {
    onChange([...value, { id: uuidv4(), title: "", completed: false }]);
  };

  const updateSubtask = (id: string, title: string) => {
    onChange(value.map(st => st.id === id ? { ...st, title } : st));
  };

  const toggleSubtask = (id: string) => {
    onChange(value.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const removeSubtask = (id: string) => {
    onChange(value.filter(st => st.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((st, index) => (
        <div key={st.id} className="flex items-center gap-2 group">
          <button type="button" className="cursor-grab active:cursor-grabbing text-foreground/20 hover:text-foreground/50 transition">
            <GripVertical className="w-4 h-4" />
          </button>
          
          <button 
             type="button"
             onClick={() => toggleSubtask(st.id)}
             className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${st.completed ? 'bg-kinetic border-kinetic/50' : 'border-outline/10 hover:border-kinetic/50'}`}
          >
             {st.completed && <div className="w-2.5 h-2.5 bg-background rounded-full" />}
          </button>
          
          <input
            type="text"
            value={st.title}
            onChange={(e) => updateSubtask(st.id, e.target.value)}
            placeholder="Subtask title..."
            className={`flex-1 bg-transparent border-b border-transparent focus:border-kinetic/50 focus:outline-none py-1 text-sm transition-all ${st.completed ? 'line-through text-foreground/40' : 'text-foreground'}`}
            autoFocus={st.title === ""}
          />
          
          <button 
             type="button" 
             onClick={() => removeSubtask(st.id)}
             className="opacity-0 group-hover:opacity-100 p-1 text-foreground/30 hover:text-red-500 transition-all"
          >
             <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubtask}
        className="flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-kinetic transition w-max mt-1 px-6"
      >
        <Plus className="w-4 h-4" /> Add Subtask
      </button>
    </div>
  );
}

