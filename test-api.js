#!/usr/bin/env node

// Script simples para testar a API FlowCash
// Execute com: node test-api.js

const API_BASE = 'http://localhost:3333'

async function testAPI() {
  console.log('🧪 Testando API FlowCash...\n')

  try {
    // Teste 1: Health check
    console.log('1. Testando health check...')
    const healthResponse = await fetch(`${API_BASE}/`)
    const health = await healthResponse.json()
    console.log('✅ Health check:', health)

    // Teste 2: Diagnóstico do banco
    console.log('\n2. Verificando configuração do banco...')
    const diagResponse = await fetch(`${API_BASE}/diagnostics`)
    const diagnostics = await diagResponse.json()
    console.log('📊 Diagnóstico:')
    console.log('   Users table:', diagnostics.checks.users_table)
    console.log('   Expenses table:', diagnostics.checks.expenses_table)
    console.log('   📝 Mensagem:', diagnostics.message)

    // Teste 3: Rota protegida (deve retornar erro)
    console.log('\n3. Testando rota protegida sem token...')
    try {
      const expensesResponse = await fetch(`${API_BASE}/expenses`)
      if (expensesResponse.status === 401) {
        console.log('✅ Proteção funcionando: 401 Unauthorized')
      } else {
        console.log('❌ Deveria ter falhado com 401')
      }
    } catch (err) {
      console.log('❌ Erro na requisição:', err.message)
    }

    console.log('\n🎉 API está funcionando! Execute o schema.sql no Supabase se necessário.')

  } catch (err) {
    console.log('❌ Erro na API:', err.message)
    console.log('💡 Certifique-se de que o back-end está rodando: npm start')
  }
}

testAPI()