'use client';

import { Button, Group, Title, Paper, Table, Badge, ActionIcon, Menu, Modal, TextInput, Select, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
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
        notifications.show({ title: 'Succès', message: 'Utilisateur mis à jour', color: 'green' });
      } else {
        await createUser.mutateAsync(values);
        notifications.show({ title: 'Succès', message: 'Utilisateur créé', color: 'green' });
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
      children: `Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`,
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteUser.mutateAsync(user.id);
          notifications.show({ title: 'Succès', message: 'Utilisateur supprimé', color: 'green' });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Impossible de supprimer';
          notifications.show({ title: 'Erreur', message, color: 'red' });
        }
      },
    });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Utilisateurs</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpen()}>
          Nouvel utilisateur
        </Button>
      </Group>

      <Paper withBorder p="md">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Prénom</Table.Th>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Rôle</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users?.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.firstName}</Table.Td>
                <Table.Td>{user.lastName}</Table.Td>
                <Table.Td>
                  <Badge color={user.role === 'ADMIN' ? 'red' : 'blue'}>
                    {user.role === 'ADMIN' ? 'Admin' : 'Utilisateur'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpen(user)}>
                        Modifier
                      </Menu.Item>
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
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={editingUser ? 'Modifier utilisateur' : 'Créer utilisateur'}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Email" {...form.getInputProps('email')} />
            <TextInput label="Prénom" {...form.getInputProps('firstName')} />
            <TextInput label="Nom" {...form.getInputProps('lastName')} />
            <TextInput
              label="Mot de passe"
              type="password"
              {...form.getInputProps('password')}
              placeholder={editingUser ? 'Laisser vide pour ne pas changer' : ''}
            />
            <Select
              label="Rôle"
              data={[
                { value: 'USER', label: 'Utilisateur' },
                { value: 'ADMIN', label: 'Administrateur' },
              ]}
              {...form.getInputProps('role')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>Annuler</Button>
              <Button type="submit" loading={createUser.isPending || updateUser.isPending}>
                {editingUser ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}