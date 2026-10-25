// Bentuk data mengikuti response backend (Mini-Project.api/src/features/appointment)

export type TPaymentStatus =
  | 'unpaid'
  | 'pending_verification'
  | 'paid'
  | 'rejected'
  | 'expired';

export type TAppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'canceled'
  | 'no_show';

export type TSlot = {
  start_time: string; // "09:00"
  end_time: string;
  quota: number;
  booked: number;
  remaining: number;
  available: boolean;
};

export type TAvailability = {
  doctor_id: string;
  date: string;
  slots: TSlot[];
};

export type TAppointment = {
  id: string;
  appointment_code: string;
  consultation_fee: string;
  treatment_fee: string;
  discount_amount: string;
  total_amount: string;
  appointment_status: TAppointmentStatus;
  payment_status: TPaymentStatus;
  payment_deadline: string | null;
  /** Sisa waktu upload bukti bayar, dihitung server saat response dibuat */
  remaining_seconds: number;
  created_at: string;
  doctors: { id: string; full_name: string; photo: string | null };
  treatments: { id: string; slug: string | null; name: string };
  practice_sessions: {
    id: string;
    session_date: string; // "2026-10-26T00:00:00.000Z"
    start_time: string; // "1970-01-01T09:00:00.000Z"
    end_time: string;
  };
  payment_proofs: {
    id: string;
    image_url: string;
    uploaded_at: string;
    verification_status: 'pending' | 'approved' | 'rejected';
  }[];
};

export type TAppointmentCreate = {
  treatment_slug: string;
  doctor_id: string;
  session_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
};
