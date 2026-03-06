'use client';

import { AppShell, Burger, Group, Text, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import Sidebar from '@/components/common/Sidebar';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IconTruck } from '@tabler/icons-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <IconTruck size={28} color="white" />
          </div>
          <Text size="sm" c="dimmed" fw={500}>Chargement…</Text>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.92); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="xl"
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="var(--text-secondary)"
            />
            <Group gap={10} visibleFrom="sm">
              <Box
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(249,115,22,0.30)',
                }}
              >
                <IconTruck size={18} color="white" />
              </Box>
              <Text
                fw={800}
                size="lg"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: '-0.03em',
                  color: 'var(--secondary)',
                }}
              >
                Logi<span style={{ color: 'var(--primary)' }}>Track</span>
              </Text>
            </Group>
          </Group>
          <Group gap="sm">
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--border-light)',
                border: '1px solid var(--border)',
              }}
            >
              <Box
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316, #FB923C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: 'white',
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </Box>
              <Box visibleFrom="xs">
                <Text size="13px" fw={600} lh={1.2} c="var(--text-primary)">{user.firstName} {user.lastName}</Text>
                <Text size="11px" c="dimmed" lh={1.2}>{user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</Text>
              </Box>
            </Box>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box className="page-enter">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}