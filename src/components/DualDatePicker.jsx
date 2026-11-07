import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, AlertCircle, X, Sparkles } from 'lucide-react';
import {
  format,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday as checkIsToday
} from 'date-fns';
import { parseUserDate, formatToStorageDate, getQuickDates } from '../utils/dateUtils';

/**
 * DualDatePicker:
 * Satisfies Constraint 1: "The calendar can be choosen by typing manually or selecting it"
 * - Direct text typing with real-time format parsing (YYYY-MM-DD, DD/MM/YYYY, etc.)
 * - Interactive visual calendar dropdown popover with month view & quick presets
 */
export default function DualDatePicker({
  value = '',
  onChange,
  label = 'Select Date',
  placeholder = 'YYYY-MM-DD or DD/MM/YYYY',
  id = 'date-picker',
  helperText = '',
  minDate = null,
  required = false
}) {
  // Raw text inside the input field so user can type freely
  const [typedText, setTypedText] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseUserDate(value);
    return parsed || new Date();
  });

  const containerRef = useRef(null);

  // Sync when prop value changes from outside
  useEffect(() => {
    if (value) {
      setTypedText(value);
      const parsed = parseUserDate(value);
      if (parsed) {
        setViewDate(parsed);
        setValidationError('');
      }
    } else {
      setTypedText('');
    }
  }, [value]);

  // Close calendar popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle user manual text typing
  const handleTextChange = (e) => {
    const text = e.target.value;
    setTypedText(text);

    if (!text.trim()) {
      if (required) {
        setValidationError('Date is required');
      } else {
        setValidationError('');
      }
      onChange('');
      return;
    }

    const parsed = parseUserDate(text);
    if (parsed) {
      setValidationError('');
      const storageDate = formatToStorageDate(parsed);
      setViewDate(parsed);
      onChange(storageDate);
    } else {
      setValidationError('Unrecognized date format. Try YYYY-MM-DD or DD/MM/YYYY');
    }
  };

  // Handle selecting a date from the visual calendar popover
  const handleSelectDate = (date) => {
    const formatted = formatToStorageDate(date);
    setTypedText(formatted);
    setValidationError('');
    setViewDate(date);
    onChange(formatted);
    setIsOpen(false);
  };

  const selectedDateObj = parseUserDate(value || typedText);

  // Generate calendar days for the current viewDate month
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const quickDates = getQuickDates();

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input Field with Dual Action: Type directly OR click Calendar icon */}
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={typedText}
          onChange={handleTextChange}
          placeholder={placeholder}
          aria-label={label}
          className={`w-full pl-3.5 pr-20 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            validationError
              ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/20 shadow-sm'
          }`}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {typedText && (
            <button
              type="button"
              onClick={() => {
                setTypedText('');
                setValidationError('');
                onChange('');
              }}
              title="Clear date"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Calendar Picker Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            title="Open calendar picker"
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              isOpen
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status & helper tips */}
      <div className="mt-1 flex items-center justify-between text-xs min-h-[18px]">
        {validationError ? (
          <span className="text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {validationError}
          </span>
        ) : selectedDateObj ? (
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Check className="w-3 h-3 flex-shrink-0" />
            {format(selectedDateObj, 'EEEE, MMM d, yyyy')}
          </span>
        ) : (
          <span className="text-slate-400">
            {helperText || 'Type manually or pick from calendar'}
          </span>
        )}
      </div>

      {/* Visual Interactive Calendar Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 right-0 sm:right-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header: Month and navigation */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm text-slate-800">
              {format(viewDate, 'MMMM yyyy')}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewDate(new Date())}
                className="px-2 py-1 text-xs font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b border-slate-100">
            {quickDates.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectDate(parseUserDate(item.value))}
                className="text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[11px] font-semibold text-slate-400">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = selectedDateObj && isSameDay(day, selectedDateObj);
              const isTodayDate = checkIsToday(day);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-8 mx-auto text-xs rounded-xl flex items-center justify-center font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-600/20'
                      : isTodayDate
                      ? 'border border-indigo-500 text-indigo-600 font-bold bg-indigo-50/50'
                      : isCurrentMonth
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Type or click to choose
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-600 hover:text-slate-900"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
