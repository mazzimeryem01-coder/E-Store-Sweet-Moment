/**
 * Erreur réseau / timeout / serveur injoignable (axios).
 * Ne doit pas être confondu avec 401 (identifiants incorrects).
 */
export default function isOfflineError(err) {
  if (!err) return false;
  if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return true;
  }
  if (err.message === 'Network Error') return true;
  if (err.request && !err.response) return true;
  return false;
}
