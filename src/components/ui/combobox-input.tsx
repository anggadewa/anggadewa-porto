import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ComboboxInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function ComboboxInput({ value, onChange, onEnter, options, placeholder, className, icon }: ComboboxInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on current input
  const filtered = options.filter(opt =>
    opt.toLowerCase().includes((filter || value || '').toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilter(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setFilter('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsOpen(true);
    setFilter('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && onEnter && value.trim()) {
      e.preventDefault();
      onEnter(value.trim());
      setFilter('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={filter !== '' && isOpen ? filter : value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "h-16 w-full rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-primary/50 focus:bg-white text-zinc-900 font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-sm outline-none",
            icon ? "pl-14 pr-12" : "pl-6 pr-12",
            className
          )}
        />
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); inputRef.current?.focus(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filtered.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(opt)}
                className={cn(
                  "w-full px-6 py-3.5 text-left text-[10px] font-black tracking-[0.2em] uppercase transition-all",
                  opt.toLowerCase() === (value || '').toLowerCase()
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
