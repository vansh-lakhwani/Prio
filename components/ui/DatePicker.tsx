"use client";

import { useState } from "react";
import { format, addDays, nextMonday } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import "react-day-picker/dist/style.css"; // Basic styles, overridden below

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: "Today", date: new Date() },
    { label: "Tomorrow", date: addDays(new Date(), 1) },
    { label: "Next Monday", date: nextMonday(new Date()) },
    { label: "In 3 Days", date: addDays(new Date(), 3) },
  ];

  return (
    <Popover className="relative w-full">
      <div className="flex items-center gap-2 w-full bg-[#18221d]/5 border border-outline/10 rounded-xl transition-colors focus-within:border-kinetic/50 px-3">
         <PopoverButton 
           className="flex-1 flex items-center justify-between py-2.5 text-left focus:outline-none"
           onClick={() => setIsOpen(!isOpen)}
         >
           <div className="flex items-center gap-2 text-foreground/80">
             <CalendarIcon className="w-4 h-4 opacity-50" />
             <span className="text-sm">{value ? format(value, "PPP") : "Set due date..."}</span>
           </div>
         </PopoverButton>
         {value && (
            <button type="button" onClick={() => onChange(null)} className="p-1 hover:bg-[#18221d]/10 rounded-full transition-colors text-foreground/40 hover:text-foreground">
               <X className="w-3.5 h-3.5" />
            </button>
         )}
      </div>

      <PopoverPanel className="absolute z-50 mt-2 p-4 bg-surface rounded-2xl shadow-2xl flex md:flex-row flex-col gap-4 transform origin-top-left transition">
        
        {/* Presets Sidebar */}
        <div className="flex flex-col gap-1 md:border-r border-outline/10 md:pr-4 md:min-w-[140px]">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2">Quick Presets</h4>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="text-left text-sm py-1.5 px-3 rounded-lg hover:bg-[#18221d]/5 transition-colors text-foreground/80 hover:text-kinetic"
              onClick={() => {
                onChange(preset.date);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Calendar via React Day Picker */}
        <div className="custom-calendar flex-1">
          <DayPicker
            mode="single"
            selected={value || undefined}
            onSelect={(d) => {
               if (d) onChange(d);
            }}
            showOutsideDays
            className="m-0"
            classNames={{
               root: "text-sm",
               months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
               month: "space-y-4",
               caption: "flex justify-between items-center",
               caption_label: "text-sm font-semibold",
               nav: "flex items-center gap-1",
               nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-[#18221d]/10",
               table: "w-full border-collapse space-y-1",
               head_row: "flex w-full mb-2",
               head_cell: "text-foreground/50 rounded-md w-9 font-normal text-[0.8rem]",
               row: "flex w-full mt-2",
               cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 w-9",
               day: "h-9 w-9 p-0 font-normal rounded-lg aria-selected:opacity-100 hover:bg-[#18221d]/10 focus:outline-none transition-colors",
               day_selected: "bg-kinetic text-background font-bold hover:bg-kinetic focus:bg-kinetic",
               day_today: "text-kinetic font-bold",
               day_outside: "text-foreground/30 opacity-50",
            }}
          />
        </div>
      </PopoverPanel>
    </Popover>
  );
}



