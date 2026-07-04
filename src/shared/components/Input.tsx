import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col mb-4">
        {label && (
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full text-sm py-2 px-3 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border ${
              error 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-200/80 dark:border-slate-800/60 focus:ring-[#0B1F3A] focus:border-[#0B1F3A] dark:focus:ring-slate-300 dark:focus:border-slate-300'
            } rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
