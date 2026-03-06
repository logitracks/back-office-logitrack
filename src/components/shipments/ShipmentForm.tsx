'use client';

import { useForm } from '@mantine/form';
import {
  TextInput, Select, Button, Group, Paper, Stack,
  NumberInput, ActionIcon, Title, Text, Box, Divider
} from '@mantine/core';
import { IconTrash, IconPlus, IconUser, IconMapPin, IconPackage, IconTruck } from '@tabler/icons-react';
import { Shipment } from '@/types';
import { useRouter } from 'next/navigation';
import { useCreateShipment, useUpdateShipment } from '@/hooks/useShipments';
import { notifications } from '@mantine/notifications';

interface ShipmentFormProps {
  initialValues?: Partial<Shipment>;
  isEditing?: boolean;
}

const statusOptions = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'IN_TRANSIT', label: 'En transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'En livraison' },
  { value: 'DELIVERED', label: 'Livré' },
  { value: 'CANCELLED', label: 'Annulé' },
];

function FormSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; color?: string }>; children: React.ReactNode }) {
  return (
    <Box>
      <Group gap={10} mb="md">
        <Box
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color="rgba(255,255,255,0.9)" />
        </Box>
        <Title order={5} style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, letterSpacing: '-0.01em' }}>
          {title}
        </Title>
      </Group>
      {children}
    </Box>
  );
}

export default function ShipmentForm({ initialValues, isEditing }: ShipmentFormProps) {
  const router = useRouter();
  const createMutation = useCreateShipment();
  const updateMutation = useUpdateShipment();

  const form = useForm({
    initialValues: {
      senderName: initialValues?.senderName || '',
      senderAddress: initialValues?.senderAddress || '',
      receiverName: initialValues?.receiverName || '',
      receiverAddress: initialValues?.receiverAddress || '',
      origin: initialValues?.origin || '',
      destination: initialValues?.destination || '',
      status: initialValues?.status || 'PENDING',
      products: initialValues?.products?.map(p => ({
        description: p.description,
        quantity: p.quantity,
        weight: p.weight ?? '',
      })) || [{ description: '', quantity: 1, weight: '' }],
    },
    validate: {
      senderName: (v) => (!v ? 'Champ requis' : null),
      receiverName: (v) => (!v ? 'Champ requis' : null),
      origin: (v) => (!v ? 'Champ requis' : null),
      destination: (v) => (!v ? 'Champ requis' : null),
      products: {
        description: (v) => (!v ? 'Champ requis' : null),
        quantity: (v) => (v < 1 ? 'Doit être ≥ 1' : null),
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const products = values.products.map(p => ({
        description: p.description,
        quantity: p.quantity,
        weight: p.weight === '' ? null : Number(p.weight),
      }));

      const payload = { ...values, products };

      if (isEditing && initialValues?.id) {
        await updateMutation.mutateAsync({ id: initialValues.id, ...payload });
        notifications.show({ title: 'Expédition mise à jour', message: 'Les modifications ont été enregistrées', color: 'green' });
      } else {
        await createMutation.mutateAsync(payload);
        notifications.show({ title: 'Expédition créée', message: 'La nouvelle expédition a été ajoutée', color: 'green' });
      }
      router.push('/shipments');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      notifications.show({ title: 'Erreur', message, color: 'red' });
    }
  };

  const addProduct = () => {
    form.insertListItem('products', { description: '', quantity: 1, weight: '' });
  };

  const removeProduct = (index: number) => {
    form.removeListItem('products', index);
  };

  return (
    <Paper withBorder p={0} style={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box
        style={{
          background: 'var(--secondary)',
          padding: '20px 28px',
        }}
      >
        <Text
          fw={700}
          style={{
            fontFamily: "'Syne', sans-serif",
            color: '#FFFFFF',
            fontSize: 16,
          }}
        >
          {isEditing ? 'Modifier l\'expédition' : 'Nouvelle expédition'}
        </Text>
        <Text size="12px" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {isEditing ? 'Mettez à jour les informations de l\'expédition' : 'Remplissez les informations pour créer une nouvelle expédition'}
        </Text>
      </Box>

      <Box p="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            {/* Expéditeur */}
            <FormSection title="Informations Expéditeur" icon={IconUser}>
              <Group grow gap="md">
                <TextInput
                  label="Nom complet"
                  placeholder="Jean Dupont"
                  required
                  {...form.getInputProps('senderName')}
                />
                <TextInput
                  label="Adresse"
                  placeholder="123 rue de Paris, 75001 Paris"
                  {...form.getInputProps('senderAddress')}
                />
              </Group>
            </FormSection>

            <Divider />

            {/* Destinataire */}
            <FormSection title="Informations Destinataire" icon={IconUser}>
              <Group grow gap="md">
                <TextInput
                  label="Nom complet"
                  placeholder="Marie Martin"
                  required
                  {...form.getInputProps('receiverName')}
                />
                <TextInput
                  label="Adresse"
                  placeholder="456 avenue Lyon, 69001 Lyon"
                  {...form.getInputProps('receiverAddress')}
                />
              </Group>
            </FormSection>

            <Divider />

            {/* Trajet */}
            <FormSection title="Trajet" icon={IconMapPin}>
              <Group grow gap="md">
                <TextInput
                  label="Ville d'origine"
                  placeholder="Paris"
                  required
                  leftSection={<IconMapPin size={14} color="var(--text-muted)" />}
                  {...form.getInputProps('origin')}
                />
                <TextInput
                  label="Ville de destination"
                  placeholder="Lyon"
                  required
                  leftSection={<IconMapPin size={14} color="var(--text-muted)" />}
                  {...form.getInputProps('destination')}
                />
                {isEditing && (
                  <Select
                    label="Statut"
                    data={statusOptions}
                    leftSection={<IconTruck size={14} color="var(--text-muted)" />}
                    {...form.getInputProps('status')}
                  />
                )}
              </Group>
            </FormSection>

            <Divider />

            {/* Produits */}
            <FormSection title="Produits" icon={IconPackage}>
              <Stack gap="sm">
                {form.values.products.map((_, index) => (
                  <Paper
                    key={index}
                    withBorder
                    p="md"
                    style={{
                      background: 'var(--background)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Text size="12px" fw={700} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Produit #{index + 1}
                      </Text>
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        disabled={form.values.products.length === 1}
                      >
                        <IconTrash size={13} />
                      </ActionIcon>
                    </Group>
                    <Group grow gap="md">
                      <TextInput
                        label="Description"
                        placeholder="Nom du produit"
                        {...form.getInputProps(`products.${index}.description`)}
                      />
                      <NumberInput
                        label="Quantité"
                        min={1}
                        {...form.getInputProps(`products.${index}.quantity`)}
                      />
                      <NumberInput
                        label="Poids (kg)"
                        placeholder="Optionnel"
                        {...form.getInputProps(`products.${index}.weight`)}
                      />
                    </Group>
                  </Paper>
                ))}

                <Button
                  leftSection={<IconPlus size={15} />}
                  variant="light"
                  onClick={addProduct}
                  size="sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Ajouter un produit
                </Button>
              </Stack>
            </FormSection>

            {/* Actions */}
            <Divider />
            <Group justify="flex-end" gap="md">
              <Button
                variant="default"
                onClick={() => router.back()}
                size="md"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                size="md"
                loading={createMutation.isPending || updateMutation.isPending}
                leftSection={isEditing ? <IconTruck size={16} /> : <IconPlus size={16} />}
              >
                {isEditing ? 'Enregistrer les modifications' : 'Créer l\'expédition'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Paper>
  );
}