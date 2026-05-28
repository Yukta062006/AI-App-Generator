"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // In a real app, use Pusher or Socket.io. For demo, we polling or static.
    const mockNotifications: Notification[] = [
      { id: "1", type: "info", message: "Welcome to your new AI App!", read: false, createdAt: new Date().toISOString() },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button onClick={() => setNotifications([])} className="text-xs text-muted-foreground hover:text-primary">Clear all</button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={cn(
                    "p-3 rounded-lg border text-sm transition-colors",
                    n.read ? "bg-muted/30" : "bg-primary/5 border-primary/20"
                  )}>
                    <p className="text-foreground leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground mt-2 block italic">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
