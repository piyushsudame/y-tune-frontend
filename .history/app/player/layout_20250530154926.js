"use client"
import React, { useState } from 'react';
import Leftbar from '@/components/Leftbar';
import Player from '@/components/Player';
import FriendsActivity from '@/components/FriendsActivity';
import ChatWindow from '@/components/ChatWindow';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Layout({ children }) {
    // State to toggle between ChatWindow and FriendsActivity
    const [showChat, setShowChat] = useState(false);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <PanelGroup direction="horizontal">
                    {/* Left sidebar */}
                    <Panel
                        defaultSize={20}
                        minSize={15}
                        maxSize={30}
                        collapsed={leftCollapsed ? "true" : undefined}
                        collapsible={true}
                    >
                        <div className="h-full overflow-hidden">
                            <Leftbar
                                collapsed={leftCollapsed}
                                onCollapse={() => setLeftCollapsed(!leftCollapsed)}
                            />
                        </div>
                    </Panel>

                    {/* Resize handle */}
                    <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-purple-500 transition-colors" />

                    {/* Main content */}
                    <Panel defaultSize={60}>
                        <div className="h-full overflow-auto custom-scrollbar p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
                            {children}
                        </div>
                    </Panel>

                    {/* Resize handle */}
                    <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-purple-500 transition-colors" />

                    {/* Right sidebar */}
                    <Panel
                        defaultSize={20}
                        minSize={15}
                        maxSize={30}
                        collapsed={rightCollapsed ? "true" : undefined}
                        collapsible={true}
                    >
                        <div className="h-full overflow-hidden relative">
                            {/* Toggle buttons */}
                            <div className=" flexabsolute top-2 right-2 z-10 flex space-x-2">
                                <button
                                    onClick={onCollapse}
                                    className="absolute -left-3 top-4 z-20 bg-gray-800 rounded-full p-1 hover:bg-purple-600 transition-colors"
                                >
                                    {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                                </button>
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
                                <ChatWindow
                                    collapsed={rightCollapsed}
                                    onCollapse={() => setRightCollapsed(!rightCollapsed)}
                                />
                            </div>
                            <div className={`h-full transition-opacity duration-300 ${!showChat ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                                <FriendsActivity
                                    collapsed={rightCollapsed}
                                    onCollapse={() => setRightCollapsed(!rightCollapsed)}
                                />
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