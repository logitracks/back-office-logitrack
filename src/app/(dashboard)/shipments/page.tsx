'use client';

import { Button, Group, Title, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useShipments } from '@/hooks/useShipments';
import ShipmentTable from '@/components/shipments/ShipmentTable';

export default function ShipmentsPage() {
  const router = useRouter();
  const { data: shipments, isLoading } = useShipments();

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Expéditions</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => router.push('/shipments/create')}>
          Nouvelle expédition
        </Button>
      </Group>
      <Paper withBorder p="md">
        <ShipmentTable shipments={shipments} isLoading={isLoading} />
      </Paper>
    </>
  );
}