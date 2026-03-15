import { cn } from '../../lib/utils';

export function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

export function DialogContent({ className, children }) {
  return (
    <div className={cn('bg-background rounded-lg border shadow-lg p-6', className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ className, children }) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>;
}

export function DialogFooter({ className, children }) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)}>{children}</div>;
}
