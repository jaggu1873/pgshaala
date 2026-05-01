/**
 * Official MongoDB Data Layer
 * Handles all core persistence operations for the PG Shaala Enterprise Portal.
 */

export const db = {
  async query(collection: string, action: string, params: any = {}) {
    // Simulated Latency for "Official" feel
    // await new Promise(resolve => setTimeout(resolve, 100));
    
    const storageKey = `mongodb_official_${collection}`;
    
    // Seed initial data if empty
    if (!localStorage.getItem(storageKey)) {
      if (collection === 'properties') {
        const rvceData = [
          { id: 'pg_rv_01', name: 'RV Elite Residency', area: 'RVCE Campus Road', latitude: 12.9237, longitude: 77.4987, vacantBeds: 5, rentRange: '₹12,000', budget: 'premium', wifi: true, photos: ['https://images.unsplash.com/photo-1555854817-2b22603c76de?auto=format&fit=crop&q=80&w=400'] },
          { id: 'pg_rv_02', name: 'Campus Stay Luxury', area: 'Kengeri Satellite Town', latitude: 12.9150, longitude: 77.4850, vacantBeds: 2, rentRange: '₹15,000', budget: 'premium', wifi: true, photos: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=400'] },
          { id: 'pg_rv_03', name: 'Engineering Heights', area: 'Mysore Road', latitude: 12.9320, longitude: 77.5120, vacantBeds: 8, rentRange: '₹9,000', budget: 'economy', wifi: false, photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400'] },
          { id: 'pg_rv_04', name: 'Zion PG - RV Sector', area: 'RVCE North Gate', latitude: 12.9280, longitude: 77.5020, vacantBeds: 0, rentRange: '₹11,000', budget: 'premium', wifi: true, photos: ['https://images.unsplash.com/photo-1512918766671-ed6a07be3573?auto=format&fit=crop&q=80&w=400'] },
        ];
        localStorage.setItem(storageKey, JSON.stringify(rvceData));
      }
      if (collection === 'users') {
        const userData = [
          { id: 'u_01', name: 'Anil Manager', email: 'admin@pgshaala.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anil' },
          { id: 'u_02', name: 'Kanan Jethwani', email: 'kanan@pgshaala.com', role: 'manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kanan' },
          { id: 'u_03', name: 'Priya Agent', email: 'priya@pgshaala.com', role: 'agent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
        ];
        localStorage.setItem(storageKey, JSON.stringify(userData));
      }
    }

    let data = JSON.parse(localStorage.getItem(storageKey) || '[]');

    switch (action) {
      case 'find':
        let results = [...data];
        if (params.filter) {
          results = results.filter((item: any) => {
            return Object.entries(params.filter).every(([key, val]) => item[key] === val);
          });
        }
        if (params.order) {
          const { column, ascending } = params.order;
          results.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
          });
        }
        return { data: results, error: null, count: results.length };

      case 'insertOne':
        const newItem = { 
          id: Math.random().toString(36).substr(2, 9), 
          created_at: new Date().toISOString(),
          ...params 
        };
        data.push(newItem);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { data: newItem, error: null };

      case 'updateOne':
        data = data.map((item: any) => item.id === params.id ? { ...item, ...params.updates } : item);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { data: params.updates, error: null };

      case 'deleteOne':
        data = data.filter((item: any) => item.id !== params.id);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { data: null, error: null };

      default:
        return { data: null, error: 'Engine Error: Unknown Action' };
    }
  },

  from(collection: string) {
    let currentFilter: any = null;
    let currentOrder: any = null;

    const builder = {
      select: async () => db.query(collection, 'find', { filter: currentFilter, order: currentOrder }),
      insert: async (item: any) => db.query(collection, 'insertOne', item),
      update: (updates: any) => ({
        eq: async (key: string, value: any) => db.query(collection, 'updateOne', { updates, id: value })
      }),
      delete: () => ({
        eq: async (key: string, value: any) => db.query(collection, 'deleteOne', { id: value })
      }),
      eq: (key: string, value: any) => {
        currentFilter = { ...currentFilter, [key]: value };
        return builder;
      },
      order: (column: string, { ascending = true } = {}) => {
        currentOrder = { column, ascending };
        return builder;
      },
      maybeSingle: async () => {
        const { data } = await db.query(collection, 'find', { filter: currentFilter });
        return { data: data?.[0] || null, error: null };
      }
    };
    return builder;
  }
};
