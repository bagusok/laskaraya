import React from "react";
import { ModalProps } from "@/types/modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  let modalWidth = "max-w-lg";
  if (size === "sm") modalWidth = "max-w-sm";
  if (size === "lg") modalWidth = "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop dengan animasi fade */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      {/* Modal Card dengan animasi scale/fade */}
      <Card className={`relative w-full ${modalWidth} mx-4 shadow-2xl animate-modalPop max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center border-b border-purple-900 px-6 py-4">
          <h3 className="text-lg uppercase tracking-wide font-normal text-purple-900">{title}</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-purple-900 hover:text-purple-700"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-4">{footer}</div>
        )}
      </Card>
      {/* Animasi CSS */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
        .animate-modalPop {
          animation: modalPop 0.25s cubic-bezier(.4,2,.6,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}