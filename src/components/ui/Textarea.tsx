import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  optional?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  optional = true,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <label htmlFor={textareaId} className="flex items-center gap-1">
            {label}
            {props.required && <span className="text-rose-500">*</span>}
          </label>
          {optional && <span className="text-slate-500 text-[11px] font-normal">(Opcional)</span>}
        </div>
      )}

      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={twMerge(
          clsx(
            'w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:bg-slate-950 resize-y leading-relaxed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )
        )}
        {...props}
      />

      {helperText && !error && (
        <p className="text-xs text-slate-400 leading-relaxed">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

