#!/usr/bin/env node

// Script para criar perfil do usuário existente
// Execute: node create-profile.js

const https = require('https')

const API_BASE = 'http://localhost:3333'
const USER_ID = '346fe106-a5b9-40b6-9be9-b9f216511bce'

async function createProfile() {
  console.log('👤 Criando perfil para usuário:', USER_ID)

  const data = JSON.stringify({ userId: USER_ID })

  const options = {
    hostname: 'localhost',
    port: 3333,
    path: '/auth/create-profile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, (res) => {
    let body = ''
    res.on('data', (chunk) => body += chunk)
    res.on('end', () => {
      try {
        const response = JSON.parse(body)
        console.log('📋 Resposta:', response)
        if (response.message) {
          console.log('✅ Perfil criado com sucesso!')
          console.log('🔄 Agora tente fazer login novamente.')
        } else {
          console.log('❌ Erro:', response.error)
        }
      } catch (err) {
        console.log('❌ Erro ao parsear resposta:', err.message)
      }
    })
  })

  req.on('error', (err) => {
    console.error('❌ Erro na requisição:', err.message)
  })

  req.write(data)
  req.end()
}

createProfile()