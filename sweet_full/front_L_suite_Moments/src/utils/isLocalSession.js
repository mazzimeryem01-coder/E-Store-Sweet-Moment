/**
 * IDs produits par signInLocal / signUpLocal (session démo sans API).
 * Spring attend un Long pour userId dans l’URL — ne pas appeler le backend avec ces ids.
 */
export function isLocalSessionUserId(userId) {
  if (userId == null || userId === '') return false;
  return String(userId).startsWith('local-');
}
