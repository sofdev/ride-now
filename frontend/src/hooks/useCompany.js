import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export function useCompany() {
  const { currentUser } = useAuth();
  const [company,     setCompany]     = useState(null);
  const [companyRole, setCompanyRole] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!currentUser) { setCompany(null); setCompanyRole(null); setLoading(false); return; }

    let cancelled = false;
    (async () => {
      try {
        const { data: profile } = await api.get(`/api/user-profiles/${currentUser.uid}`);
        if (!cancelled && profile?.companyId) {
          const { data: company } = await api.get(`/api/companies/${profile.companyId}`);
          if (!cancelled) {
            setCompany(company);
            setCompanyRole(profile.role);
          }
        }
      } catch {
        // pas de profil = utilisateur particulier
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [currentUser]);

  return { company, companyRole, loading };
}
