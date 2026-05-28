import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Helper wrappers that mimic the base44 entity API your components already use
// e.g.  db.Member.list()  →  db.Member.list()
//       dbMember.create() →  db.Member.create()
// ---------------------------------------------------------------------------

function makeEntity(tableName) {
  return {
    async list(orderBy = 'created_at') {
      // strip the leading '-' that base44 used for descending
      const descending = orderBy.startsWith('-');
      const col = descending ? orderBy.slice(1) : orderBy;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(col, { ascending: !descending });
      if (error) throw error;
      return data;
    },

    async get(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    async create(payload) {
      const { data, error } = await supabase
        .from(tableName)
        .insert([payload])
      if (error) throw error;
      return data;
    },

    async update(id, payload) {
      const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  };
}

// Drop-in replacement for db*
export const db = {
  Member:      makeEntity('members'),
  Assignment:  makeEntity('assignments'),
  Event:       makeEntity('events'),
  Donation:    makeEntity('donations'),
  SiteContent: makeEntity('site_content'),
};
