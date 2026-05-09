import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';
import * as orderService from '../services/orderService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, logout, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const uid = user?.id || user?._id;
  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setCity(user?.city || '');
    setPhone(user?.phone || '');
  }, [user]);

  useEffect(() => {
    (async () => {
      if (!uid) return;
      const orders = await orderService.getUserOrders(uid);
      const list = Array.isArray(orders) ? orders : orders?.orders || [];
      setOrdersCount(list.length);
    })();
  }, [uid]);

  const save = async () => {
    try {
      const data = await authService.updateProfile(uid, { firstName, lastName, city, phone });
      setUserProfile({ ...user, ...data });
    } catch {
      setUserProfile({ ...user, firstName, lastName, city, phone });
    }
    setEdit(false);
  };

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR')
    : '—';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded-2xl overflow-hidden shadow-card border border-[#F0F0F0] mb-8">
        <div className="h-28 bg-gradient-to-r from-brand-rose to-brand-rose-dark" />
        <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-xl font-bold text-brand-rose">
            {(user?.firstName?.[0] || '?').toUpperCase()}
            {(user?.lastName?.[0] || '').toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-brand-ink">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-brand-ink/55">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="border border-[#F0F0F0] rounded-2xl p-6 bg-white shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Informations</h2>
          {!edit ? (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="text-sm font-semibold text-brand-rose"
            >
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="text-sm px-3 py-1 rounded-full border border-[#F0F0F0]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={save}
                className="text-sm px-3 py-1 rounded-full bg-brand-rose text-white"
              >
                Enregistrer
              </button>
            </div>
          )}
        </div>
        {!edit ? (
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-brand-ink/50">Prénom</dt>
              <dd className="font-medium">{user?.firstName}</dd>
            </div>
            <div>
              <dt className="text-brand-ink/50">Nom</dt>
              <dd className="font-medium">{user?.lastName}</dd>
            </div>
            <div>
              <dt className="text-brand-ink/50">Ville</dt>
              <dd className="font-medium">{user?.city || '—'}</dd>
            </div>
            <div>
              <dt className="text-brand-ink/50">Téléphone</dt>
              <dd className="font-medium">{user?.phone || '—'}</dd>
            </div>
          </dl>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl border border-[#F0F0F0] px-3 py-2 text-sm"
              placeholder="Prénom"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-xl border border-[#F0F0F0] px-3 py-2 text-sm"
              placeholder="Nom"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-[#F0F0F0] px-3 py-2 text-sm"
              placeholder="Ville"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-[#F0F0F0] px-3 py-2 text-sm"
              placeholder="Téléphone"
            />
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-[#F0F0F0] rounded-2xl p-4 text-center bg-white shadow-card">
          <p className="text-2xl font-bold text-brand-rose">{ordersCount}</p>
          <p className="text-xs text-brand-ink/55 mt-1">Commandes</p>
        </div>
        <div className="border border-[#F0F0F0] rounded-2xl p-4 text-center bg-white shadow-card">
          <p className="text-2xl font-bold text-brand-rose">0</p>
          <p className="text-xs text-brand-ink/55 mt-1">Favoris</p>
        </div>
        <div className="border border-[#F0F0F0] rounded-2xl p-4 text-center bg-white shadow-card">
          <p className="text-sm font-semibold text-brand-ink">{joined}</p>
          <p className="text-xs text-brand-ink/55 mt-1">Membre depuis</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full py-3 rounded-[25px] border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition"
      >
        Déconnexion
      </button>
    </div>
  );
}
