// src/data/contacts.js
// The Help & Helplines directory.
//
// The live app reads this from the Supabase `contacts` table, but we also ship
// it here as a static fallback so the page is never empty — it shows this
// content even with no backend, and the same rows are seeded into Supabase via
// supabase/schema.sql.
//
// ⚠️  The emergency, MOM and TADM numbers are verified against public sources.
//     The embassy and NGO entries marked `verified: false` are SAMPLE data for
//     layout viewing — confirm every number against the official source before
//     launching for real.
//
// Shape matches the `contacts` table: id, name, category, phone, description,
// place_id, sort_order. Categories: emergency | work | embassies | wellbeing.

export const CONTACTS = [
  // ---------------- Emergency ----------------
  { id: 1,  name: 'Police (Emergency)',       category: 'emergency', phone: '999',           description: 'For crimes, danger to life, or anything happening right now.', place_id: null, sort_order: 1 },
  { id: 2,  name: 'Ambulance & Fire (SCDF)',  category: 'emergency', phone: '995',           description: 'Medical emergencies, fires and rescue.', place_id: null, sort_order: 2 },
  { id: 3,  name: 'Police Non-Emergency',     category: 'emergency', phone: '1800 255 0000', description: 'Report non-urgent matters to the police.', place_id: null, sort_order: 3 },

  // ---------------- Work & pay ----------------
  { id: 4,  name: 'Ministry of Manpower (MOM)', category: 'work', phone: '6438 5122',      description: 'Work pass, salary and employment-condition questions.', place_id: null, sort_order: 1 },
  { id: 5,  name: 'TADM — Salary & Claims',     category: 'work', phone: '1800 336 4056',  description: 'Free help with salary and statutory claims (Tripartite Alliance for Dispute Management).', place_id: null, sort_order: 2 },

  // ---------------- Embassies (home-country missions in Singapore) ----------------
  // NOTE: embassy numbers below marked sample — verify on each mission's site.
  { id: 6,  name: 'Philippines Embassy',                 category: 'embassies', phone: '6737 3977',   description: 'Consular help for Filipino citizens in Singapore.',                       place_id: null, sort_order: 1 },
  { id: 7,  name: 'Embassy of the Republic of Indonesia',category: 'embassies', phone: '6737 7422',   description: 'Consular help for Indonesian citizens in Singapore.',                    place_id: null, sort_order: 2 },
  { id: 8,  name: 'High Commission of India',            category: 'embassies', phone: '6737 6777',   description: 'Consular help for Indian citizens in Singapore.',                        place_id: null, sort_order: 3 },
  { id: 9,  name: 'Embassy of Myanmar',                  category: 'embassies', phone: '6737 9760',   description: 'Consular help for Myanmar citizens in Singapore.',                       place_id: null, sort_order: 4 },
  { id: 10, name: 'High Commission of Sri Lanka',        category: 'embassies', phone: '6258 4180',   description: 'Consular help for Sri Lankan citizens in Singapore.',                    place_id: null, sort_order: 5 },

  // ---------------- Wellbeing ----------------
  { id: 11, name: 'Samaritans of Singapore',          category: 'wellbeing', phone: '1767',         description: 'Confidential emotional support, 24 hours a day.',                         place_id: null, sort_order: 1 },
  { id: 12, name: 'HOME (Migrant Workers)',           category: 'wellbeing', phone: '1800 797 7977', description: 'Shelter, advice and casework for migrant workers in distress. (sample)', place_id: null, sort_order: 2 },
  { id: 13, name: 'TWC2 — Cuff Road Food Programme',  category: 'wellbeing', phone: '6476 9527',     description: 'Support and meals for migrant workers in difficulty. (sample)',          place_id: null, sort_order: 3 },
]
