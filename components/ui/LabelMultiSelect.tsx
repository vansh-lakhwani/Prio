"use client";

import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Tag, X, Plus, Check } from "lucide-react";
import { TaskLabel } from "@/types/dashboard";

interface LabelMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

const fallbackLabels: TaskLabel[] = [
  { id: "l1", name: "Frontend", color: "border-blue-500/50 bg-blue-500/10 text-blue-100" },
  { id: "l2", name: "Bug", color: "border-red-500/50 bg-red-500/10 text-red-100" },
  { id: "l3", name: "Feature", color: "border-verdant-primary/50 bg-verdant-primary/10 text-verdant-primary" },
];

export function LabelMultiSelect({ value, onChange }: LabelMultiSelectProps) {
  const [labels, setLabels] = useState<TaskLabel[]>(fallbackLabels);
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");

  const selectedLabels = labels.filter((l) => value.includes(l.id));

  const toggleLabel = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <Popover className="relative w-full">
      <PopoverButton className="flex w-full min-h-[46px] items-center justify-between bg-[#18221d]/5 border border-outline/10 rounded-xl px-3 py-2 text-left focus:outline-none focus:border-kinetic/50 transition-colors">
        {selectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedLabels.map((l) => (
              <div 
                key={l.id} 
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${l.color}`}
                onClick={(e) => {
                   // Stop popover from toggling if clicking the chip remove specifically
                   e.stopPropagation();
                }}
              >
                {l.name}
                <button 
                  type="button" 
                  onClick={(e) => {
                     e.stopPropagation();
                     toggleLabel(l.id);
                  }} 
                  className="hover:brightness-200 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-foreground/40" />
            <span className="text-sm text-foreground/60">Select Labels...</span>
          </div>
        )}
      </PopoverButton>

      <PopoverPanel className="absolute z-50 w-full mt-2 p-2 bg-surface rounded-xl shadow-2xl flex flex-col gap-1 max-h-60 overflow-y-auto">
        {labels.map((lbl) => {
          const isSelected = value.includes(lbl.id);
          return (
            <button
              key={lbl.id}
              type="button"
              onClick={() => toggleLabel(lbl.id)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#18221d]/5 text-sm transition-colors"
            >
              <div className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${lbl.color}`}>
                 {lbl.name}
              </div>
              {isSelected && <Check className="w-4 h-4 text-kinetic" />}
            </button>
          )
        })}

        <div className="border-t border-outline/10 mt-1 pt-1">
          {isCreating ? (
             <div className="flex items-center p-1 gap-2">
               <input 
                 autoFocus
                 type="text" 
                 value={newLabelName}
                 onChange={(e) => setNewLabelName(e.target.value)}
                 className="flex-1 bg-[#18221d]/5 border border-outline/10 text-sm px-2 py-1 focus:outline-none focus:border-kinetic rounded"
                 placeholder="Label name... (press Enter to add)"
                 onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       e.preventDefault();
                       if (newLabelName.trim()) {
                         const nl = { id: `lx_${Date.now()}`, name: newLabelName, color: "border-outline/10 bg-[#18221d]/5 text-foreground" };
                         setLabels([...labels, nl]);
                         onChange([...value, nl.id]);
                       }
                       setIsCreating(false);
                       setNewLabelName("");
                    }
                 }}
               />
             </div>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/50 hover:text-kinetic transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Label
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}



