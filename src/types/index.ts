export interface Product {
    id: string;
    description: string;
    quantity: number;
    weight?: number | null;
    shipmentId: string;
  }
  
  export interface TrackingEvent {
    id: string;
    location: string;
    message: string;
    timestamp: string;
    shipmentId: string;
  }
  
  export interface Shipment {
    id: string;
    trackingNumber: string;
    senderName: string;
    senderAddress?: string | null;
    receiverName: string;
    receiverAddress?: string | null;
    origin: string;
    destination: string;
    status: 'PENDING' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
    userId: string;
    products: Product[];
    events: TrackingEvent[];
  }
  
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
  }
  
  // Types pour les entrées des mutations
  export type CreateUserInput = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'ADMIN' | 'USER';
  };
  
  export type UpdateUserInput = Partial<CreateUserInput>;
  
  export type CreateShipmentInput = Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'userId' | 'products' | 'events'> & {
    products: Array<{ description: string; quantity: number; weight?: number | null }>;
    events?: Array<{ location: string; message: string }>;
  };
  
  export type UpdateShipmentInput = Partial<CreateShipmentInput>;