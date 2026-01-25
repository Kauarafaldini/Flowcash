import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { MODULES } from "@/lib/modules";
import { Module, ModuleId } from "@/lib/types";
import { Clock, Eye, EyeOff } from "lucide-react";

export default function AdminModules() {
  const [modules, setModules] = useState<Record<ModuleId, Module>>(MODULES);

  const toggleModule = (moduleId: ModuleId) => {
    setModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        enabled: !prev[moduleId].enabled,
      },
    }));
  };

  const toggleComingSoon = (moduleId: ModuleId) => {
    setModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        comingSoon: !prev[moduleId].comingSoon,
      },
    }));
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300",
      premium: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      pro: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[plan as keyof typeof colors]
        }`}
      >
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Módulos
          </h1>
          <p className="text-muted-foreground mt-1">
            Ative/desative módulos e controle o status global do produto.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(modules).map(([moduleId, module]) => (
            <div
              key={moduleId}
              className={`border rounded-lg p-6 transition-colors ${
                module.enabled
                  ? "bg-card border-border"
                  : "bg-muted border-border opacity-60"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {module.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs px-3 py-1 bg-muted rounded-full">
                      ID: {module.id}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 py-3 border-y border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Plano Mínimo
                    </span>
                    {getPlanBadge(module.requiredPlan)}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  {/* Enable/Disable */}
                  <button
                    onClick={() => toggleModule(module.id as ModuleId)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border border-border transition-colors ${
                      module.enabled
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {module.enabled ? "Ativo" : "Inativo"}
                    </span>
                    {module.enabled ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  {/* Coming Soon */}
                  {module.enabled && (
                    <button
                      onClick={() => toggleComingSoon(module.id as ModuleId)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border border-border transition-colors ${
                        module.comingSoon
                          ? "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {module.comingSoon ? "Em Breve" : "Disponível Agora"}
                      </span>
                      <Clock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Resumo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Módulos Ativos</p>
              <p className="text-2xl font-bold text-foreground">
                {Object.values(modules).filter((m) => m.enabled).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Breve</p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  Object.values(modules).filter(
                    (m) => m.enabled && m.comingSoon
                  ).length
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inativos</p>
              <p className="text-2xl font-bold text-red-600">
                {Object.values(modules).filter((m) => !m.enabled).length}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Nota:</strong> Desabilitar um módulo globalmente o remove de
            todos os usuários, independentemente do plano. Use "Em Breve" para
            indicar que o módulo está sendo desenvolvido.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
