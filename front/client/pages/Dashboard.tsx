import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import MainLayout from "@/components/MainLayout";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const expensesData = [
  { month: "Jan", expenses: 2400, income: 3200 },
  { month: "Fev", expenses: 1398, income: 2210 },
  { month: "Mar", expenses: 9800, income: 2290 },
  { month: "Abr", expenses: 3908, income: 2000 },
  { month: "Mai", expenses: 4800, income: 2181 },
  { month: "Jun", expenses: 3800, income: 2500 },
];

const categoryData = [
  { name: "Alimentação", value: 2400, fill: "#3b82f6" },
  { name: "Transporte", value: 1398, fill: "#10b981" },
  { name: "Aluguel", value: 9800, fill: "#f59e0b" },
  { name: "Lazer", value: 3908, fill: "#ef4444" },
  { name: "Outros", value: 4800, fill: "#8b5cf6" },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo! Aqui está um resumo do seu controle financeiro.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            label="Saldo Atual"
            value="R$ 12.450,00"
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
            trend={{ value: 5.2, isPositive: true }}
          />
          <DashboardCard
            label="Gastos do Mês"
            value="R$ 3.847,20"
            icon={<TrendingDown className="w-6 h-6" />}
            color="orange"
            trend={{ value: 2.1, isPositive: false }}
          />
          <DashboardCard
            label="Receitas do Mês"
            value="R$ 5.200,00"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend={{ value: 8.3, isPositive: true }}
          />
          <DashboardCard
            label="Metas em Andamento"
            value="3 metas"
            icon={<Target className="w-6 h-6" />}
            color="blue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Gastos vs Receitas (Últimos 6 meses)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Gastos"
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Receitas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Gastos por Categoria
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Últimas Transações
            </h3>
            <div className="space-y-3">
              {[
                { name: "Supermercado Pão de Açúcar", value: "-R$ 234,50", date: "Hoje" },
                { name: "Salário", value: "+R$ 3.500,00", date: "5 dias atrás" },
                { name: "Gás Natural", value: "-R$ 78,90", date: "7 dias atrás" },
              ].map((transaction, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="font-medium text-foreground">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.value.startsWith("+")
                        ? "text-green-600"
                        : "text-foreground"
                    }`}
                  >
                    {transaction.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Metas Financeiras
            </h3>
            <div className="space-y-4">
              {[
                { name: "Fundo de Emergência", current: 4500, total: 6000 },
                { name: "Férias", current: 2100, total: 3500 },
                { name: "Novo Celular", current: 1200, total: 2000 },
              ].map((goal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((goal.current / goal.total) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(goal.current / goal.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    R$ {goal.current.toLocaleString("pt-BR")} de R${" "}
                    {goal.total.toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
