'use client';

import { useParams, useRouter } from 'next/navigation';
import { useShipment } from '@/hooks/useShipments';
import {
  Title, Paper, Grid, Text, Loader, Stack, Timeline,
  Box, Group, Button, Badge, Divider
} from '@mantine/core';
import {
  IconCircleCheck, IconCircleDashed, IconTruck, IconPackage,
  IconArrowLeft, IconEdit, IconMapPin, IconUser, IconCalendar
} from '@tabler/icons-react';

const statusConfig: Record<string, { color: string; bg: string; label: string; mantine: string }> = {
  PENDING: { color: '#92400E', bg: '#FEF3C7', label: 'En attente', mantine: 'yellow' },
  IN_TRANSIT: { color: '#1D4ED8', bg: '#DBEAFE', label: 'En transit', mantine: 'blue' },
  OUT_FOR_DELIVERY: { color: '#5B21B6', bg: '#EDE9FE', label: 'En livraison', mantine: 'violet' },
  DELIVERED: { color: '#065F46', bg: '#D1FAE5', label: 'Livré', mantine: 'green' },
  CANCELLED: { color: '#991B1B', bg: '#FEE2E2', label: 'Annulé', mantine: 'red' },
};

const statusIcons = {
  PENDING: IconCircleDashed,
  IN_TRANSIT: IconTruck,
  OUT_FOR_DELIVERY: IconPackage,
  DELIVERED: IconCircleCheck,
  CANCELLED: IconCircleCheck,
};

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; color?: string }>; children: React.ReactNode }) {
  return (
    <Paper withBorder p="xl">
      <Group gap={10} mb="lg">
        <Box
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={17} color="var(--primary)" />
        </Box>
        <Text fw={700} size="15px" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</Text>
      </Group>
      {children}
    </Paper>
  );
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: shipment, isLoading } = useShipment(id);

  if (isLoading) {
    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: 16 }}>
        <Loader size="lg" color="orange" />
        <Text c="dimmed">Chargement de l&apos;expédition…</Text>
      </Box>
    );
  }

  if (!shipment) {
    return (
      <Box ta="center" py={80}>
        <Text size="xl" fw={700} mb={8}>Expédition introuvable</Text>
        <Text c="dimmed" mb="xl">Cette expédition n&apos;existe pas ou a été supprimée</Text>
        <Button variant="default" leftSection={<IconArrowLeft size={15} />} onClick={() => router.push('/shipments')}>
          Retour aux expéditions
        </Button>
      </Box>
    );
  }

  const status = statusConfig[shipment.status] || statusConfig.PENDING;
  const StatusIcon = statusIcons[shipment.status];

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl" align="flex-start">
        <Box>
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
          <Group gap={12} align="center">
            <Title order={2} style={{ fontSize: 26 }}>
              {shipment.trackingNumber}
            </Title>
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 12px',
                borderRadius: 8,
                background: status.bg,
              }}
            >
              <Text size="12px" fw={700} style={{ color: status.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {status.label}
              </Text>
            </Box>
          </Group>
          <Group gap={16} mt={8}>
            <Group gap={5}>
              <IconCalendar size={13} color="var(--text-muted)" />
              <Text size="12px" c="dimmed">
                Créée le {new Date(shipment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </Group>
            <Group gap={5}>
              <IconMapPin size={13} color="var(--text-muted)" />
              <Text size="12px" c="dimmed">{shipment.origin} → {shipment.destination}</Text>
            </Group>
          </Group>
        </Box>
        <Button
          leftSection={<IconEdit size={15} />}
          onClick={() => router.push(`/shipments/${id}/edit`)}
          size="md"
        >
          Modifier
        </Button>
      </Group>

      {/* Main content */}
      <Grid gutter="lg">
        {/* Left column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Sender / Receiver */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <SectionCard title="Expéditeur" icon={IconUser}>
                  <Text fw={600} size="15px" mb={4}>{shipment.senderName}</Text>
                  {shipment.senderAddress && (
                    <Group gap={6} align="flex-start">
                      <IconMapPin size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Text size="13px" c="dimmed" style={{ lineHeight: 1.5 }}>{shipment.senderAddress}</Text>
                    </Group>
                  )}
                </SectionCard>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <SectionCard title="Destinataire" icon={IconUser}>
                  <Text fw={600} size="15px" mb={4}>{shipment.receiverName}</Text>
                  {shipment.receiverAddress && (
                    <Group gap={6} align="flex-start">
                      <IconMapPin size={13} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Text size="13px" c="dimmed" style={{ lineHeight: 1.5 }}>{shipment.receiverAddress}</Text>
                    </Group>
                  )}
                </SectionCard>
              </Grid.Col>
            </Grid>

            {/* Trajet */}
            <Paper withBorder p="xl">
              <Group gap={10} mb="lg">
                <Box style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconTruck size={17} color="var(--primary)" />
                </Box>
                <Text fw={700} size="15px" style={{ fontFamily: "'Syne', sans-serif" }}>Trajet</Text>
              </Group>
              <Group justify="space-between" align="center">
                <Box ta="center">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    <IconMapPin size={22} color="rgba(255,255,255,0.8)" />
                  </Box>
                  <Text fw={700} size="15px">{shipment.origin}</Text>
                  <Text size="12px" c="dimmed">Origine</Text>
                </Box>
                <Box style={{ flex: 1, padding: '0 20px', position: 'relative' }}>
                  <Box
                    style={{
                      height: 2,
                      background: `linear-gradient(90deg, var(--secondary), var(--primary))`,
                      borderRadius: 999,
                      position: 'relative',
                    }}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(249,115,22,0.35)',
                      }}
                    >
                      <IconTruck size={14} color="white" />
                    </Box>
                  </Box>
                </Box>
                <Box ta="center">
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                    }}
                  >
                    <IconMapPin size={22} color="white" />
                  </Box>
                  <Text fw={700} size="15px">{shipment.destination}</Text>
                  <Text size="12px" c="dimmed">Destination</Text>
                </Box>
              </Group>
            </Paper>

            {/* Products */}
            <SectionCard title={`Produits (${shipment.products.length})`} icon={IconPackage}>
              {shipment.products.map((product, index) => (
                <Box key={product.id}>
                  {index > 0 && <Divider my="sm" />}
                  <Group justify="space-between">
                    <Box>
                      <Text fw={600} size="14px">{product.description}</Text>
                      <Text size="12px" c="dimmed">
                        {product.weight && `${product.weight} kg`}
                      </Text>
                    </Box>
                    <Badge variant="light" color="orange" size="md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Qté: {product.quantity}
                    </Badge>
                  </Group>
                </Box>
              ))}
            </SectionCard>
          </Stack>
        </Grid.Col>

        {/* Right column - Timeline */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="xl" h="100%">
            <Group gap={10} mb="lg">
              <Box style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StatusIcon size={17} color="rgba(255,255,255,0.9)" />
              </Box>
              <Text fw={700} size="15px" style={{ fontFamily: "'Syne', sans-serif" }}>
                Historique ({shipment.events.length})
              </Text>
            </Group>

            {shipment.events.length === 0 ? (
              <Box ta="center" py={32}>
                <Text size="13px" c="dimmed">Aucun événement de suivi</Text>
              </Box>
            ) : (
              <Timeline
                active={shipment.events.length - 1}
                bulletSize={20}
                lineWidth={2}
                color="orange"
              >
                {shipment.events.map((event) => (
                  <Timeline.Item
                    key={event.id}
                    bullet={<StatusIcon size={10} />}
                    title={
                      <Text size="13px" fw={600}>{event.location}</Text>
                    }
                  >
                    <Text size="12px" c="dimmed" mt={2}>{event.message}</Text>
                    <Text size="11px" c="var(--text-muted)" mt={4}>
                      {new Date(event.timestamp).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}