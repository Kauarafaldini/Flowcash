import AdminLayout from "@/components/AdminLayout";
import { Save } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: "FlowCash",
    emailNotifications: true,
    maintenanceMode: false,
    maxUserStorage: "50GB",
    sessionTimeout: "24",
  });

  const handleSave = () => {
    // In a real app, save to backend
    alert("Configurações salvas com sucesso!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações gerais do FlowCash.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Configurações Gerais
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome da Aplicação
                </label>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(e) =>
                    setSettings({ ...settings, appName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tempo de Sessão (horas)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Armazenamento Máximo por Usuário
                </label>
                <input
                  type="text"
                  value={settings.maxUserStorage}
                  onChange={(e) =>
                    setSettings({ ...settings, maxUserStorage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Feature Flags
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Notificações por E-mail
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enviar notificações aos usuários por e-mail
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      emailNotifications: !settings.emailNotifications,
                    })
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settings.emailNotifications
                      ? "bg-green-600 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {settings.emailNotifications ? "Ativado" : "Desativado"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Modo de Manutenção
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Desativar acesso da aplicação para manutenção
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      maintenanceMode: !settings.maintenanceMode,
                    })
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settings.maintenanceMode
                      ? "bg-red-600 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {settings.maintenanceMode ? "Ativado" : "Desativado"}
                </button>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Integração Supabase
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Configure sua integração com Supabase para autenticação e banco de dados.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xxxxx.supabase.co"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Supabase API Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Use [Open MCP popover](#open-mcp-popover) para conectar ao Supabase
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
