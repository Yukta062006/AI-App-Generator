"use client";

import React, { useState, useEffect } from "react";
import { AppConfig, PageDef, ModelDef } from "./schema";
import { DynamicTable } from "@/components/dynamic/DataTable";
import { DynamicForm } from "@/components/dynamic/DynamicForm";
import { createRecord, getAppData, updateRecord, deleteRecord } from "./runtime";
import { Loader2, Menu, X, Settings, Database, Layout, Play, Download, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { exportToGitHub } from "../features/github-export";

interface DynamicRendererProps {
  appId: string;
  config: AppConfig;
}

import { I18nProvider, useTranslation } from "@/lib/features/i18n";
import { NotificationCenter } from "@/components/dynamic/NotificationCenter";
import { useSession, signIn, signOut } from "next-auth/react";

export function DynamicRenderer({ appId, config }: DynamicRendererProps) {
  return (
    <I18nProvider translations={config.i18n.translations} defaultLanguage={config.i18n.defaultLanguage}>
      <RendererContent appId={appId} config={config} />
    </I18nProvider>
  );
}

function RendererContent({ appId, config }: DynamicRendererProps) {
  const { t, setLanguage, language } = useTranslation();
  const { data: session } = useSession();
  const [activeView, setActiveView] = useState<"app" | "models" | "workflows" | "settings">("app");
  const [activePageId, setActivePageId] = useState(config.pages[0]?.id);
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState<{ modelName: string; record?: any } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const base64 = await exportToGitHub(config);
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/zip" });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.name.toLowerCase().replace(/\s+/g, "-")}-export.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const activePage = config.pages.find((p) => p.id === activePageId) || config.pages[0];

  useEffect(() => {
    // Basic data fetching for components that need it
    activePage.components.forEach((comp) => {
      if (comp.modelName) {
        fetchData(comp.modelName);
      }
    });
  }, [activePage, appId]);

  const fetchData = async (modelName: string) => {
    setLoading((prev) => ({ ...prev, [modelName]: true }));
    try {
      const result = await getAppData(appId, modelName);
      setData((prev) => ({ ...prev, [modelName]: result }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [modelName]: false }));
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!showForm) return;
    const { modelName, record } = showForm;
    
    try {
      if (record) {
        await updateRecord(record.id, formData);
      } else {
        await createRecord(appId, modelName, formData);
      }
      setShowForm(null);
      fetchData(modelName);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-xl truncate">{config.name}</h1>}
          <div className="flex items-center gap-2">
            {config.i18n.enabled && (
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs border rounded px-1 text-muted-foreground outline-none"
              >
                {config.i18n.languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-muted rounded text-muted-foreground">
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {config.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                setActiveView("app");
                setActivePageId(page.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeView === "app" && activePageId === page.id ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Layout className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{page.title}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
           <button 
             onClick={() => setActiveView("models")}
             className={cn(
               "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
               activeView === "models" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
             )}
           >
              <Database className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{t("models")}</span>}
           </button>
           <button 
             onClick={() => setActiveView("workflows")}
             className={cn(
               "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
               activeView === "workflows" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
             )}
           >
              <Play className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{t("workflows")}</span>}
           </button>
           <button 
             onClick={handleExport}
             disabled={exporting}
             className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
           >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Download className="h-4 w-4 shrink-0" />}
              {sidebarOpen && <span>{t("export")}</span>}
           </button>
           <button
  onClick={() => {
    window.location.href = "/settings";
  }}
  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
>
  <span>⚙️</span>
  <span>Settings</span>
</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="h-16 border-b bg-card px-8 flex items-center sticky top-0 z-10 justify-between">
          <h2 className="text-sm font-medium text-muted-foreground capitalize">
            {activeView} / {activeView === "app" ? activePage?.title : ""}
          </h2>
          <div className="flex items-center gap-4">
            {config.notifications.enabled && <NotificationCenter />}
            {config.auth.enabled && (
              <div className="flex items-center gap-3 pl-4 border-l">
                {session ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs font-semibold text-foreground">{session.user?.name || "User"}</p>
                        <p className="text-[10px] text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <LogOut className="h-3 w-3" /> Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={() => signIn()} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <User className="h-4 w-4" /> {t("login")}
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Backend: Online
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {activeView === "models" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("app_models")}</h1>
                <p className="text-muted-foreground">{t("models_description")}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {config.models.map((model) => (
                  <div key={model.name} className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{model.label}</h3>
                    </div>
                    <div className="space-y-3">
                      {model.fields.map(field => (
                        <div key={field.name} className="flex items-center justify-between text-sm py-1 border-b border-muted/50 last:border-0">
                          <span className="text-muted-foreground">{field.label}</span>
                          <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-mono">{field.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-card p-6 border-dashed text-center">
                 <p className="text-muted-foreground mb-4">JSON definition used for this application</p>
                 <pre className="bg-muted p-4 rounded-lg text-left text-xs overflow-auto max-h-64 font-mono">
                   {JSON.stringify(config.models, null, 2)}
                 </pre>
              </div>
            </div>
          ) : activeView === "workflows" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("workflows")}</h1>
                <p className="text-muted-foreground">{t("workflows_description")}</p>
              </div>
              <div className="space-y-4">
                {config.workflows.length > 0 ? config.workflows.map((wf) => (
                  <div key={wf.name} className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Play className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{wf.name}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">{wf.trigger}</span>
                    </div>
                    <div className="pl-8 border-l-2 border-muted space-y-3">
                      {wf.actions.map((action, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-sm font-medium capitalize">{action.type}</span>
                          <span className="text-xs text-muted-foreground font-mono">{JSON.stringify(action.params)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground border-dashed">
                    No workflows defined in the configuration.
                  </div>
                )}
              </div>
            </div>
          ) : showForm ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <DynamicForm 
                model={config.models.find(m => m.name === showForm.modelName)!}
                initialData={showForm.record?.data}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(null)}
              />
            </div>
          ) : (
            activePage?.components.map((comp) => {
              if (comp.type === "table" && comp.modelName) {
                const model = config.models.find((m) => m.name === comp.modelName);
                if (!model) return null;
                return (
                  <div key={comp.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
                    <DynamicTable
                      appId={appId}
                      model={model}
                      data={data[comp.modelName] || []}
                      loading={loading[comp.modelName]}
                      onAddClick={() => setShowForm({ modelName: comp.modelName! })}
                      onRowClick={(record) => setShowForm({ modelName: comp.modelName!, record })}
                      onRefresh={() => fetchData(comp.modelName!)}
                    />
                  </div>
                );
              }
              if (comp.type === "text") {
                return (
                  <div key={comp.id} className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold">{comp.title}</h3>
                    <p className="text-muted-foreground">{String(comp.props?.content ?? "")}</p>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </main>
    </div>
  );
}
