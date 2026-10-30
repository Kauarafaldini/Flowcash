import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_DIR = path.resolve(__dirname, '../data')
const DB_FILE = path.join(DB_DIR, 'db.json')

// Garantir diretório de dados
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const DEFAULT_USERS = [
  {
    id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    plan: 'free',
    role: 'user',
    enabled_modules: ['core_financial'],
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b1a2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
    name: 'Jane Premium',
    email: 'premium@example.com',
    password: 'password123',
    plan: 'premium',
    role: 'user',
    enabled_modules: ['core_financial', 'organization_control', 'simulations'],
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a9b8c7d6-e5f4-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Admin FlowCash',
    email: 'admin@example.com',
    password: 'admin123',
    plan: 'pro',
    role: 'admin',
    enabled_modules: ['core_financial', 'organization_control', 'simulations', 'investments'],
    created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

const DEFAULT_EXPENSES = [
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    value: 234.50,
    category: 'Alimentação',
    payment_method: 'Débito',
    installments: 1,
    description: 'Supermercado Pão de Açúcar',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    value: 78.90,
    category: 'Outros',
    payment_method: 'Débito',
    installments: 1,
    description: 'Gás Natural',
    date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    value: 1200.00,
    category: 'Aluguel',
    payment_method: 'Débito',
    installments: 1,
    description: 'Aluguel Apartamento',
    date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  }
]

const DEFAULT_TRANSACTIONS = [
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    type: 'income',
    title: 'Salário Mensal',
    amount: 5200.00,
    category: 'Salário',
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    installment_number: 1,
    total_installments: 1
  },
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    type: 'expense',
    title: 'Supermercado',
    amount: 234.50,
    category: 'Alimentação',
    date: new Date().toISOString(),
    installment_number: 1,
    total_installments: 1
  },
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    type: 'expense',
    title: 'Aluguel',
    amount: 1200.00,
    category: 'Moradia',
    date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    installment_number: 1,
    total_installments: 1
  }
]

const DEFAULT_GOALS = [
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    title: 'Fundo de Emergência',
    total_value: 6000.00,
    current_value: 4500.00,
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce',
    title: 'Férias de Fim de Ano',
    total_value: 3500.00,
    current_value: 2100.00,
    created_at: new Date().toISOString()
  }
]

function getInitialData() {
  return {
    users: [...DEFAULT_USERS],
    expenses: [...DEFAULT_EXPENSES],
    transactions: [...DEFAULT_TRANSACTIONS],
    goals: [...DEFAULT_GOALS],
    user_modules: [
      { user_id: '346fe106-a5b9-40b6-9be9-b9f216511bce', enabled: true, modules: { slug: 'core_financial' } },
      { user_id: 'b1a2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', enabled: true, modules: { slug: 'core_financial' } },
      { user_id: 'b1a2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', enabled: true, modules: { slug: 'organization_control' } },
      { user_id: 'a9b8c7d6-e5f4-4a3b-2c1d-0e9f8a7b6c5d', enabled: true, modules: { slug: 'core_financial' } },
      { user_id: 'a9b8c7d6-e5f4-4a3b-2c1d-0e9f8a7b6c5d', enabled: true, modules: { slug: 'admin' } }
    ]
  }
}

class LocalDatabase {
  constructor() {
    this.data = getInitialData()
    this.load()
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8')
        this.data = { ...getInitialData(), ...JSON.parse(content) }
      } else {
        this.save()
      }
    } catch (err) {
      console.warn('⚠️ Erro ao carregar db.json local, usando dados iniciais:', err.message)
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (err) {
      console.error('❌ Erro ao salvar db.json:', err.message)
    }
  }

  getTable(name) {
    if (!this.data[name]) {
      this.data[name] = []
    }
    return this.data[name]
  }
}

export const localDb = new LocalDatabase()

class QueryBuilder {
  constructor(table) {
    this.tableName = table
    this.filters = []
    this.orderConfig = null
    this.limitCount = null
    this.isSingle = false
    this.selectedFields = '*'
  }

  select(fields = '*') {
    this.selectedFields = fields
    return this
  }

  eq(column, value) {
    this.filters.push((row) => row[column] === value)
    return this
  }

  gte(column, value) {
    this.filters.push((row) => {
      const val = row[column]
      return val !== undefined && new Date(val).getTime() >= new Date(value).getTime()
    })
    return this
  }

