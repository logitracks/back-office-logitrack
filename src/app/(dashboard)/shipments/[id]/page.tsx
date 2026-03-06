'use client';

import { useParams } from 'next/navigation';
import { useShipment } from '@/hooks/useShipments';
import { Title, Paper, Grid, Text, Badge, Loader, Stack, Timeline } from '@mantine/core';
import { IconCircleCheck, IconCircleDashed, IconTruck, IconPackage } from '@tabler/icons-react';

const statusColors = {
  PENDING: 'yellow',
  IN_TRANSIT: 'blue',
  OUT_FOR_DELIVERY: 'violet',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusIcons = {
  PENDING: IconCircleDashed,
  IN_TRANSIT: IconTruck,
  OUT_FOR_DELIVERY: IconPackage,
  DELIVERED: IconCircleCheck,
  CANCELLED: IconCircleCheck,
};

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: shipment, isLoading } = useShipment(id);

  if (isLoading) return <Loader />;
  if (!shipment) return <Text>Expédition non trouvée</Text>;

  const StatusIcon = statusIcons[shipment.status];

  return (
    <>
      <Title order={2} mb="md">Expédition {shipment.trackingNumber}</Title>
      <Grid>
        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Stack>
              <Text fw={700}>Expéditeur</Text>
              <Text>{shipment.senderName}</Text>
              <Text size="sm">{shipment.senderAddress}</Text>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Stack>
              <Text fw={700}>Destinataire</Text>
              <Text>{shipment.receiverName}</Text>
              <Text size="sm">{shipment.receiverAddress}</Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" mt="md">
        <Grid>
          <Grid.Col span={4}>
            <Text fw={700}>Origine</Text>
            <Text>{shipment.origin}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text fw={700}>Destination</Text>
            <Text>{shipment.destination}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text fw={700}>Statut</Text>
            <Badge color={statusColors[shipment.status]} size="lg">
              {shipment.status}
            </Badge>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper withBorder p="md" mt="md">
        <Title order={4}>Produits</Title>
        {shipment.products.map((product) => (
          <Paper key={product.id} withBorder p="xs" mt="xs">
            <Text>{product.description} - Quantité: {product.quantity} {product.weight && `- Poids: ${product.weight} kg`}</Text>
          </Paper>
        ))}
      </Paper>

      <Paper withBorder p="md" mt="md">
        <Title order={4}>Suivi</Title>
        <Timeline active={shipment.events.length - 1} bulletSize={24} lineWidth={2}>
          {shipment.events.map((event) => (
            <Timeline.Item
              key={event.id}
              bullet={<StatusIcon size={12} />}
              title={event.location}
            >
              <Text size="sm">{event.message}</Text>
              <Text size="xs" c="dimmed">{new Date(event.timestamp).toLocaleString()}</Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </>
  );
}
