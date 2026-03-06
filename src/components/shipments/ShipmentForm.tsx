'use client';

import { useForm } from '@mantine/form';
import { TextInput, Select, Button, Group, Paper, Stack, NumberInput, ActionIcon, Title } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
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
        weight: p.weight ?? '', // convertir null/undefined en chaîne vide pour l'input
      })) || [{ description: '', quantity: 1, weight: '' }],
    },
    validate: {
      senderName: (v) => (!v ? 'Requis' : null),
      receiverName: (v) => (!v ? 'Requis' : null),
      origin: (v) => (!v ? 'Requis' : null),
      destination: (v) => (!v ? 'Requis' : null),
      products: {
        description: (v) => (!v ? 'Requis' : null),
        quantity: (v) => (v < 1 ? 'Doit être ≥ 1' : null),
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Préparer les produits : convertir les poids vides en null
      const products = values.products.map(p => ({
        description: p.description,
        quantity: p.quantity,
        weight: p.weight === '' ? null : Number(p.weight),
      }));

      const payload = {
        ...values,
        products,
      };

      if (isEditing && initialValues?.id) {
        await updateMutation.mutateAsync({ id: initialValues.id, ...payload });
        notifications.show({ title: 'Succès', message: 'Expédition mise à jour', color: 'green' });
      } else {
        await createMutation.mutateAsync(payload);
        notifications.show({ title: 'Succès', message: 'Expédition créée', color: 'green' });
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
    <Paper withBorder p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>Expéditeur</Title>
          <Group grow>
            <TextInput label="Nom" {...form.getInputProps('senderName')} />
            <TextInput label="Adresse" {...form.getInputProps('senderAddress')} />
          </Group>

          <Title order={4} mt="md">Destinataire</Title>
          <Group grow>
            <TextInput label="Nom" {...form.getInputProps('receiverName')} />
            <TextInput label="Adresse" {...form.getInputProps('receiverAddress')} />
          </Group>

          <Title order={4} mt="md">Trajet</Title>
          <Group grow>
            <TextInput label="Origine" {...form.getInputProps('origin')} />
            <TextInput label="Destination" {...form.getInputProps('destination')} />
          </Group>

          {isEditing && (
            <Select
              label="Statut"
              data={statusOptions}
              {...form.getInputProps('status')}
            />
          )}

          <Title order={4} mt="md">Produits</Title>
          {form.values.products.map((_, index) => (
            <Group key={index} align="flex-end" grow>
              <TextInput
                label="Description"
                {...form.getInputProps(`products.${index}.description`)}
              />
              <NumberInput
                label="Quantité"
                min={1}
                {...form.getInputProps(`products.${index}.quantity`)}
              />
              <NumberInput
                label="Poids (kg)"
                {...form.getInputProps(`products.${index}.weight`)}
              />
              <ActionIcon color="red" onClick={() => removeProduct(index)} disabled={form.values.products.length === 1}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
          <Button leftSection={<IconPlus size={16} />} variant="light" onClick={addProduct}>
            Ajouter un produit
          </Button>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}