'use client';

import { useParams, useRouter } from 'next/navigation';
import { useShipment } from '@/hooks/useShipments';
import { Title, Loader, Box, Text, Group, Button } from '@mantine/core';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';
import ShipmentForm from '@/components/shipments/ShipmentForm';

export default function EditShipmentPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: shipment, isLoading } = useShipment(id);

  if (isLoading) {
    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: 16 }}>
        <Loader size="lg" color="orange" />
        <Text c="dimmed">Chargement…</Text>
      </Box>
    );
  }

  if (!shipment) {
    return (
      <Box ta="center" py={80}>
        <Text size="xl" fw={700} mb={8}>Expédition introuvable</Text>
        <Button variant="default" leftSection={<IconArrowLeft size={15} />} onClick={() => router.push('/shipments')}>
          Retour aux expéditions
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb="xl">
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconArrowLeft size={13} />}
          onClick={() => router.push(`/shipments/${id}`)}
          mb={12}
          color="gray"
          style={{ color: 'var(--text-secondary)' }}
        >
          Retour aux détails
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
            <IconEdit size={20} color="var(--primary)" strokeWidth={2} />
          </Box>
          <Title order={2} style={{ fontSize: 26 }}>Modifier l&apos;expédition</Title>
        </Group>
        <Text c="dimmed" size="14px">
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{shipment.trackingNumber}</span> — Mettez à jour les informations
        </Text>
      </Box>
      <ShipmentForm initialValues={shipment} isEditing />
    </Box>
  );
}