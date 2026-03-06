'use client';

import { Table, Badge, ActionIcon, Menu, Loader, Text, Box, Group } from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconEye, IconSearch, IconInbox } from '@tabler/icons-react';
import { Shipment } from '@/types';
import { useRouter } from 'next/navigation';
import { useDeleteShipment } from '@/hooks/useShipments';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface Props {
  shipments?: Shipment[];
  isLoading: boolean;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: '#92400E', bg: '#FEF3C7', label: 'En attente' },
  IN_TRANSIT: { color: '#1D4ED8', bg: '#DBEAFE', label: 'En transit' },
  OUT_FOR_DELIVERY: { color: '#5B21B6', bg: '#EDE9FE', label: 'En livraison' },
  DELIVERED: { color: '#065F46', bg: '#D1FAE5', label: 'Livré' },
  CANCELLED: { color: '#991B1B', bg: '#FEE2E2', label: 'Annulé' },
};

export default function ShipmentTable({ shipments, isLoading }: Props) {
  const router = useRouter();
  const deleteMutation = useDeleteShipment();
  const [searchQuery] = useState('');

  const filtered = shipments?.filter(s =>
    !searchQuery ||
    s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, trackingNumber: string) => {
    modals.openConfirmModal({
      title: 'Supprimer l\'expédition',
      children: (
        <Text size="14px">
          Êtes-vous sûr de vouloir supprimer l&apos;expédition{' '}
          <strong style={{ color: 'var(--primary)' }}>{trackingNumber}</strong> ? Cette action est irréversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          notifications.show({
            title: 'Expédition supprimée',
            message: `${trackingNumber} a été supprimée avec succès`,
            color: 'green',
          });
        } catch {
          notifications.show({
            title: 'Erreur',
            message: 'Impossible de supprimer cette expédition',
            color: 'red',
          });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 16 }}>
        <Loader size="md" color="orange" />
        <Text size="14px" c="dimmed">Chargement des expéditions…</Text>
      </Box>
    );
  }

  if (!filtered?.length) {
    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 }}>
        <Box
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {searchQuery ? <IconSearch size={28} color="var(--text-muted)" /> : <IconInbox size={28} color="var(--text-muted)" />}
        </Box>
        <Text fw={600} size="15px" c="var(--text-secondary)">
          {searchQuery ? 'Aucun résultat trouvé' : 'Aucune expédition'}
        </Text>
        <Text size="13px" c="dimmed">
          {searchQuery ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre première expédition en cliquant sur le bouton ci-dessus'}
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ overflowX: 'auto' }}>
      <Table
        highlightOnHover
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>N° de suivi</Table.Th>
            <Table.Th>Expéditeur</Table.Th>
            <Table.Th>Destinataire</Table.Th>
            <Table.Th>Trajet</Table.Th>
            <Table.Th>Statut</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered?.map((shipment) => {
            const status = statusConfig[shipment.status] || statusConfig.PENDING;
            return (
              <Table.Tr
                key={shipment.id}
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/shipments/${shipment.id}`)}
              >
                <Table.Td onClick={e => e.stopPropagation()}>
                  <Text
                    size="13px"
                    fw={700}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      letterSpacing: '0.02em',
                    }}
                    onClick={() => router.push(`/shipments/${shipment.id}`)}
                  >
                    {shipment.trackingNumber}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="14px" fw={500}>{shipment.senderName}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="14px" fw={500}>{shipment.receiverName}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    <Text size="13px" c="dimmed">{shipment.origin}</Text>
                    <Text size="12px" c="var(--text-muted)">→</Text>
                    <Text size="13px" c="dimmed">{shipment.destination}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Box
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: status.bg,
                      border: `1px solid ${status.color}20`,
                    }}
                  >
                    <Text size="11px" fw={700} style={{ color: status.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {status.label}
                    </Text>
                  </Box>
                </Table.Td>
                <Table.Td>
                  <Text size="12px" c="dimmed">
                    {new Date(shipment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </Table.Td>
                <Table.Td onClick={e => e.stopPropagation()} style={{ textAlign: 'right' }}>
                  <Menu shadow="md" width={180} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDots size={15} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => router.push(`/shipments/${shipment.id}`)}
                      >
                        Voir les détails
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => router.push(`/shipments/${shipment.id}/edit`)}
                      >
                        Modifier
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleDelete(shipment.id, shipment.trackingNumber)}
                      >
                        Supprimer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
}