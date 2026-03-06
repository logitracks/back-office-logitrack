'use client';

import { Button, Group, Title, Paper, Text, Box, TextInput, Select, Badge } from '@mantine/core';
import { IconPlus, IconSearch, IconPackage } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useShipments } from '@/hooks/useShipments';
import ShipmentTable from '@/components/shipments/ShipmentTable';
import { useState, useMemo } from 'react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  IN_TRANSIT: 'En transit',
  OUT_FOR_DELIVERY: 'En livraison',
  DELIVERED: 'Livré',
  CANCELLED: 'Annulé',
};

export default function ShipmentsPage() {
  const router = useRouter();
  const { data: shipments, isLoading } = useShipments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return shipments?.filter(s => {
      const matchSearch = !search ||
        s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        s.senderName.toLowerCase().includes(search.toLowerCase()) ||
        s.receiverName.toLowerCase().includes(search.toLowerCase()) ||
        s.origin.toLowerCase().includes(search.toLowerCase()) ||
        s.destination.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shipments, search, statusFilter]);

  return (
    <Box>
      {/* Page header */}
      <Group justify="space-between" mb="xl" align="flex-start">
        <Box>
          <Group gap={12} mb={4}>
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
            <Title order={2} style={{ fontSize: 26 }}>Expéditions</Title>
          </Group>
          <Text c="dimmed" size="14px">
            {shipments?.length ?? 0} expédition{(shipments?.length ?? 0) !== 1 ? 's' : ''} au total
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => router.push('/shipments/create')}
          size="md"
          style={{ height: 42 }}
        >
          Nouvelle expédition
        </Button>
      </Group>

      {/* Status summary badges */}
      {!isLoading && shipments && (
        <Group mb="lg" gap={8} wrap="wrap">
          {Object.entries(STATUS_LABELS).map(([key, label]) => {
            const count = shipments.filter(s => s.status === key).length;
            if (count === 0) return null;
            const colorMap: Record<string, string> = {
              PENDING: 'yellow',
              IN_TRANSIT: 'blue',
              OUT_FOR_DELIVERY: 'violet',
              DELIVERED: 'green',
              CANCELLED: 'red',
            };
            return (
              <Badge
                key={key}
                size="md"
                variant={statusFilter === key ? 'filled' : 'light'}
                color={colorMap[key]}
                style={{ cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setStatusFilter(statusFilter === key ? null : key)}
              >
                {label} ({count})
              </Badge>
            );
          })}
        </Group>
      )}

      {/* Filters */}
      <Paper withBorder p="md" mb="md">
        <Group gap="md">
          <TextInput
            placeholder="Rechercher par numéro, expéditeur, destinataire…"
            leftSection={<IconSearch size={15} color="var(--text-muted)" />}
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
            size="sm"
          />
          <Select
            placeholder="Tous les statuts"
            data={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            size="sm"
            style={{ width: 200 }}
          />
        </Group>
      </Paper>

      {/* Table */}
      <Paper withBorder p={0} style={{ overflow: 'hidden' }}>
        <ShipmentTable shipments={filtered} isLoading={isLoading} />
      </Paper>
    </Box>
  );
}