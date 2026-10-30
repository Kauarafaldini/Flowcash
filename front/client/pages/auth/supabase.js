// Cliente Supabase Mock / Opcional para modo offline
export const supabase = {
  auth: {
    async signInWithPassword() { return { data: {}, error: null } },
    async signUp() { return { data: {}, error: null } },
    async signOut() { return { error: null } }
  },
  from() {
    return {
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null })
    }
  }
}
