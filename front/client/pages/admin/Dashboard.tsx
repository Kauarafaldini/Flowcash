import { Users, TrendingUp, BarChart3, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { DashboardStats } from "@shared/types";

const generateMockStats = (): DashboardStats => {
  return {
    totalUsers: 1245,
    activeUsers: 892,
    usersByPlan: {
      free: 650,
      premium: 420,
      pro: 175,
    },
    monthlyGrowth: 12.5,
  };
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: "blue" | "green" | "orange" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200",
    green: "bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-200",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-200",
    purple: "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-200",
  };

  return (
    <div
      className={`p-6 rounded-lg border border-border ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75 mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={`text-xs font-medium mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="flex-shrink-0">{Icon}</div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Load stats
    setStats(generateMockStats());
  }, []);

  if (!stats) {
    return <AdminLayout>Carregando...</AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu produto e dos usuários.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total de Usuários"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            trend={{ value: stats.monthlyGrowth, isPositive: true }}
          />
          <StatCard
            label="Usuários Ativos"
            value={stats.activeUsers.toLocaleString()}
            icon={<Zap className="w-6 h-6" />}
            color="green"
            trend={{
              value: 8.2,
              isPositive: true,
            }}
          />
          <StatCard
            label="Taxa de Ativação"
            value={`${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`}
            icon={<BarChart3 className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            label="Crescimento Mensal"
            value={`+${stats.monthlyGrowth}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            trend={{ value: 3.1, isPositive: true }}
          />
        </div>

        {/* Users by Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Usuários por Plano
            </h2>
            <div className="space-y-4">
              {[
                { name: "Free", count: stats.usersByPlan.free, color: "gray" },
                {
                  name: "Premium",
                  count: stats.usersByPlan.premium,
                  color: "blue",
                },
                { name: "Pro", count: stats.usersByPlan.pro, color: "purple" },
              ].map((plan) => (
                <div key={plan.name}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">
                      {plan.name}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {plan.count}
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        plan.color === "blue"
                          ? "bg-blue-500"
                          : plan.color === "purple"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                      }`}
                      style={{
                        width: `${(plan.count / stats.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Gerenciar Usuários
              </a>
              <a
                href="/admin/modules"
                className="block px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
              >
                Gerenciar Módulos
              </a>
              <a
                href="/admin/settings"
                className="block px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
              >
                Configurações
              </a>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Saúde do Sistema
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-foreground">API Status</p>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200 rounded">
                    Online
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-foreground">Database</p>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200 rounded">
                    Saudável
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-foreground">Uptime</p>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200 rounded">
                    99.9%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
