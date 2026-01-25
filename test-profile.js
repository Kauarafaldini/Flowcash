#!/usr/bin/env node

// Script para testar se o perfil foi criado
// Execute: node test-profile.js

const https = require('https')

const API_BASE = 'http://localhost:3333'
const USER_ID = '346fe106-a5b9-40b6-9be9-b9f216511bce'

async function testProfile() {
  console.log('🔍 Testando se o perfil existe...')

  const options = {
    hostname: 'localhost',
    port: 3333,
    path: '/diagnostics',
    method: 'GET'
  }

  const req = https.request(options, (res) => {
    let body = ''
    res.on('data', (chunk) => body += chunk)
    res.on('end', () => {
      try {
        const diagnostics = JSON.parse(body)
        console.log('📊 Diagnóstico do banco:')
        console.log('   Users table:', diagnostics.checks.users_table)
        console.log('   Expenses table:', diagnostics.checks.expenses_table)

        if (diagnostics.checks.users_table.includes('OK')) {
          console.log('✅ Tabela users existe!')
          console.log('🔄 Agora teste o login no front-end.')
        } else {
          console.log('❌ Tabela users ainda não existe.')
          console.log('📝 Execute o schema.sql no Supabase primeiro.')
        }
      } catch (err) {
        console.log('❌ Erro ao parsear resposta:', err.message)
      }
    })
  })

  req.on('error', (err) => {
    console.error('❌ Erro na requisição:', err.message)
  })

  req.end()
}

testProfile()