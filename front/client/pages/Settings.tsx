import MainLayout from "@/components/MainLayout";
import { Download } from "lucide-react";

export default function Settings() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências e dados pessoais.
          </p>
        </div>

        {/* User Data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Dados do Usuário
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Preferências
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Moeda
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Real (R$)</option>
                  <option>Dólar (US$)</option>
                  <option>Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Visualização de Gráficos
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Categorias Personalizadas
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie suas categorias de gastos.
            </p>
            <button className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Editar Categorias
            </button>
          </div>
        </div>

        {/* Bank Connection */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Conexão com Bancos
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Integre suas contas bancárias para sincronizar transações automaticamente.
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Conectar Banco
          </button>
        </div>

        {/* Export Data */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Exportar Dados
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Baixe seus dados financeiros em formato CSV ou PDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
              <Download className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
