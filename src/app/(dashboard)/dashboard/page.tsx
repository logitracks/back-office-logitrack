'use client';

import { Title, Text } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <Title order={2}>Bienvenue, {user?.firstName} {user?.lastName}</Title>
      <Text>Ceci est le tableau de bord de gestion des expéditions.</Text>
    </>
  );
}