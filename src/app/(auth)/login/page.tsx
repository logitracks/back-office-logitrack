'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Alert, Text, Box, Group } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { IconAlertCircle, IconTruck, IconMail, IconLock, IconArrowRight } from '@tabler/icons-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await login(values.email, values.password);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Erreur de connexion');
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: '#0A1A2F',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Left panel - branding */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          zIndex: 1,
        }}
        visibleFrom="md"
      >
        <Group gap={14} mb={48}>
          <Box
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(249,115,22,0.40)',
            }}
          >
            <IconTruck size={26} color="white" />
          </Box>
          <Text
            fw={900}
            size="28px"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
            }}
          >
            Logi<span style={{ color: '#F97316' }}>Track</span>
          </Text>
        </Group>

        <Title
          order={1}
          style={{
            fontSize: 'clamp(36px, 4vw, 52px)',
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: 20,
            maxWidth: 480,
          }}
        >
          Gérez vos expéditions en toute{' '}
          <span style={{ color: '#F97316' }}>simplicité</span>
        </Title>

        <Text
          size="16px"
          style={{
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 400,
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          Suivez, gérez et optimisez l&apos;ensemble de vos opérations logistiques depuis une interface centralisée.
        </Text>

        {[
          { label: 'Suivi en temps réel', desc: 'Suivez chaque colis à la trace' },
          { label: 'Gestion centralisée', desc: 'Toutes vos données au même endroit' },
          { label: 'Rapports détaillés', desc: 'Analyses et statistiques complètes' },
        ].map(item => (
          <Group key={item.label} gap={12} mb={16}>
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#F97316',
                flexShrink: 0,
              }}
            />
            <Box>
              <Text size="14px" fw={600} style={{ color: '#FFFFFF', lineHeight: 1.2 }}>{item.label}</Text>
              <Text size="12px" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</Text>
            </Box>
          </Group>
        ))}
      </Box>

      {/* Right panel - login form */}
      <Box
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 48px',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.03)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Box style={{ width: '100%', maxWidth: 380 }}>
          {/* Mobile logo */}
          <Group gap={10} mb={40} hiddenFrom="md">
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#F97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconTruck size={20} color="white" />
            </Box>
            <Text fw={900} size="xl" style={{ fontFamily: "'Syne', sans-serif", color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              Logi<span style={{ color: '#F97316' }}>Track</span>
            </Text>
          </Group>

          <Box mb={32}>
            <Title
              order={2}
              style={{
                fontSize: 26,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                marginBottom: 8,
              }}
            >
              Connexion
            </Title>
            <Text size="14px" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Entrez vos identifiants pour accéder au back-office
            </Text>
          </Box>

          <Paper
            p="xl"
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: 'none',
            }}
          >
            {error && (
              <Alert
                color="red"
                mb="lg"
                radius="md"
                icon={<IconAlertCircle size={16} />}
                style={{ fontSize: 13 }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Adresse email"
                placeholder="vous@exemple.com"
                required
                mb="md"
                leftSection={<IconMail size={15} color="var(--text-muted)" />}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Mot de passe"
                placeholder="••••••••"
                required
                mb="xl"
                leftSection={<IconLock size={15} color="var(--text-muted)" />}
                {...form.getInputProps('password')}
              />
              <Button
                fullWidth
                type="submit"
                loading={loading}
                size="md"
                rightSection={!loading ? <IconArrowRight size={16} /> : null}
                style={{
                  background: 'var(--primary)',
                  height: 46,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                }}
              >
                Se connecter
              </Button>
            </form>
          </Paper>

          <Text size="12px" ta="center" mt="lg" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} LogiTrack. Tous droits réservés.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}