import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Wallet, Clock, AlertCircle, Loader2 } from 'lucide-react';
import type { TransactionStep } from '../../hooks/useContractCall';
import { twMerge } from 'tailwind-merge';

interface TransactionStepperProps {
  currentStep: TransactionStep;
}

const steps: { key: TransactionStep; label: string; icon: any }[] = [
  { key: 'preparing', label: 'Preparing', icon: Shield },
  { key: 'signing', label: 'Sign in Wallet', icon: Wallet },
  { key: 'pending', label: 'Pending Network', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
];

export const TransactionStepper = ({ currentStep }: TransactionStepperProps) => {
  if (currentStep === 'idle') return null;

  if (currentStep === 'error') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold"
      >
        <AlertCircle size={18} />
        Transaction Failed
      </motion.div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="flex justify-between items-start max-w-sm mx-auto relative">
        {/* Connector Line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-white/5 -z-10" />
        
        {steps.map((step, index) => {
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index || currentStep === 'confirmed';
          const isActive = step.key === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1 relative">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                  color: isCompleted || isActive ? 'white' : 'rgba(255,255,255,0.3)',
                }}
                className={twMerge(
                  "w-10 h-10 rounded-full flex-center transition-all duration-500 shadow-lg",
                  isActive && "shadow-primary/20",
                  isCompleted && "shadow-success/20"
                )}
              >
                {isActive && currentStep !== 'confirmed' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Icon size={20} />
                )}
              </motion.div>
              <span className={twMerge(
                "text-[10px] font-bold uppercase tracking-widest text-center transition-colors duration-500",
                isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground/40"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
