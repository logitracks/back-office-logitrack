'use client';

import { Box, Title, Text, Group, Button } from '@mantine/core';
import { IconArrowLeft, IconPackage } from '@tabler/icons-react';
import ShipmentForm from '@/components/shipments/ShipmentForm';
import { useRouter } from 'next/navigation';

export default function CreateShipmentPage() {
  const router = useRouter();
  return (
    <Box>
      <Box mb="xl">
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconArrowLeft size={13} />}
          onClick={() => router.push('/shipments')}
          mb={12}
          color="gray"
          style={{ color: 'var(--text-secondary)' }}
        >
          Retour aux expéditions
        </Button>
        <Group gap={12} align="center" mb={4}>
          <Box
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPackage size={20} color="var(--primary)" strokeWidth={2} />
          </Box>
          <Title order={2} style={{ fontSize: 26 }}>Nouvelle expédition</Title>
        </Group>
        <Text c="dimmed" size="14px">
          Remplissez le formulaire ci-dessous pour créer une nouvelle expédition
        </Text>
      </Box>
      <ShipmentForm />
    </Box>
  );
}