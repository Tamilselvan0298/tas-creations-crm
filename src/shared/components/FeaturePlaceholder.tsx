import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg text-center"
      >
        <Card glass className="p-8 border-[#D4AF37]/20">
          <div className="mx-auto h-16 w-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6">
            <Icon size={32} />
          </div>
          
          <div className="flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
              Upcoming Enterprise Module
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {title}
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft size={14} />
                <span>Return to Dashboard</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
export default FeaturePlaceholder;
