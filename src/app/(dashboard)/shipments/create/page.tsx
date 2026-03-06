'use client';

import { Title } from '@mantine/core';
import ShipmentForm from '@/components/shipments/ShipmentForm';

export default function CreateShipmentPage() {
  return (
    <>
      <Title order={2} mb="md">Nouvelle expédition</Title>
      <ShipmentForm />
    </>
  );
}