import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  optional?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  optional = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm font-semibold text-slate-200">
          <label htmlFor={inputId} className="flex items-center gap-1.5 cursor-pointer">
            {label}
            {props.required ? (
              <span className="text-rose-400 text-xs font-bold px-1.5 py-0.2 bg-rose-500/10 rounded border border-rose-500/20">
                Obrigatório
              </span>
            ) : null}
          </label>
          {optional && (
            <span className="text-slate-400 text-xs font-medium bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
              Opcional
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-teal-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-slate-900 border-2 border-slate-700/90 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/20 disabled:opacity-50 disabled:bg-slate-950 shadow-inner',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-xs text-slate-400 font-medium leading-relaxed pl-0.5">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1 pl-0.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
