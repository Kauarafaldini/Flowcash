import { Module, ModuleId, UserPlan, User, UserModuleAccess } from "./types";
import {
  CreditCard,
  Zap,
  TrendingUp,
  Briefcase,
  Banknote,
  LucideIcon,
} from "lucide-react";

// Module Definitions
export const MODULES: Record<ModuleId, Module> = {
  core_financial: {
    id: "core_financial",
    name: "Core Financeiro",
    description: "Controle de receitas, gastos e saldo",
    icon: "CreditCard",
    requiredPlan: "free",
    comingSoon: false,
    enabled: true,
  },
  organization_control: {
    id: "organization_control",
    name: "Organização & Controle",
    description: "Metas, parcelamentos e relatórios",
    icon: "Zap",
    requiredPlan: "premium",
    comingSoon: false,
    enabled: true,
  },
  simulations: {
    id: "simulations",
    name: "Simulações Financeiras",
    description: "Simulador de empréstimos e cenários",
    icon: "TrendingUp",
    requiredPlan: "premium",
    comingSoon: false,
    enabled: true,
  },
  investments: {
    id: "investments",
    name: "Investimentos",
    description: "Acompanhamento de ativos e investimentos",
    icon: "Briefcase",
    requiredPlan: "pro",
    comingSoon: false,
    enabled: false, // Disabled globally
  },
  open_finance: {
    id: "open_finance",
    name: "Open Finance",
    description: "Integração com bancos e extratos automáticos",
    icon: "Banknote",
    requiredPlan: "pro",
    comingSoon: true,
    enabled: false,
  },
};

// Plan Hierarchy
export const PLAN_HIERARCHY: Record<UserPlan, number> = {
  free: 0,
  premium: 1,
  pro: 2,
};

// Check if user can access a module
export const canAccessModule = (
  user: User | null,
  moduleId: ModuleId
): UserModuleAccess => {
  if (!user) {
    return {
      moduleId,
      accessible: false,
      reason: "not_authenticated",
    };
  }

  const module = MODULES[moduleId];

  if (!module) {
    return {
      moduleId,
      accessible: false,
      reason: "module_not_found",
    };
  }

  // Check if module is globally disabled
  if (!module.enabled) {
    return {
      moduleId,
      accessible: false,
      reason: "module_disabled",
    };
  }

  // Check if module is coming soon
  if (module.comingSoon) {
    return {
      moduleId,
      accessible: false,
      reason: "coming_soon",
    };
  }

  // Check if user has plan required for module
  if (PLAN_HIERARCHY[user.plan] < PLAN_HIERARCHY[module.requiredPlan]) {
    return {
      moduleId,
      accessible: false,
      reason: "upgrade_required",
    };
  }

  // Check if user has module explicitly enabled
  if (!user.enabledModules.includes(moduleId)) {
    return {
      moduleId,
      accessible: false,
      reason: "not_enabled_for_user",
    };
  }

  return {
    moduleId,
    accessible: true,
  };
};

// Get all accessible modules for a user
export const getAccessibleModules = (user: User | null): ModuleId[] => {
  if (!user) return [];

  return Object.keys(MODULES).filter((id) => {
    const access = canAccessModule(user, id as ModuleId);
    return access.accessible;
  }) as ModuleId[];
};

// Get module by ID
export const getModule = (moduleId: ModuleId): Module | null => {
  return MODULES[moduleId] || null;
};

// Get upgrade message for blocked module
export const getBlockedModuleMessage = (
  reason: string | undefined
): string => {
  switch (reason) {
    case "upgrade_required":
      return "Upgrade your plan to access this feature";
    case "coming_soon":
      return "This feature is coming soon";
    case "module_disabled":
      return "This module is currently disabled";
    case "not_authenticated":
      return "Please log in to access this feature";
    default:
      return "You don't have access to this feature";
  }
};

// Get icon component for module
export const getModuleIcon = (
  iconName: string
): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    CreditCard,
    Zap,
    TrendingUp,
    Briefcase,
    Banknote,
  };
  return iconMap[iconName] || CreditCard;
};
