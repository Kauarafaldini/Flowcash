# FlowCash - Setup Database

## 🚨 ERRO: "policy already exists"

Se você está vendo este erro, significa que o schema já foi executado parcialmente. O schema foi atualizado para usar `DROP POLICY IF EXISTS` para evitar conflitos.

## 🔧 SOLUÇÃO IMEDIATA

### Execute o Schema SQL Novamente
1. Acesse [supabase.com](https://supabase.com) → seu projeto FlowCash
2. **SQL Editor** (menu lateral)
3. Cole TODO o conteúdo de `database/schema.sql` (atualizado)
4. **Clique em "Run"**

**O schema agora pode ser executado múltiplas vezes sem erros.**

### Criar Perfil para seu Usuário Existente
Após executar o schema:

```bash
# Script automático
node create-profile.js

# Ou manualmente
curl -X POST http://localhost:3333/auth/create-profile \
  -H "Content-Type: application/json" \
  -d '{"userId": "346fe106-a5b9-40b6-9be9-b9f216511bce"}'
```

### Teste o Login
Agora tente fazer login novamente no front-end.

## 📋 O que foi criado:

- ✅ Tabela `users` com perfis personalizados
- ✅ Tabela `expenses` para controle de gastos
- ✅ Políticas RLS seguras (usando JWT)
- ✅ Trigger automático para criação de perfis
- ✅ Índices para performance

## 🎯 Status

Execute o schema atualizado no Supabase! 🚀