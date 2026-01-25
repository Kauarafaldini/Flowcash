import MainLayout from "@/components/MainLayout";
import ModuleBlock from "@/components/ModuleBlock";
import { Calculator } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessModule } from "@/lib/modules";

export default function Loans() {
  const { user } = useAuth();
  const access = canAccessModule(user, "simulations");

  if (!access.accessible) {
    return (
      <ModuleBlock
        moduleName="Simulações de Empréstimos"
        reason={access.reason}
        description="Simule empréstimos e visualize as condições financeiras. Disponível no plano Premium."
      />
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Simulações de Empréstimos
          </h1>
          <p className="text-muted-foreground mt-1">
            Simule empréstimos e visualize as condições financeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Simular Empréstimo
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor Desejado
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Número de Parcelas
                </label>
                <input
                  type="number"
                  placeholder="12"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Taxa de Juros (% a.m.)
                </label>
                <input
                  type="number"
                  placeholder="2,5"
                  step="0.1"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  placeholder="Ex: Itaú, Bradesco, Nubank"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Resultado da Simulação
            </h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Preencha o formulário e clique em "Calcular" para ver os resultados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
