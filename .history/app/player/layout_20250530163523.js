"use client"
import React, { useState, useRef } from 'react';
import Leftbar from '@/components/Leftbar';
import Player from '@/components/Player';
import FriendsActivity from '@/components/FriendsActivity';
import ChatWindow from '@/components/ChatWindow';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight, Home, Library, MessageCircle, Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export default function Layout({ children }) {
    const [showChat, setShowChat] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // Refs for imperative panel control
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    
    // Track panel collapsed state
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    // Check for mobile viewport on mount and resize
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLayout = (newSizes) => {
        // This will still be called when panels are resized manually
    };

    const toggleLeftPanel = () => {
        const panel = leftPanelRef.current;
        if (panel) {
            if (leftCollapsed) {
                panel.expand();
                setLeftCollapsed(false);
            } else {
                panel.collapse();
                setLeftCollapsed(true);
            }
        }
    };

    const toggleRightPanel = () => {
        const panel = rightPanelRef.current;
        if (panel) {
            if (rightCollapsed) {
                panel.expand();
                setRightCollapsed(false);
            } else {
                panel.collapse();
                setRightCollapsed(true);
            }
        }
    };

    // Mobile bottom navigation items
    const bottomNavItems = [
        { icon: <Home size={24} />, label: 'Home', href: '/player' },
        { icon: <Library size={24} />, label: 'Library', href: '/player/library' },
        { icon: <MessageCircle size={24} />, label: 'Chat', href: '/player/chat' },
    ];

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden">
            {isMobile ? (
                // Mobile Layout
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main content */}
                    <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] relative">
                        {children}
                    </div>

                    {/* Side Drawer */}
                    <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
                        <SheetTrigger onClick={() => setIsSheetOpen(true)}>
                            <button className="fixed left-4 top-4 z-50 bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition-colors shadow-lg">
                                <Menu size={24} />
                            </button>
                        </SheetTrigger>
                        <SheetContent>
                            <Leftbar />
                        </SheetContent>
                    </Sheet>

                    {/* Bottom Navigation */}
                    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1a2e] border-t border-gray-800 flex items-center justify-around px-4">
                        {bottomNavItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
                            >
                                {item.icon}
                                <span className="text-xs mt-1">{item.label}</span>
                            </a>
                        ))}
                    </div>

                    {/* Floating Player */}
                    <div className="fixed bottom-16 left-0 right-0">
                        <Player />
                    </div>
                </div>
            ) : (
                // Desktop Layout
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Left panel expand button */}
                    {leftCollapsed && (
                        <button
                            onClick={toggleLeftPanel}
                            className="fixed left-5 top-1/2 -translate-y-1/2 z-[200] bg-purple-600 rounded-full p-3 hover:bg-purple-700 transition-colors shadow-lg"
                            aria-label="Expand left panel"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Right panel expand button */}
                    {rightCollapsed && (
                        <button
                            onClick={toggleRightPanel}
                            className="fixed right-5 top-1/2 -translate-y-1/2 z-[200] bg-purple-600 rounded-full p-3 hover:bg-purple-700 transition-colors shadow-lg"
                            aria-label="Expand right panel"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <PanelGroup 
                        direction="horizontal" 
                        onLayout={handleLayout}
                        className="w-full"
                    >
                        {/* Left sidebar */}
                        <Panel 
                            defaultSize={20} 
                            minSize={0} 
                            maxSize={30}
                            order={1}
                            id="left"
                            ref={leftPanelRef}
                            collapsible={true}
                        >
                            <div className="h-full overflow-hidden relative">
                                <button
                                    onClick={toggleLeftPanel}
                                    className="absolute right-0 top-4 z-20 bg-gray-800 rounded-full p-1.5 hover:bg-purple-600 transition-colors shadow-lg"
                                    aria-label={leftCollapsed ? "Expand left panel" : "Collapse left panel"}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <Leftbar />
                            </div>
                        </Panel>

                        {/* Resize handle */}
                        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-purple-500 transition-colors" />

                        {/* Main content */}
                        <Panel 
                            defaultSize={60}
                            order={2}
                            id="main"
                        >
                            <div className="h-full overflow-auto custom-scrollbar p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] relative">
                                {children}
                            </div>
                        </Panel>

                        {/* Resize handle */}
                        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-purple-500 transition-colors" />

                        {/* Right sidebar */}
                        <Panel 
                            defaultSize={20} 
                            minSize={0} 
                            maxSize={30}
                            order={3}
                            id="right"
                            ref={rightPanelRef}
                            collapsible={true}
                        >
                            <div className="h-full overflow-hidden relative">
                                <button
                                    onClick={toggleRightPanel}
                                    className="absolute left-0 top-4 z-20 bg-gray-800 rounded-full p-1.5 hover:bg-purple-600 transition-colors shadow-lg"
                                    aria-label={rightCollapsed ? "Expand right panel" : "Collapse right panel"}
                                >
                                    <ChevronRight size={16} />
                                </button>
                                
                                {/* Toggle buttons */}
                                <div className="absolute top-2 right-2 z-10 flex space-x-2">
                                    <button 
                                        onClick={() => setShowChat(false)}
                                        className={`px-3 py-1 rounded-full text-xs ${!showChat 
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                    >
                                        Friends
                                    </button>
                                    <button 
                                        onClick={() => setShowChat(true)}
                                        className={`px-3 py-1 rounded-full text-xs ${showChat 
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                    >
                                        Chat
                                    </button>
                                </div>

                                {/* Content panels */}
                                <div className={`h-full transition-opacity duration-300 ${showChat ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                                    <ChatWindow />
                                </div>
                                <div className={`h-full transition-opacity duration-300 ${!showChat ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                                    <FriendsActivity />
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>
            )}

            {/* Player - fixed height at bottom for desktop */}
            {!isMobile && (
                <div className="h-24">
                    <Player />
                </div>
            )}
        </div>
    );
}