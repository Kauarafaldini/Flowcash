import MainLayout from "@/components/MainLayout";
import ModuleBlock from "@/components/ModuleBlock";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessModule } from "@/lib/modules";

export default function Statements() {
  const { user } = useAuth();
  const access = canAccessModule(user, "open_finance");

  if (!access.accessible) {
    return (
      <ModuleBlock
        moduleName="Extrato Bancário"
        reason={access.reason}
        description="Visualize seus gastos no débito, crédito e acompanhe seu fluxo financeiro. Disponível no plano Pro."
      />
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Extrato Bancário
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize seus gastos no débito, crédito e acompanhe seu fluxo financeiro.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Integração com Banco Desconectada
            </h3>
            <p className="text-blue-800 mt-1">
              Conecte sua conta bancária para visualizar seus extratos e transações automaticamente.
              Essa funcionalidade estará disponível em breve!
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Conectar Banco
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Débito */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Gastos em Débito
            </h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Conecte seu banco para visualizar transações em débito.
              </p>
            </div>
          </div>

          {/* Crédito */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Gastos em Crédito
            </h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Conecte seu banco para visualizar transações em crédito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
