"use client"
import React, { useState, useRef } from 'react';
import Leftbar from '@/components/Leftbar';
import Player from '@/components/Player';
import FriendsActivity from '@/components/FriendsActivity';
import ChatWindow from '@/components/ChatWindow';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Layout({ children }) {
    // State to toggle between ChatWindow and FriendsActivity
    const [showChat, setShowChat] = useState(false);
    
    // Refs for imperative panel control
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    
    // Track panel collapsed state
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    const handleLayout = (newSizes) => {
        // This will still be called when panels are resized manually
    };

    const toggleLeftPanel = () => {
        const panel = leftPanelRef.current;
        if (panel) {
            if (leftCollapsed) {
                panel.expand();
            } else {
                panel.collapse();
            }
            // State will be updated by onCollapse handler
        }
    };

    const toggleRightPanel = () => {
        const panel = rightPanelRef.current;
        if (panel) {
            if (rightCollapsed) {
                panel.expand();
            } else {
                panel.collapse();
            }
            // State will be updated by onCollapse handler
        }
    };

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left panel expand button - visible only when collapsed */}
                {leftCollapsed && (
                    <button
                        onClick={toggleLeftPanel}
                        className="fixed left-5 top-1/2 -translate-y-1/2 z-[200] bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition-colors shadow-lg"
                        aria-label="Expand left panel"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                {/* Right panel expand button - visible only when collapsed */}
                {rightCollapsed && (
                    <button
                        onClick={toggleRightPanel}
                        className="fixed right-5 top-1/2 -translate-y-1/2 z-[200] bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition-colors shadow-lg"
                        aria-label="Expand right panel"
                        style={{ pointerEvents: 'auto' }}
                    >
                        <ChevronLeft size={200} />
                    </button>
                )}

                <PanelGroup 
                    direction="horizontal" 
                    onLayout={handleLayout}
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
                        onCollapse={(collapsed) => setLeftCollapsed(collapsed)}
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
                        onCollapse={(collapsed) => setRightCollapsed(collapsed)}
                    >
                        <div className="h-full overflow-hidden relative">
                            <button
                                onClick={() => {toggleRightPanel console.log()}
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

            {/* Player - fixed height at bottom */}
            <div className="h-24">
                <Player />
            </div>
        </div>
    );
}