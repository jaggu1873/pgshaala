/**
 * Standard Supabase Mock
 * Replaced by MongoDB Analytical Engine.
 * Plain object to avoid Proxy-related recursion issues.
 */

const mockResponse = Promise.resolve({ data: [], error: null, count: 0 });
const mockSingleResponse = Promise.resolve({ data: null, error: null });

const chain = () => ({
  select: chain,
  insert: chain,
  update: chain,
  delete: chain,
  eq: chain,
  neq: chain,
  gt: chain,
  lt: chain,
  gte: chain,
  lte: chain,
  like: chain,
  ilike: chain,
  is: chain,
  in: chain,
  contains: chain,
  containedBy: chain,
  rangeGt: chain,
  rangeGte: chain,
  rangeLt: chain,
  rangeLte: chain,
  rangeAdjacent: chain,
  overlaps: chain,
  textSearch: chain,
  match: chain,
  not: chain,
  or: chain,
  filter: chain,
  order: chain,
  limit: chain,
  range: chain,
  abortSignal: chain,
  single: () => mockSingleResponse,
  maybeSingle: () => mockSingleResponse,
  csv: chain,
  then: (resolve: any) => resolve({ data: [], error: null, count: 0 }),
  catch: () => {},
});

export const supabase: any = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
  },
  from: chain,
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
  removeChannel: () => {},
  removeAllChannels: () => {},
  rpc: () => Promise.resolve({ data: null, error: null }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};