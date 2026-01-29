-- ========================================
-- FLOWCASH - Schema SQL Completo
-- ========================================
-- Este schema cria toda a estrutura necessária
-- para a aplicação FlowCash funcionar corretamente

-- ========================================
-- 1. LIMPAR TUDO (executar uma única vez)
-- ========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.user_modules CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ========================================
-- 2. TABELA PRINCIPAL: USERS
-- ========================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'pro')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  enabled_modules TEXT[] DEFAULT ARRAY['core_financial'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- ========================================
-- 3. TABELA: EXPENSES (GASTOS)
-- ========================================
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  installments INTEGER DEFAULT 1 CHECK (installments >= 1),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category ON public.expenses(category);

-- Habilitar RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para expenses
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 4. TABELA: TRANSACTIONS (TRANSAÇÕES)
-- ========================================
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  installment_number INTEGER DEFAULT 1,
  total_installments INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- Habilitar RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 5. TABELA: GOALS (METAS)
-- ========================================
CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX idx_goals_user_id ON public.goals(user_id);

-- Habilitar RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para goals
CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 6. TABELA: MODULES
-- ========================================
CREATE TABLE public.modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  coming_soon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Dados iniciais de módulos
INSERT INTO public.modules (id, name, slug, description, is_active) VALUES
  ('core_financial', 'Core Financial', 'core_financial', 'Gerenciamento de gastos e despesas', true),
  ('investments', 'Investimentos', 'investments', 'Rastreamento de investimentos', false),
  ('loans', 'Empréstimos', 'loans', 'Gerenciamento de empréstimos', false),
  ('budgets', 'Orçamentos', 'budgets', 'Criação e acompanhamento de orçamentos', false);

-- ========================================
-- 7. TABELA: USER_MODULES (Módulos por Usuário)
-- ========================================
CREATE TABLE public.user_modules (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

-- Índices
CREATE INDEX idx_user_modules_user_id ON public.user_modules(user_id);
CREATE INDEX idx_user_modules_module_id ON public.user_modules(module_id);

-- Habilitar RLS
ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_modules
CREATE POLICY "Users can view own modules" ON public.user_modules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own modules" ON public.user_modules
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 8. FUNÇÃO TRIGGER: Criar Perfil Automaticamente
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);
  
  INSERT INTO public.users (id, name, email, plan, role)
  VALUES (
    NEW.id,
    v_name,
    NEW.email,
    'free',
    'user'
  );

  -- Atualizar app_metadata com role
  UPDATE auth.users
  SET app_metadata = COALESCE(app_metadata, '{}'::jsonb) || '{"role": "user"}'::jsonb
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro (opcional)
  RAISE WARNING 'Erro ao criar usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 9. TRIGGER: Executado ao inserir novo usuário
-- ========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 10. VERIFICAÇÃO FINAL
-- ========================================
-- Executar essas queries para verificar se tudo foi criado:
-- SELECT COUNT(*) as total_users FROM public.users;
-- SELECT COUNT(*) as total_auth FROM auth.users;
-- SELECT * FROM public.modules;
-- \d public.users;
-- \d public.expenses;
-- \d public.transactions;
-- \d public.goals;
-- \d public.modules;
-- \d public.user_modules;