  lte(column, value) {
    this.filters.push((row) => {
      const val = row[column]
      return val !== undefined && new Date(val).getTime() <= new Date(value).getTime()
    })
    return this
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending }
    return this
  }

  limit(count) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  async execute() {
    let list = [...localDb.getTable(this.tableName)]

    for (const filter of this.filters) {
      list = list.filter(filter)
    }

    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig
      list.sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1
        if (a[column] > b[column]) return ascending ? 1 : -1
        return 0
      })
    }

    if (this.limitCount !== null) {
      list = list.slice(0, this.limitCount)
    }

    if (this.isSingle) {
      if (list.length === 0) {
        return { data: null, error: { message: 'Registro não encontrado' } }
      }
      return { data: list[0], error: null }
    }

    return { data: list, error: null }
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject)
  }

  async insert(recordOrRecords) {
    const table = localDb.getTable(this.tableName)
    const records = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]

    const inserted = []
    for (const rec of records) {
      const newRecord = {
        id: rec.id || crypto.randomUUID(),
        ...rec,
        created_at: rec.created_at || new Date().toISOString()
      }
      table.push(newRecord)
      inserted.push(newRecord)
    }

    localDb.save()
    return { data: Array.isArray(recordOrRecords) ? inserted : inserted[0], error: null }
  }

  async update(updates) {
    const table = localDb.getTable(this.tableName)
    let updatedRows = []

    for (let i = 0; i < table.length; i++) {
      let matches = true
      for (const filter of this.filters) {
        if (!filter(table[i])) {
          matches = false
          break
        }
      }
      if (matches) {
        table[i] = { ...table[i], ...updates, updated_at: new Date().toISOString() }
        updatedRows.push(table[i])
      }
    }

    localDb.save()
    return { data: updatedRows, error: null }
  }

  async delete() {
    const table = localDb.getTable(this.tableName)
    const beforeCount = table.length

    const kept = table.filter((row) => {
      for (const filter of this.filters) {
        if (filter(row)) return false
      }
      return true
    })

    localDb.data[this.tableName] = kept
    localDb.save()
    return { data: null, error: null }
  }
}

export function createLocalSupabase() {
  return {
    from: (table) => new QueryBuilder(table),

    auth: {
      async signInWithPassword({ email, password }) {
        const users = localDb.getTable('users')
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

        if (!user || (user.password && user.password !== password)) {
          // Para conveniência do usuário em modo local, se não existir o usuário mas foi fornecido email/senha, podemos criar automaticamente ou autenticar
          if (!user && email && password) {
            const newUser = {
              id: crypto.randomUUID(),
              name: email.split('@')[0],
              email: email.toLowerCase(),
              password: password,
              plan: 'free',
              role: email.includes('admin') ? 'admin' : 'user',
              enabled_modules: ['core_financial'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            users.push(newUser)
            localDb.save()
            return {
              data: {
                user: { id: newUser.id, email: newUser.email },
                session: { access_token: `mock-token-${newUser.id}` }
              },
              error: null
            }
          }
          return { data: {}, error: { message: 'Email ou senha inválidos' } }
        }

        return {
          data: {
            user: { id: user.id, email: user.email },
            session: { access_token: `mock-token-${user.id}` }
          },
          error: null
        }
      },

      async signUp({ email, password }) {
        const users = localDb.getTable('users')
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())

        if (existing) {
          return { data: {}, error: { message: 'Usuário já cadastrado' } }
        }

        const newUser = {
          id: crypto.randomUUID(),
          name: email.split('@')[0],
          email: email.toLowerCase(),
          password,
          plan: 'free',
          role: email.includes('admin') ? 'admin' : 'user',
          enabled_modules: ['core_financial'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        users.push(newUser)
        localDb.save()

        return {
          data: {
            user: { id: newUser.id, email: newUser.email },
            session: { access_token: `mock-token-${newUser.id}` }
          },
          error: null
        }
      },

      async resetPasswordForEmail(email) {
        return { error: null }
      },

      admin: {
        async updateUserById(userId, updates) {
          const users = localDb.getTable('users')
          const user = users.find(u => u.id === userId)
          if (user && updates.app_metadata?.role) {
            user.role = updates.app_metadata.role
            localDb.save()
          }
          return { data: user, error: null }
        }
      },

      async getUser(token) {
        if (!token) return { data: null, error: { message: 'Token não fornecido' } }
        const userId = token.replace('mock-token-', '')
        const users = localDb.getTable('users')
        const user = users.find(u => u.id === userId) || users[0]

        if (!user) {
          return { data: null, error: { message: 'Usuário não encontrado' } }
        }

        return {
          data: {
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          },
          error: null
        }
      }
    }
  }
}
