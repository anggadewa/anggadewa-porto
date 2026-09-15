import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Confirmation',
    description = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
    itemName,
    isLoading = false
}: DeleteConfirmDialogProps) {
    // Close on Escape key press
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    // Prevent body scroll when dialog is open
    React.useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
                    {/* Full-screen Backdrop covering entire page and app shell */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md"
                        onClick={() => {
                            if (!isLoading) onClose();
                        }}
                    />

                    {/* Centered Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 16 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-[2.25rem] border border-zinc-200/80 bg-white p-8 sm:p-9 shadow-2xl z-10 space-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute right-6 top-6 rounded-2xl p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Danger Icon Header */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 shadow-sm">
                                <AlertTriangle className="h-7 w-7" />
                            </div>
                            <div className="space-y-1.5 pr-6">
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-600">
                                    Permanent Action
                                </span>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 leading-tight">
                                    {title}
                                </h3>
                            </div>
                        </div>

                        {/* Content / Target Name */}
                        <div className="space-y-3.5">
                            <p className="text-sm font-medium leading-relaxed text-zinc-500">
                                {description}
                            </p>

                            {itemName && (
                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                                        Selected Target:
                                    </span>
                                    <div className="text-sm font-black text-zinc-900 break-all">
                                        {itemName}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full sm:w-auto h-12 rounded-xl border-zinc-200 bg-white px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="w-full sm:w-auto h-12 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-600/25 active:scale-95 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Confirm Delete
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
