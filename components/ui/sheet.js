"use client"
import React from 'react';
import { X } from 'lucide-react';

export function Sheet({ children, isOpen, onClose, side = "left" }) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}
            
            {/* Sheet */}
            <div 
                className={`fixed top-0 ${side}-0 h-full bg-[#1a1a2e] border-r border-gray-800 z-50 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
                } w-[80%] sm:w-[300px]`}
            >
                <div className="p-4">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    {children}
                </div>
            </div>
        </>
    );
}

export function SheetTrigger({ children, onClick }) {
    return (
        <div onClick={onClick}>
            {children}
        </div>
    );
}

export function SheetContent({ children }) {
    return children;
} 