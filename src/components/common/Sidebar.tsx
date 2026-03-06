'use client';

import { NavLink } from '@mantine/core';
import { IconHome, IconPackage, IconUsers, IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/providers/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <NavLink
        label="Dashboard"
        leftSection={<IconHome size={16} />}
        active={isActive('/dashboard')}
        onClick={() => router.push('/dashboard')}
      />
      <NavLink
        label="Expéditions"
        leftSection={<IconPackage size={16} />}
        active={isActive('/shipments') || pathname.startsWith('/shipments/')}
        onClick={() => router.push('/shipments')}
      />
      {user?.role === 'ADMIN' && (
        <NavLink
          label="Utilisateurs"
          leftSection={<IconUsers size={16} />}
          active={isActive('/users')}
          onClick={() => router.push('/users')}
        />
      )}
      <NavLink
        label="Déconnexion"
        leftSection={<IconLogout size={16} />}
        onClick={logout}
        color="red"
      />
    </>
  );
}