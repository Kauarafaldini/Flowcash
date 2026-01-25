import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { User, ModuleId } from "@/lib/types";
import { Search, Edit, Trash2, ChevronDown } from "lucide-react";

const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    plan: "free",
    role: "user",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
    enabledModules: ["core_financial"] as ModuleId[],
  },
  {
    id: "2",
    email: "premium@example.com",
    name: "Jane Premium",
    plan: "premium",
    role: "user",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-22",
    enabledModules: ["core_financial", "organization_control", "simulations"] as ModuleId[],
  },
  {
    id: "3",
    email: "pro@example.com",
    name: "Pro User",
    plan: "pro",
    role: "user",
    createdAt: "2024-01-05",
    lastLogin: "2024-01-21",
    enabledModules: [
      "core_financial",
      "organization_control",
      "simulations",
      "investments",
    ] as ModuleId[],
  },
];

const PlanBadge = ({ plan }: { plan: string }) => {
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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<string>("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePlan = (userId: string, plan: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              plan: plan as "free" | "premium" | "pro",
              enabledModules: getModulesForPlan(plan),
            }
          : user
      )
    );
    setEditingId(null);
  };

  const getModulesForPlan = (plan: string): ModuleId[] => {
    switch (plan) {
      case "free":
        return ["core_financial"];
      case "premium":
        return ["core_financial", "organization_control", "simulations"];
      case "pro":
        return [
          "core_financial",
          "organization_control",
          "simulations",
          "investments",
        ];
      default:
        return [];
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Visualize, edite e gerencie os planos dos usuários.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Módulos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <div className="relative">
                          <select
                            value={newPlan}
                            onChange={(e) => {
                              const plan = e.target.value;
                              handleChangePlan(user.id, plan);
                            }}
                            className="px-3 py-1 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                            <option value="pro">Pro</option>
                          </select>
                        </div>
                      ) : (
                        <PlanBadge plan={user.plan} />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.enabledModules.length} módulo(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("pt-BR")
                        : "Nunca"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setNewPlan(user.plan);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total de Usuários</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Premium + Pro</p>
            <p className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.plan !== "free").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-foreground">
              {(
                (users.filter((u) => u.plan !== "free").length / users.length) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
