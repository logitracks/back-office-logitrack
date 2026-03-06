'use client';

import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import Sidebar from '@/components/common/Sidebar';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Chargement...</div>;
  if (!user) return null;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>LogiTrack</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Sidebar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}