'use client';

import {
  Button, Group, Title, Paper, Table, Badge, ActionIcon,
  Menu, Modal, TextInput, Select, Stack, Text, Box, Avatar
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconDots, IconEdit, IconTrash, IconUsers, IconShield, IconUser } from '@tabler/icons-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { User } from '@/types';
import { useState } from 'react';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'USER' as 'ADMIN' | 'USER',
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email invalide'),
      firstName: (v) => (!v ? 'Requis' : null),
      lastName: (v) => (!v ? 'Requis' : null),
      password: (v) => (!editingUser && !v ? 'Requis' : v.length > 0 && v.length < 6 ? 'Au moins 6 caractères' : null),
    },
  });

  const handleOpen = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setValues({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      form.reset();
    }
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, ...values });
        notifications.show({ title: 'Utilisateur mis à jour', message: `${values.firstName} ${values.lastName} a été modifié`, color: 'green' });
      } else {
        await createUser.mutateAsync(values);
        notifications.show({ title: 'Utilisateur créé', message: `${values.firstName} ${values.lastName} a été ajouté`, color: 'green' });
      }
      close();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      notifications.show({ title: 'Erreur', message, color: 'red' });
    }
  };

  const handleDelete = (user: User) => {
    modals.openConfirmModal({
      title: 'Supprimer l\'utilisateur',
      children: (
        <Text size="14px">
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>{user.firstName} {user.lastName}</strong> ? Cette action est irréversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteUser.mutateAsync(user.id);
          notifications.show({ title: 'Utilisateur supprimé', message: 'L\'utilisateur a été supprimé', color: 'green' });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Impossible de supprimer';
          notifications.show({ title: 'Erreur', message, color: 'red' });
        }
      },
    });
  };

  const adminCount = users?.filter(u => u.role === 'ADMIN').length || 0;
  const userCount = users?.filter(u => u.role === 'USER').length || 0;

  return (
    <Box>
      {/* Header */}
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
              <IconUsers size={20} color="var(--primary)" strokeWidth={2} />
            </Box>
            <Title order={2} style={{ fontSize: 26 }}>Utilisateurs</Title>
          </Group>
          <Text c="dimmed" size="14px">
            {users?.length ?? 0} utilisateur{(users?.length ?? 0) !== 1 ? 's' : ''} au total
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => handleOpen()}
          size="md"
          style={{ height: 42 }}
        >
          Nouvel utilisateur
        </Button>
      </Group>

      {/* Summary cards */}
      {!isLoading && (
        <Group mb="lg" gap="md">
          {[
            { label: 'Administrateurs', count: adminCount, icon: IconShield, color: '#EF4444', bg: '#FEE2E2' },
            { label: 'Utilisateurs', count: userCount, icon: IconUser, color: '#3B82F6', bg: '#DBEAFE' },
          ].map(item => (
            <Paper key={item.label} withBorder p="md" style={{ minWidth: 180 }}>
              <Group gap={10}>
                <Box
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon size={18} color={item.color} strokeWidth={2} />
                </Box>
                <Box>
                  <Text fw={800} size="20px" style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{item.count}</Text>
                  <Text size="12px" c="dimmed">{item.label}</Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </Group>
      )}

      {/* Table */}
      <Paper withBorder p={0} style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <Box p="xl" ta="center">
            <Text c="dimmed">Chargement…</Text>
          </Box>
        ) : (
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Utilisateur</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Rôle</Table.Th>
                <Table.Th>Membre depuis</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users?.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap={10}>
                      <Avatar
                        size={34}
                        radius="xl"
                        style={{
                          background: user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #EF4444, #F97316)'
                            : 'linear-gradient(135deg, #3B82F6, #6366F1)',
                          color: 'white',
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {user.firstName[0]}{user.lastName[0]}
                      </Avatar>
                      <Box>
                        <Text size="14px" fw={600}>{user.firstName} {user.lastName}</Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="13px" c="dimmed">{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    {user.role === 'ADMIN' ? (
                      <Box
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: '#FEE2E2',
                        }}
                      >
                        <IconShield size={11} color="#991B1B" strokeWidth={2.5} />
                        <Text size="11px" fw={700} style={{ color: '#991B1B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin</Text>
                      </Box>
                    ) : (
                      <Box
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: '#DBEAFE',
                        }}
                      >
                        <IconUser size={11} color="#1D4ED8" strokeWidth={2.5} />
                        <Text size="11px" fw={700} style={{ color: '#1D4ED8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Utilisateur</Text>
                      </Box>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="12px" c="dimmed">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Menu shadow="md" width={180} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconDots size={15} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpen(user)}>
                          Modifier
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(user)}>
                          Supprimer
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
        size="md"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput label="Prénom" placeholder="Jean" {...form.getInputProps('firstName')} />
              <TextInput label="Nom" placeholder="Dupont" {...form.getInputProps('lastName')} />
            </Group>
            <TextInput label="Adresse email" placeholder="jean.dupont@exemple.com" {...form.getInputProps('email')} />
            <TextInput
              label="Mot de passe"
              type="password"
              placeholder={editingUser ? 'Laisser vide pour ne pas changer' : 'Au moins 6 caractères'}
              {...form.getInputProps('password')}
            />
            <Select
              label="Rôle"
              data={[
                { value: 'USER', label: 'Utilisateur' },
                { value: 'ADMIN', label: 'Administrateur' },
              ]}
              {...form.getInputProps('role')}
            />
            <Group justify="flex-end" mt="sm" gap="md">
              <Button variant="default" onClick={close}>Annuler</Button>
              <Button type="submit" loading={createUser.isPending || updateUser.isPending}>
                {editingUser ? 'Enregistrer' : 'Créer'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}