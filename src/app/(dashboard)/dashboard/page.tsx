'use client';

import { Title, Text, Grid, Paper, Group, Box, RingProgress, Badge, Skeleton } from '@mantine/core';
import { IconPackage, IconTruck, IconCircleCheck, IconClock, IconArrowUpRight, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/providers/AuthProvider';
import { useShipments } from '@/hooks/useShipments';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bgColor: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color, bgColor, trend }: StatCardProps) {
  return (
    <Paper withBorder p="xl" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background circle */}
      <Box
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: bgColor,
          opacity: 0.5,
        }}
      />
      <Group justify="space-between" mb="md">
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color={color} strokeWidth={2} />
        </Box>
        {trend && (
          <Badge
            size="sm"
            variant="light"
            color="green"
            leftSection={<IconArrowUpRight size={11} />}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {trend}
          </Badge>
        )}
      </Group>
      <Text
        size="32px"
        fw={800}
        style={{
          fontFamily: "'Syne', sans-serif",
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </Text>
      <Text size="14px" fw={600} c="var(--text-primary)" mb={2}>{title}</Text>
      <Text size="12px" c="dimmed">{subtitle}</Text>
    </Paper>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: shipments, isLoading } = useShipments();

  const stats = {
    total: shipments?.length || 0,
    pending: shipments?.filter(s => s.status === 'PENDING').length || 0,
    inTransit: shipments?.filter(s => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length || 0,
    delivered: shipments?.filter(s => s.status === 'DELIVERED').length || 0,
    cancelled: shipments?.filter(s => s.status === 'CANCELLED').length || 0,
  };

  const deliveryRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  const statCards: StatCardProps[] = [
    {
      title: 'Total expéditions',
      value: stats.total,
      subtitle: 'Toutes les expéditions',
      icon: IconPackage,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      trend: '+12%',
    },
    {
      title: 'En attente',
      value: stats.pending,
      subtitle: 'Nécessitent traitement',
      icon: IconClock,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      title: 'En transit',
      value: stats.inTransit,
      subtitle: 'En cours de livraison',
      icon: IconTruck,
      color: '#F97316',
      bgColor: '#FEF3E2',
      trend: '+5%',
    },
    {
      title: 'Livrées',
      value: stats.delivered,
      subtitle: 'Livraisons réussies',
      icon: IconCircleCheck,
      color: '#10B981',
      bgColor: '#D1FAE5',
      trend: '+8%',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb="xl">
        <Group align="flex-end" justify="space-between">
          <Box>
            <Text size="13px" fw={600} c="var(--primary)" mb={4} style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Bienvenue de retour
            </Text>
            <Title order={1} style={{ fontSize: 32, marginBottom: 4 }}>
              {user?.firstName} {user?.lastName} 👋
            </Title>
            <Text c="dimmed" size="15px">
              Voici un aperçu de votre activité logistique
            </Text>
          </Box>
          <Badge
            size="lg"
            variant="outline"
            color="gray"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Badge>
        </Group>
      </Box>

      {/* Stats Grid */}
      <Grid mb="xl" gutter="lg">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid.Col key={i} span={{ base: 12, xs: 6, md: 3 }}>
                <Skeleton height={160} radius="md" />
              </Grid.Col>
            ))
          : statCards.map((card, i) => (
              <Grid.Col key={i} span={{ base: 12, xs: 6, md: 3 }}>
                <StatCard {...card} />
              </Grid.Col>
            ))
        }
      </Grid>

      {/* Second row */}
      <Grid gutter="lg">
        {/* Delivery rate */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="xl" h="100%">
            <Text fw={700} size="15px" mb="lg" style={{ fontFamily: "'Syne', sans-serif" }}>
              Taux de livraison
            </Text>
            <Group justify="center" mb="md">
              <RingProgress
                size={160}
                thickness={14}
                roundCaps
                sections={[
                  { value: deliveryRate, color: '#10B981' },
                  { value: stats.cancelled > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0, color: '#EF4444' },
                ]}
                label={
                  <Box ta="center">
                    <Text fw={800} size="28px" style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{deliveryRate}%</Text>
                    <Text size="11px" c="dimmed">Succès</Text>
                  </Box>
                }
              />
            </Group>
            <Box>
              {[
                { label: 'Livrées', value: stats.delivered, color: '#10B981' },
                { label: 'Annulées', value: stats.cancelled, color: '#EF4444' },
                { label: 'En cours', value: stats.inTransit + stats.pending, color: '#F97316' },
              ].map(item => (
                <Group key={item.label} justify="space-between" mb={8}>
                  <Group gap={8}>
                    <Box style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                    <Text size="13px" c="dimmed">{item.label}</Text>
                  </Group>
                  <Text size="13px" fw={600}>{item.value}</Text>
                </Group>
              ))}
            </Box>
          </Paper>
        </Grid.Col>

        {/* Quick status overview */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="xl" h="100%">
            <Text fw={700} size="15px" mb="lg" style={{ fontFamily: "'Syne', sans-serif" }}>
              Aperçu des statuts
            </Text>
            {isLoading ? (
              <Box>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={44} mb={10} radius="sm" />
                ))}
              </Box>
            ) : (
              <Box>
                {[
                  { label: 'En attente', count: stats.pending, color: '#F59E0B', bg: '#FEF3C7', icon: IconClock, desc: 'Attente de prise en charge' },
                  { label: 'En transit', count: stats.inTransit, color: '#3B82F6', bg: '#DBEAFE', icon: IconTruck, desc: 'En route vers la destination' },
                  { label: 'Livrées', count: stats.delivered, color: '#10B981', bg: '#D1FAE5', icon: IconCircleCheck, desc: 'Livraisons confirmées' },
                  { label: 'Annulées', count: stats.cancelled, color: '#EF4444', bg: '#FEE2E2', icon: IconAlertCircle, desc: 'Expéditions annulées' },
                ].map(item => {
                  const pct = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                  return (
                    <Box key={item.label} mb={16}>
                      <Group justify="space-between" mb={6}>
                        <Group gap={8}>
                          <item.icon size={15} color={item.color} strokeWidth={2} />
                          <Text size="13px" fw={600}>{item.label}</Text>
                          <Text size="12px" c="dimmed">{item.desc}</Text>
                        </Group>
                        <Text size="13px" fw={700} style={{ color: item.color }}>{item.count}</Text>
                      </Group>
                      <Box
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: 'var(--border-light)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            borderRadius: 999,
                            background: item.color,
                            transition: 'width 0.8s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}