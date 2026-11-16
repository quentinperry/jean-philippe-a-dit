// Connexion au recueil partagé (Supabase).
// Les deux valeurs se trouvent dans Supabase : Project Settings → API (ou « Connect »).
//  - supabaseUrl : « Project URL », ex. https://abcdefgh.supabase.co
//  - supabaseKey : la clé PUBLIQUE (« publishable » ou « anon »). Elle est faite pour
//    être visible dans le navigateur ; ce sont les règles de supabase/schema.sql qui
//    protègent les données. Ne mettez JAMAIS ici la clé « secret » / « service_role ».
// Laissez vide pour fonctionner sans Supabase (serveur Node ou stockage local).
window.JP_CONFIG = {
  supabaseUrl: "https://gbhypqktnfwogsxqrmsi.supabase.co",
  supabaseKey: "sb_publishable_CmpgqL7AvbNRcmQxSQnGiQ_Vos7aHA4"
};
