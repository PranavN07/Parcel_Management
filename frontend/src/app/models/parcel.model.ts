export interface Parcel {
  id: number;
  trackingNumber: string;
  description: string;
  weight: number;
  declaredValue: number;
  shippingCost: number;
  status: ParcelStatus;
  priority: Priority;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  pickupLocation: string;
  deliveryLocation: string;
  specialInstructions?: string;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ParcelStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT'
}

export interface ParcelBooking {
  description: string;
  weight: number;
  declaredValue: number;
  priority: Priority;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupCountry: string;
  pickupZipCode: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryCountry: string;
  deliveryZipCode: string;
  specialInstructions?: string;
}

export interface TrackingUpdate {
  status: ParcelStatus;
  location: string;
  description?: string;
}

export interface TrackingHistory {
  id: number;
  status: ParcelStatus;
  location: string;
  description?: string;
  timestamp: Date;
  updatedBy: string;
}