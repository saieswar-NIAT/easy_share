export type VehicleType = 'sedan' | 'suv_xl' | 'van';

export type PassengerStatus = 
  | 'just_landed' 
  | 'baggage_claim' 
  | 'walking_to_pickup' 
  | 'at_rideshare_zone' 
  | 'boarded';

export interface LuggageProfile {
  carryOn: number;
  checked: number;
  personalItem: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  flightNumber: string;
  airline: string;
  arrivalAirport: string;
  terminal: string;
  gate: string;
  baggageCarousel: string;
  scheduledArrival: string;
  luggage: LuggageProfile;
  status: PassengerStatus;
  statusText?: string;
  currentZoneLocation?: string;
}

export interface DestinationZone {
  id: string;
  name: string;
  tagline: string;
  airportCode: string;
  distanceMiles: number;
  typicalDurationMin: number;
  estimatedTaxiRate: number;
  popularDropoffs: string[];
  activePassengersCount: number;
}

export interface RouteStop {
  id: string;
  stopIndex: number;
  passengerId: string;
  passengerName: string;
  address: string;
  zoneName: string;
  distanceFromAirportMiles: number;
  estimatedArrivalMin: number;
  isAirportOrigin?: boolean;
}

export interface GroupMember {
  user: UserProfile;
  joinedAt: string;
  dropoffAddress: string;
  distanceMiles: number;
  splitAmount: number;
  platformFee: number;
  paymentStatus: 'pending' | 'pre_authorized' | 'paid' | 'escrow_held';
  dropoffPin: string;
  isConfirmedDropoff?: boolean;
  paidAt?: string;
  isCreator?: boolean;
}

export interface RideGroup {
  id: string;
  title: string;
  airportCode: string;
  destinationZone: string;
  primaryAddress: string;
  creatorId: string;
  creatorName: string;
  vehicleType: VehicleType;
  maxRiders: number;
  maxCarryOn: number;
  maxChecked: number;
  departureTimeText: string;
  departureTimestamp: number;
  status: 'forming' | 'ready' | 'en_route' | 'completed';
  baseMeterEstimate: number;
  airportTollFee: number;
  platformFeePerRider: number;
  finalFare?: number;
  tipAmount?: number;
  splitMethod: 'equal' | 'distance_optimized';
  escrowStatus: 'idle' | 'funds_held_in_escrow' | 'released_to_creator';
  members: GroupMember[];
  stops: RouteStop[];
  notes?: string;
  bookedRideshareDetails?: {
    service: 'Uber XL' | 'Lyft Extra Comfort' | 'Airport Taxi';
    driverName: string;
    carModel: string;
    licensePlate: string;
    pickupPillar: string;
    etaMinutes: number;
  };
}

export interface PaymentRecord {
  id: string;
  rideId: string;
  rideTitle: string;
  airportCode: string;
  flightNumber: string;
  date: string;
  timestamp: number;
  destinationAddress: string;
  ridersCount: number;
  coRiders: string[];
  splitMethod: 'equal' | 'distance_optimized';
  totalRideCost: number;
  myFareShare: number;
  myTollShare: number;
  myTipShare: number;
  platformFee: number;
  totalAmountPaid: number;
  savingsVsSolo: number;
  paymentMethod: string;
  status: 'settled' | 'in_escrow' | 'refunded';
  dropoffPin: string;
  receiptNumber: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  type: 'text' | 'status_update' | 'carousel_match' | 'fare_update' | 'system';
  metadata?: Record<string, any>;
}

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  state: string;
  country: string;
  ridesharePillarGuide: string;
  terminals: string[];
  carousels: string[];
}
