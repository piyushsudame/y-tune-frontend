"use client"
import React, { useState } from 'react';
import Leftbar from '@/components/Leftbar';
import Player from '@/components/Player';
import FriendsActivity from '@/components/FriendsActivity';
import ChatWindow from '@/components/ChatWindow';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Layout({ children }) {
    // State to toggle between ChatWindow and FriendsActivity
    const [showChat, setShowChat] = useState(false);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);
    const [sizes, setSizes] = useState([20, 60, 20]);

    const handleLayout = (newSizes) => {
        setSizes(newSizes);
    };

    const toggleLeftPanel = () => {
        if (leftCollapsed) {
            setSizes([20, 60, 20]);
        } else {
            setSizes([0, 80, 20]);
        }
        setLeftCollapsed(!leftCollapsed);
    };

    const toggleRightPanel = () => {
        if (rightCollapsed) {
            setSizes([20, 60, 20]);
        } else {
            setSizes([20, 80, 0]);
        }
        setRightCollapsed(!rightCollapsed);
    };

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <PanelGroup 
                    direction="horizontal" 
                    onLayout={handleLayout}
                    autoSaveId="layout"
                >
                    {/* Left sidebar */}
                    <Panel 
                        defaultSize={20} 
                        minSize={0} 
                        maxSize={30}
                        order={1}
                        id="left"
                    >
                        <div className="h-full overflow-hidden relative">
                            <button
                                onClick={toggleLeftPanel}
                                className="absolute right-0 top-4 z-20 bg-gray-800 rounded-full p-1.5 hover:bg-purple-600 transition-colors shadow-lg"
                            >
                                {leftCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                        <div className="h-full overflow-auto custom-scrollbar p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
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
                    >
                        <div className="h-full overflow-hidden relative">
                            <button
                                onClick={toggleRightPanel}
                                className="absolute left-0 top-4 z-20 bg-gray-800 rounded-full p-1.5 hover:bg-purple-600 transition-colors shadow-lg"
                            >
                                {rightCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
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