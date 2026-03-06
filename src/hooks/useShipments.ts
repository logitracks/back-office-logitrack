import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Shipment, CreateShipmentInput, UpdateShipmentInput } from '@/types';

export const useShipments = () => {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data } = await api.get<Shipment[]>('/shipments');
      return data;
    },
  });
};

export const useShipment = (id: string) => {
  return useQuery({
    queryKey: ['shipments', id],
    queryFn: async () => {
      const { data } = await api.get<Shipment>(`/shipments/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newShipment: CreateShipmentInput) => {
      const { data } = await api.post<Shipment>('/shipments', newShipment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
};

export const useUpdateShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateShipmentInput) => {
      const { data: updated } = await api.patch<Shipment>(`/shipments/${id}`, data);
      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipments', variables.id] });
    },
  });
};

export const useDeleteShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/shipments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
};