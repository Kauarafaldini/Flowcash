import { Lock, ArrowRight, Zap } from "lucide-react";
import MainLayout from "./MainLayout";

interface ModuleBlockProps {
  moduleName: string;
  reason: string | undefined;
  description?: string;
}

const getBlockDetails = (reason: string | undefined) => {
  switch (reason) {
    case "upgrade_required":
      return {
        title: "Upgrade Necessário",
        message: "Este módulo está disponível apenas em planos premium.",
        cta: "Fazer Upgrade",
        icon: Zap,
      };
    case "coming_soon":
      return {
        title: "Em Breve",
        message: "Este módulo está sendo desenvolvido e estará disponível em breve.",
        cta: "Notificar-me",
        icon: Zap,
      };
    case "module_disabled":
      return {
        title: "Módulo Desativado",
        message: "Este módulo foi temporariamente desativado.",
        cta: null,
        icon: Lock,
      };
    default:
      return {
        title: "Acesso Negado",
        message: "Você não tem permissão para acessar este módulo.",
        cta: null,
        icon: Lock,
      };
  }
};

export default function ModuleBlock({
  moduleName,
  reason,
  description,
}: ModuleBlockProps) {
  const details = getBlockDetails(reason);
  const Icon = details.icon;

  return (
    <MainLayout>
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Icon className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {details.title}
          </h1>

          <p className="text-muted-foreground mb-6">{details.message}</p>

          {description && (
            <p className="text-sm text-muted-foreground mb-8 bg-muted p-4 rounded-lg">
              {description}
            </p>
          )}

          <div className="space-y-3">
            {details.cta && (
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                {details.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
