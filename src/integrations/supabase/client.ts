/**
 * Standard Supabase Mock
 * Replaced by MongoDB Analytical Engine.
 * Plain object to avoid Proxy-related recursion issues.
 * 
 * ==========================================
 * EDUCATIONAL ANNOTATION: Core Networking Concepts
 * ==========================================
 * REST APIs: The system exposes endpoints (GET, POST, PUT, DELETE) to perform operations.
 * This demonstrates how real-world applications communicate over the web.
 * 
 * TCP/IP Model:
 * Explains how data travels through layers:
 * - Application Layer -> HTTP (REST)
 * - Transport Layer -> TCP
 * - Network Layer -> IP
 * 
 * Stateless Communication:
 * Each request is independent, which is a key principle in scalable systems.
 * 
 * JSON Data Exchange:
 * Data is transmitted in a structured format, enabling interoperability.
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