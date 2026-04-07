"use client";

import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Folder, Plus, Check } from "lucide-react";
import { TaskCategory } from "@/types/dashboard";

interface CategorySelectProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

// Mock categories for now. Later fetched from Supabase.
const fallbackCategories: TaskCategory[] = [ // exported mock
  { id: "c1", name: "Engineering", color: "bg-blue-500" },
  { id: "c2", name: "Design", color: "bg-pink-500" },
  { id: "c3", name: "Marketing", color: "bg-amber-500" },
];

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<TaskCategory[]>(fallbackCategories);
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const selectedCat = categories.find(c => c.id === value);

  return (
    <Popover className="relative w-full">
      <PopoverButton className="flex w-full items-center justify-between bg-[#18221d]/5 border border-outline/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-kinetic/50 transition-colors">
        <div className="flex items-center gap-2">
           {selectedCat ? (
             <>
               <div className={`w-3 h-3 rounded-full ${selectedCat.color}`} />
               <span className="text-sm font-medium">{selectedCat.name}</span>
             </>
           ) : (
             <>
               <Folder className="w-4 h-4 text-foreground/40" />
               <span className="text-sm text-foreground/60">Select Category...</span>
             </>
           )}
        </div>
      </PopoverButton>

      <PopoverPanel className="absolute z-50 w-full mt-2 p-2 bg-surface rounded-xl shadow-2xl flex flex-col gap-1 max-h-60 overflow-y-auto">
        <button
          type="button"
          onClick={() => onChange(null)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#18221d]/5 text-sm transition-colors"
        >
          <span className="text-foreground/70 italic">None</span>
          {value === null && <Check className="w-4 h-4 text-kinetic" />}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#18221d]/5 text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-full ${cat.color}`} />
               <span>{cat.name}</span>
            </div>
            {value === cat.id && <Check className="w-4 h-4 text-kinetic" />}
          </button>
        ))}

        <div className="border-t border-outline/10 mt-1 pt-1">
          {isCreating ? (
             <div className="flex items-center p-1 gap-2">
               <input 
                 autoFocus
                 type="text" 
                 value={newCatName}
                 onChange={(e) => setNewCatName(e.target.value)}
                 className="flex-1 bg-[#18221d]/5 border border-outline/10 text-sm px-2 py-1 focus:outline-none focus:border-kinetic rounded"
                 placeholder="Name..."
               />
               <button 
                 type="button"
                 onClick={() => {
                   if (newCatName.trim()) {
                     const nc = { id: `cx_${Date.now()}`, name: newCatName, color: "bg-kinetic" };
                     setCategories([...categories, nc]);
                     onChange(nc.id);
                   }
                   setIsCreating(false);
                   setNewCatName("");
                 }}
                 className="text-xs bg-kinetic text-background px-2 py-1 font-bold rounded"
               >
                 Add
               </button>
             </div>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/50 hover:text-kinetic transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Category
            </button>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}



