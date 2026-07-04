import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  interactive?: boolean;
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  interactive = false,
  title,
  subtitle,
  extra,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl p-5 border';
  
  const styling = glass
    ? interactive
      ? 'glass-panel-interactive'
      : 'glass-panel'
    : interactive
      ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/60 shadow-premium hover:shadow-premium-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300'
      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/60 shadow-premium';

  return (
    <div className={`${baseClasses} ${styling} ${className}`} {...props}>
      {(title || subtitle || extra) && (
        <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <div>
            {title && (
              <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {extra && <div className="flex items-center space-x-2">{extra}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
