'use client';

import { Table, Badge, ActionIcon, Menu, Loader, Text } from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { Shipment } from '@/types';
import { useRouter } from 'next/navigation';
import { useDeleteShipment } from '@/hooks/useShipments';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface Props {
  shipments?: Shipment[];
  isLoading: boolean;
}

const statusColors = {
  PENDING: 'yellow',
  IN_TRANSIT: 'blue',
  OUT_FOR_DELIVERY: 'violet',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

export default function ShipmentTable({ shipments, isLoading }: Props) {
  const router = useRouter();
  const deleteMutation = useDeleteShipment();

  const handleDelete = (id: string, trackingNumber: string) => {
    modals.openConfirmModal({
      title: 'Supprimer l\'expédition',
      children: (
        <Text>Êtes-vous sûr de vouloir supprimer l&apos;expédition {trackingNumber} ?</Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          notifications.show({
            title: 'Succès',
            message: 'Expédition supprimée',
            color: 'green',
          });
        } catch {
          notifications.show({
            title: 'Erreur',
            message: 'Impossible de supprimer',
            color: 'red',
          });
        }
      },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>N° de suivi</Table.Th>
          <Table.Th>Expéditeur</Table.Th>
          <Table.Th>Destinataire</Table.Th>
          <Table.Th>Origine</Table.Th>
          <Table.Th>Destination</Table.Th>
          <Table.Th>Statut</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {shipments?.map((shipment) => (
          <Table.Tr key={shipment.id}>
            <Table.Td>{shipment.trackingNumber}</Table.Td>
            <Table.Td>{shipment.senderName}</Table.Td>
            <Table.Td>{shipment.receiverName}</Table.Td>
            <Table.Td>{shipment.origin}</Table.Td>
            <Table.Td>{shipment.destination}</Table.Td>
            <Table.Td>
              <Badge color={statusColors[shipment.status]}>{shipment.status}</Badge>
            </Table.Td>
            <Table.Td>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEye size={14} />} onClick={() => router.push(`/shipments/${shipment.id}`)}>
                    Voir
                  </Menu.Item>
                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => router.push(`/shipments/${shipment.id}/edit`)}>
                    Modifier
                  </Menu.Item>
                  <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(shipment.id, shipment.trackingNumber)}>
                    Supprimer
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}