import MainLayout from "@/components/MainLayout";
import ModuleBlock from "@/components/ModuleBlock";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessModule } from "@/lib/modules";

export default function Goals() {
  const { user } = useAuth();
  const access = canAccessModule(user, "organization_control");

  if (!access.accessible) {
    return (
      <ModuleBlock
        moduleName="Metas Financeiras e Investimentos"
        reason={access.reason}
        description="Acompanhe suas metas de economia e investimentos. Disponível no plano Premium."
      />
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Metas Financeiras e Investimentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe suas metas de economia e investimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Goal Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Nova Meta
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome da Meta
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fundo de Emergência"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor Total
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descrição da meta"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar Meta
              </button>
            </form>
          </div>

          {/* Metas */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Suas Metas
            </h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma meta criada ainda. Crie uma meta para começar a acompanhar seu progresso!
              </p>
            </div>
          </div>
        </div>

        {/* Investments Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Investimentos Acompanhados
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Você ainda não está acompanhando nenhum investimento. Adicione um ativo para começar!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
