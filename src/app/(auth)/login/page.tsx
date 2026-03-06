'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Alert } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  // const router = useRouter(); // on peut le retirer

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) => (value.length < 6 ? 'Mot de passe trop court' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError('');
      await login(values.email, values.password);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Erreur de connexion');
      } else {
        setError('Erreur de connexion');
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        LogiTrack Admin
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Alert color="red" mb="md">{error}</Alert>}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="vous@exemple.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit">
            Se connecter
          </Button>
        </form>
      </Paper>
    </Container>
  );
}