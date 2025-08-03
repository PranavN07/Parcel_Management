import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcel, ParcelBooking, ParcelStatus, TrackingHistory, TrackingUpdate } from '../models/parcel.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {
  private readonly API_URL = `${environment.apiUrl}/parcels`;
  private readonly TRACKING_URL = `${environment.apiUrl}/tracking`;

  constructor(private http: HttpClient) {}

  // Parcel operations
  bookParcel(parcelData: ParcelBooking): Observable<Parcel> {
    return this.http.post<Parcel>(`${this.API_URL}/book`, parcelData);
  }

  getUserParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.API_URL}/my-parcels`);
  }

  getSentParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.API_URL}/sent`);
  }

  getReceivedParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.API_URL}/received`);
  }

  getParcelById(id: number): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.API_URL}/${id}`);
  }

  updateParcelStatus(id: number, status: ParcelStatus): Observable<Parcel> {
    return this.http.put<Parcel>(`${this.API_URL}/${id}/status`, null, {
      params: { status }
    });
  }

  // Admin/Staff operations
  getAllParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.API_URL}/all`);
  }

  getParcelsByStatus(status: ParcelStatus): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.API_URL}/status/${status}`);
  }

  // Tracking operations
  trackParcel(trackingNumber: string): Observable<any> {
    return this.http.get(`${this.TRACKING_URL}/public/${trackingNumber}`);
  }

  getTrackingHistory(parcelId: number): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${this.TRACKING_URL}/parcel/${parcelId}`);
  }

  addTrackingUpdate(parcelId: number, update: TrackingUpdate): Observable<TrackingHistory> {
    return this.http.post<TrackingHistory>(`${this.TRACKING_URL}/parcel/${parcelId}/update`, update);
  }

  getUserParcelTracking(): Observable<{ [trackingNumber: string]: TrackingHistory[] }> {
    return this.http.get<{ [trackingNumber: string]: TrackingHistory[] }>(`${this.TRACKING_URL}/user/parcels`);
  }

  // Utility methods
  getStatusClass(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.PENDING:
        return 'status-pending';
      case ParcelStatus.CONFIRMED:
        return 'status-confirmed';
      case ParcelStatus.PICKED_UP:
        return 'status-picked-up';
      case ParcelStatus.IN_TRANSIT:
        return 'status-in-transit';
      case ParcelStatus.OUT_FOR_DELIVERY:
        return 'status-in-transit';
      case ParcelStatus.DELIVERED:
        return 'status-delivered';
      case ParcelStatus.RETURNED:
        return 'status-returned';
      case ParcelStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusDisplayName(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.PENDING:
        return 'Pending';
      case ParcelStatus.CONFIRMED:
        return 'Confirmed';
      case ParcelStatus.PICKED_UP:
        return 'Picked Up';
      case ParcelStatus.IN_TRANSIT:
        return 'In Transit';
      case ParcelStatus.OUT_FOR_DELIVERY:
        return 'Out for Delivery';
      case ParcelStatus.DELIVERED:
        return 'Delivered';
      case ParcelStatus.RETURNED:
        return 'Returned';
      case ParcelStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  }
}