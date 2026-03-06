'use client';

import { useParams } from 'next/navigation';
import { useShipment } from '@/hooks/useShipments';
import { Title, Loader } from '@mantine/core';
import ShipmentForm from '@/components/shipments/ShipmentForm';

export default function EditShipmentPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: shipment, isLoading } = useShipment(id);

  if (isLoading) return <Loader />;
  if (!shipment) return <div>Expédition non trouvée</div>;

  return (
    <>
      <Title order={2} mb="md">Modifier l&apos;expédition {shipment.trackingNumber}</Title>
      <ShipmentForm initialValues={shipment} isEditing />
    </>
  );
}