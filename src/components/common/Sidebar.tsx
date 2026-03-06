'use client';

import { NavLink, Box, Text, Divider, Group } from '@mantine/core';
import {
  IconHome2,
  IconPackage,
  IconUsers,
  IconLogout,
  IconTruck,
  IconChevronRight,
} from '@tabler/icons-react';
import { useAuth } from '@/providers/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', icon: IconHome2, path: '/dashboard' },
  { label: 'Expéditions', icon: IconPackage, path: '/shipments' },
  { label: 'Utilisateurs', icon: IconUsers, path: '/users', adminOnly: true },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Logo area */}
      <Box mb="xl" px={4}>
        <Group gap={10} mb={4}>
          <Box
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(249,115,22,0.40)',
            }}
          >
            <IconTruck size={20} color="white" />
          </Box>
          <Box>
            <Text
              fw={800}
              size="xl"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              Logi<span style={{ color: '#F97316' }}>Track</span>
            </Text>
            <Text size="10px" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Back Office
            </Text>
          </Box>
        </Group>
      </Box>

      {/* Nav section label */}
      <Text
        size="10px"
        style={{
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          paddingLeft: 14,
          marginBottom: 8,
        }}
      >
        Navigation
      </Text>

      {/* Nav items */}
      <Box style={{ flex: 1 }}>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'ADMIN') return null;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={
                <item.icon
                  size={17}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              }
              rightSection={
                active ? <IconChevronRight size={13} strokeWidth={2.5} /> : null
              }
              active={active}
              onClick={() => router.push(item.path)}
              style={{ marginBottom: 2 }}
            />
          );
        })}
      </Box>

      {/* Divider */}
      <Divider
        my="md"
        style={{
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      />

      {/* User info */}
      <Box
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 8,
        }}
      >
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F97316, #FB923C)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: 'white',
            marginBottom: 6,
          }}
        >
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </Box>
        <Text size="13px" fw={600} style={{ color: '#FFFFFF', lineHeight: 1.2 }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text size="11px" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
          {user?.email}
        </Text>
      </Box>

      {/* Logout */}
      <NavLink
        label="Déconnexion"
        leftSection={<IconLogout size={16} strokeWidth={1.8} />}
        onClick={logout}
        style={{
          color: 'rgba(239,68,68,0.85)',
          borderRadius: 8,
        }}
        styles={{
          root: {
            '&:hover': {
              background: 'rgba(239,68,68,0.12) !important',
              color: '#EF4444 !important',
            },
          },
        }}
      />
    </Box>
  );
}