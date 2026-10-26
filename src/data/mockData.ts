import { AirportInfo, DestinationZone, RideGroup, UserProfile, ChatMessage, PaymentRecord } from '../types';

export const AIRPORTS: AirportInfo[] = [
  {
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    ridesharePillarGuide: 'Terminal 2 & 3: Level 2 Departures / Rideshare Island. Int\'l: Level 3 Center Island Courtyard G.',
    terminals: ['Terminal 1 (Harvey Milk)', 'Terminal 2', 'Terminal 3', 'International Terminal'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5', 'Carousel 6']
  },
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    ridesharePillarGuide: 'Terminal 4 & 5: Inner ring frontage pick-up zone, Pillars A-D.',
    terminals: ['Terminal 1', 'Terminal 4', 'Terminal 5', 'Terminal 7', 'Terminal 8'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5']
  },
  {
    code: 'ORD',
    name: 'Chicago O\'Hare International Airport',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    ridesharePillarGuide: 'Terminal 2 Upper Level (Ticketing), Departures Curbside Zone 2B-2E.',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 5'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4']
  },
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    ridesharePillarGuide: 'LAX-it Lot next to Terminal 1, reachable by Green Shuttle or 4-min walk.',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Tom Bradley Int\'l', 'Terminal 4', 'Terminal 5', 'Terminal 6', 'Terminal 7'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5']
  }
];

export const SAMPLE_TICKETS: Array<{
  flightNumber: string;
  airline: string;
  from: string;
  airportCode: string;
  terminal: string;
  gate: string;
  carousel: string;
  arrival: string;
}> = [
  {
    flightNumber: 'UA 1248',
    airline: 'United Airlines',
    from: 'Denver (DEN)',
    airportCode: 'SFO',
    terminal: 'Terminal 2',
    gate: 'Gate 54',
    carousel: 'Carousel 4',
    arrival: '4:15 PM'
  },
  {
    flightNumber: 'AS 338',
    airline: 'Alaska Airlines',
    from: 'Seattle (SEA)',
    airportCode: 'SFO',
    terminal: 'Terminal 2',
    gate: 'Gate 51',
    carousel: 'Carousel 4', // Same carousel for alert test!
    arrival: '4:18 PM'
  },
  {
    flightNumber: 'DL 402',
    airline: 'Delta Air Lines',
    from: 'Salt Lake City (SLC)',
    airportCode: 'SFO',
    terminal: 'Terminal 1',
    gate: 'Gate B14',
    carousel: 'Carousel 2',
    arrival: '4:22 PM'
  },
  {
    flightNumber: 'AA 1092',
    airline: 'American Airlines',
    from: 'Dallas (DFW)',
    airportCode: 'SFO',
    terminal: 'Terminal 1',
    gate: 'Gate B8',
    carousel: 'Carousel 1',
    arrival: '4:25 PM'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_me_01',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isVerified: true,
  flightNumber: 'UA 1248',
  airline: 'United Airlines',
  arrivalAirport: 'SFO',
  terminal: 'Terminal 2',
  gate: 'Gate 54',
  baggageCarousel: 'Carousel 4',
  scheduledArrival: '4:15 PM',
  luggage: {
    carryOn: 1,
    checked: 1,
    personalItem: true
  },
  status: 'baggage_claim',
  statusText: 'Waiting at Carousel 4',
  currentZoneLocation: 'Baggage Claim Hall (Level 1)'
};

export const DESTINATION_ZONES_SFO: DestinationZone[] = [
  {
    id: 'zone_downtown',
    name: 'Downtown & Union Square',
    tagline: 'Hotels, shopping district & Powell St corridor',
    airportCode: 'SFO',
    distanceMiles: 14.2,
    typicalDurationMin: 28,
    estimatedTaxiRate: 64.0,
    popularDropoffs: [
      'Westin St. Francis (335 Powell St)',
      'Marriott Marquis (780 Mission St)',
      'Palace Hotel (2 New Montgomery St)',
      'Grand Hyatt Union Square'
    ],
    activePassengersCount: 9
  },
  {
    id: 'zone_moscone',
    name: 'Moscone Convention Center',
    tagline: 'Tech summits, conventions & SoMa business hub',
    airportCode: 'SFO',
    distanceMiles: 13.8,
    typicalDurationMin: 26,
    estimatedTaxiRate: 62.0,
    popularDropoffs: [
      'Moscone Center South (747 Howard St)',
      'W San Francisco (181 3rd St)',
      'InterContinental SF (888 Howard St)'
    ],
    activePassengersCount: 14
  },
  {
    id: 'zone_fidi',
    name: 'Financial District & Embarcadero',
    tagline: 'Corporate offices, Ferry Building & waterfront',
    airportCode: 'SFO',
    distanceMiles: 15.6,
    typicalDurationMin: 32,
    estimatedTaxiRate: 68.0,
    popularDropoffs: [
      'Salesforce Tower (415 Mission St)',
      'Hyatt Regency Embarcadero (5 Embarcadero Ctr)',
      'Four Seasons Embarcadero (222 Sansome St)'
    ],
    activePassengersCount: 7
  },
  {
    id: 'zone_paloalto',
    name: 'Palo Alto & Stanford',
    tagline: 'Silicon Valley tech campus & Sand Hill Rd',
    airportCode: 'SFO',
    distanceMiles: 19.4,
    typicalDurationMin: 30,
    estimatedTaxiRate: 78.0,
    popularDropoffs: [
      'Stanford Shopping Center (660 Stanford Shopping Ctr)',
      'Nobu Hotel Palo Alto (180 Hamilton Ave)',
      'Four Seasons Silicon Valley'
    ],
    activePassengersCount: 5
  },
  {
    id: 'zone_wharf',
    name: 'Fisherman\'s Wharf & Marina',
    tagline: 'North waterfront, Pier 39 & Ghirardelli',
    airportCode: 'SFO',
    distanceMiles: 16.8,
    typicalDurationMin: 36,
    estimatedTaxiRate: 72.0,
    popularDropoffs: [
      'Hotel Zephyr (250 Beach St)',
      'Argonaut Hotel (495 Jefferson St)',
      'Courtyard by Marriott Fisherman\'s Wharf'
    ],
    activePassengersCount: 6
  }
];

export const INITIAL_GROUPS: RideGroup[] = [
  {
    id: 'grp_01_downtown',
    title: 'Downtown Hotels & Union Square',
    airportCode: 'SFO',
    destinationZone: 'Downtown & Union Square',
    primaryAddress: 'Marriott Marquis, 780 Mission St',
    creatorId: 'usr_sarah_02',
    creatorName: 'Sarah Lin',
    vehicleType: 'suv_xl',
    maxRiders: 4,
    maxCarryOn: 4,
    maxChecked: 4,
    departureTimeText: 'Leaving around 4:35 PM',
    departureTimestamp: Date.now() + 18 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 66.0,
    airportTollFee: 7.50,
    tipAmount: 10.0,
    platformFeePerRider: 1.25,
    splitMethod: 'distance_optimized',
    escrowStatus: 'funds_held_in_escrow',
    notes: 'Arrived on AS 338. At baggage carousel 4 now grabbing bags. Heading to Union Square via 4th St.',
    bookedRideshareDetails: {
      service: 'Uber XL',
      driverName: 'Carlos M.',
      carModel: 'Toyota Highlander (Black)',
      licensePlate: '8TYP902',
      pickupPillar: 'Level 2 Island Pillar 2B',
      etaMinutes: 12
    },
    members: [
      {
        user: {
          id: 'usr_sarah_02',
          name: 'Sarah Lin',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'AS 338',
          airline: 'Alaska Airlines',
          arrivalAirport: 'SFO',
          terminal: 'Terminal 2',
          gate: 'Gate 51',
          baggageCarousel: 'Carousel 4', // Matches Alex!
          scheduledArrival: '4:18 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: true },
          status: 'baggage_claim',
          statusText: 'Spotting yellow suitcase at Carousel 4',
          currentZoneLocation: 'Baggage Claim Carousel 4'
        },
        joinedAt: '4:20 PM',
        dropoffAddress: 'Marriott Marquis, 780 Mission St',
        distanceMiles: 14.1,
        splitAmount: 27.80,
        platformFee: 1.25,
        paymentStatus: 'paid',
        dropoffPin: '8214',
        isConfirmedDropoff: true,
        paidAt: '4:28 PM',
        isCreator: true
      },
      {
        user: {
          id: 'usr_marcus_03',
          name: 'Marcus Vance',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'DL 402',
          airline: 'Delta Air Lines',
          arrivalAirport: 'SFO',
          terminal: 'Terminal 1',
          gate: 'Gate B14',
          baggageCarousel: 'Carousel 2',
          scheduledArrival: '4:22 PM',
          luggage: { carryOn: 1, checked: 0, personalItem: true },
          status: 'walking_to_pickup',
          statusText: 'Walking over skybridge to Level 2',
          currentZoneLocation: 'Connecting Skybridge T1 to T2'
        },
        joinedAt: '4:24 PM',
        dropoffAddress: 'Palace Hotel, 2 New Montgomery St',
        distanceMiles: 14.6,
        splitAmount: 28.50,
        platformFee: 1.25,
        paymentStatus: 'escrow_held',
        dropoffPin: '3951',
        isConfirmedDropoff: false
      }
    ],
    stops: [
      {
        id: 'stop_airport',
        stopIndex: 0,
        passengerId: 'origin',
        passengerName: 'SFO Terminal 2 Level 2',
        address: 'SFO Level 2 Rideshare Zone, Island 3, Pillar 2B',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_1',
        stopIndex: 1,
        passengerId: 'usr_sarah_02',
        passengerName: 'Sarah Lin',
        address: 'Marriott Marquis, 780 Mission St',
        zoneName: 'Downtown & Union Square',
        distanceFromAirportMiles: 14.1,
        estimatedArrivalMin: 27
      },
      {
        id: 'stop_2',
        stopIndex: 2,
        passengerId: 'usr_marcus_03',
        passengerName: 'Marcus Vance',
        address: 'Palace Hotel, 2 New Montgomery St',
        zoneName: 'Financial & Market',
        distanceFromAirportMiles: 14.6,
        estimatedArrivalMin: 32
      }
    ]
  },
  {
    id: 'grp_02_moscone',
    title: 'Moscone Convention Center Tech Split',
    airportCode: 'SFO',
    destinationZone: 'Moscone Convention Center',
    primaryAddress: 'Moscone South, 747 Howard St',
    creatorId: 'usr_priya_04',
    creatorName: 'Priya Patel',
    vehicleType: 'sedan',
    maxRiders: 3,
    maxCarryOn: 2,
    maxChecked: 2,
    departureTimeText: 'Leaving around 4:45 PM',
    departureTimestamp: Date.now() + 25 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 62.0,
    airportTollFee: 7.50,
    tipAmount: 8.0,
    platformFeePerRider: 1.25,
    splitMethod: 'equal',
    escrowStatus: 'idle',
    notes: 'Heading directly to Moscone Center for badge check-in. Only carry-on luggage preferred.',
    members: [
      {
        user: {
          id: 'usr_priya_04',
          name: 'Priya Patel',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'UA 1248',
          airline: 'United Airlines',
          arrivalAirport: 'SFO',
          terminal: 'Terminal 2',
          gate: 'Gate 54',
          baggageCarousel: 'Carousel 4',
          scheduledArrival: '4:15 PM',
          luggage: { carryOn: 1, checked: 0, personalItem: true },
          status: 'baggage_claim',
          statusText: 'No checked bag, waiting near Carousel 4 exit',
          currentZoneLocation: 'Baggage Claim Hall T2'
        },
        joinedAt: '4:21 PM',
        dropoffAddress: 'Moscone South, 747 Howard St',
        distanceMiles: 13.8,
        splitAmount: 38.75,
        platformFee: 1.25,
        paymentStatus: 'pending',
        dropoffPin: '6192',
        isCreator: true
      },
      {
        user: {
          id: 'usr_david_05',
          name: 'David Chen',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'AA 1092',
          airline: 'American Airlines',
          arrivalAirport: 'SFO',
          terminal: 'Terminal 1',
          gate: 'Gate B8',
          baggageCarousel: 'Carousel 1',
          scheduledArrival: '4:25 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: true },
          status: 'walking_to_pickup',
          statusText: 'Claimed bag, on moving walkway to rideshare',
          currentZoneLocation: 'Terminal 1 moving walkway'
        },
        joinedAt: '4:27 PM',
        dropoffAddress: 'W San Francisco, 181 3rd St',
        distanceMiles: 13.9,
        splitAmount: 38.75,
        platformFee: 1.25,
        paymentStatus: 'pending',
        dropoffPin: '1482'
      }
    ],
    stops: [
      {
        id: 'stop_airport_2',
        stopIndex: 0,
        passengerId: 'origin',
        passengerName: 'SFO Terminal 2 Pickup',
        address: 'SFO Terminal 2 Rideshare Courtyard',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_2_1',
        stopIndex: 1,
        passengerId: 'usr_david_05',
        passengerName: 'David Chen',
        address: 'W San Francisco, 181 3rd St',
        zoneName: 'Moscone Convention Center',
        distanceFromAirportMiles: 13.9,
        estimatedArrivalMin: 25
      },
      {
        id: 'stop_2_2',
        stopIndex: 2,
        passengerId: 'usr_priya_04',
        passengerName: 'Priya Patel',
        address: 'Moscone South, 747 Howard St',
        zoneName: 'Moscone Convention Center',
        distanceFromAirportMiles: 14.1,
        estimatedArrivalMin: 28
      }
    ]
  },
  {
    id: 'grp_03_fidi',
    title: 'Financial District & Embarcadero',
    airportCode: 'SFO',
    destinationZone: 'Financial District & Embarcadero',
    primaryAddress: 'Salesforce Tower, 415 Mission St',
    creatorId: 'usr_elena_06',
    creatorName: 'Elena Rostova',
    vehicleType: 'sedan',
    maxRiders: 3,
    maxCarryOn: 3,
    maxChecked: 2,
    departureTimeText: 'Leaving around 4:55 PM',
    departureTimestamp: Date.now() + 35 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 68.0,
    airportTollFee: 7.50,
    tipAmount: 10.0,
    platformFeePerRider: 1.25,
    splitMethod: 'distance_optimized',
    escrowStatus: 'idle',
    notes: 'Flight just touched down. Waiting for terminal deplaning. Heading straight to Embarcadero.',
    members: [
      {
        user: {
          id: 'usr_elena_06',
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'UA 1248',
          airline: 'United Airlines',
          arrivalAirport: 'SFO',
          terminal: 'Terminal 2',
          gate: 'Gate 54',
          baggageCarousel: 'Carousel 4',
          scheduledArrival: '4:15 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: false },
          status: 'just_landed',
          statusText: 'Still on the jetbridge',
          currentZoneLocation: 'Gate 54 Jetbridge'
        },
        joinedAt: '4:17 PM',
        dropoffAddress: 'Salesforce Tower, 415 Mission St',
        distanceMiles: 15.6,
        splitAmount: 85.50,
        platformFee: 1.25,
        paymentStatus: 'pending',
        dropoffPin: '9034',
        isCreator: true
      }
    ],
    stops: [
      {
        id: 'stop_airport_3',
        stopIndex: 0,
        passengerId: 'origin',
        passengerName: 'SFO Terminal 2',
        address: 'SFO Level 2 Island',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_3_1',
        stopIndex: 1,
        passengerId: 'usr_elena_06',
        passengerName: 'Elena Rostova',
        address: 'Salesforce Tower, 415 Mission St',
        zoneName: 'Financial District & Embarcadero',
        distanceFromAirportMiles: 15.6,
        estimatedArrivalMin: 32
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'grp_01_downtown': [
    {
      id: 'msg_01',
      groupId: 'grp_01_downtown',
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: 'Ride group created for Downtown & Union Square. Estimated taxi meter: $66.00 ($33.00/person for 2 riders).',
      timestamp: '4:21 PM',
      type: 'system'
    },
    {
      id: 'msg_02',
      groupId: 'grp_01_downtown',
      senderId: 'usr_sarah_02',
      senderName: 'Sarah Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'Hi Marcus! Just waiting at carousel 4 for my checked roller bag.',
      timestamp: '4:22 PM',
      type: 'text'
    },
    {
      id: 'msg_03',
      groupId: 'grp_01_downtown',
      senderId: 'usr_marcus_03',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Hey Sarah! I only had carry-on so I am walking over from T1 toward Level 2 pickup island now.',
      timestamp: '4:25 PM',
      type: 'text'
    },
    {
      id: 'msg_04',
      groupId: 'grp_01_downtown',
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: '🚗 Sarah pre-reserved Uber XL (Black Toyota Highlander, Plate: 8TYP902). Pickup at Terminal 2, Level 2 Island Pillar 2B.',
      timestamp: '4:27 PM',
      type: 'system'
    }
  ]
};

export const QUICK_AIRPORT_REPLIES = [
  '🧳 Just spotted my bag on the carousel!',
  '🚶 Heading to Level 2 pickup island now',
  '📍 I am standing at Pillar 2B',
  '☕ Grabbing quick coffee near security exit',
  '🚕 Driver is 3 minutes away'
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_rec_01',
    rideId: 'grp_01_downtown',
    rideTitle: 'Downtown Hotels & Union Square Split',
    airportCode: 'SFO',
    flightNumber: 'UA 1248',
    date: 'Oct 26, 2026',
    timestamp: Date.now() - 25 * 60 * 1000,
    destinationAddress: 'Marriott Marquis, 780 Mission St',
    ridersCount: 3,
    coRiders: ['Sarah Lin', 'Marcus Vance'],
    splitMethod: 'distance_optimized',
    totalRideCost: 83.50,
    myFareShare: 22.00,
    myTollShare: 2.50,
    myTipShare: 3.33,
    platformFee: 1.25,
    totalAmountPaid: 29.08,
    savingsVsSolo: 42.92,
    paymentMethod: 'Apple Pay (Visa •••• 4242)',
    status: 'in_escrow',
    dropoffPin: '8214',
    receiptNumber: 'ES-2026-SFO-8921'
  },
  {
    id: 'pay_rec_02',
    rideId: 'grp_past_jfk_01',
    rideTitle: 'Midtown Manhattan & Times Square Share',
    airportCode: 'JFK',
    flightNumber: 'DL 402',
    date: 'Oct 14, 2026',
    timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
    destinationAddress: 'Hilton Midtown, 1335 6th Ave',
    ridersCount: 4,
    coRiders: ['Liam Gallagher', 'Chloe Zhang', 'David M.'],
    splitMethod: 'equal',
    totalRideCost: 96.00,
    myFareShare: 20.00,
    myTollShare: 2.25,
    myTipShare: 2.50,
    platformFee: 1.25,
    totalAmountPaid: 26.00,
    savingsVsSolo: 52.50,
    paymentMethod: 'Apple Pay (Visa •••• 4242)',
    status: 'settled',
    dropoffPin: '4190',
    receiptNumber: 'ES-2026-JFK-4109'
  },
  {
    id: 'pay_rec_03',
    rideId: 'grp_past_ord_01',
    rideTitle: 'The Loop Financial District & River North',
    airportCode: 'ORD',
    flightNumber: 'AA 1092',
    date: 'Sep 28, 2026',
    timestamp: Date.now() - 28 * 24 * 60 * 60 * 1000,
    destinationAddress: 'Palmer House Hilton, 17 E Monroe St',
    ridersCount: 3,
    coRiders: ['Jessica Alba', 'Kevin Vance'],
    splitMethod: 'distance_optimized',
    totalRideCost: 72.00,
    myFareShare: 19.50,
    myTollShare: 2.00,
    myTipShare: 2.67,
    platformFee: 1.25,
    totalAmountPaid: 25.42,
    savingsVsSolo: 38.58,
    paymentMethod: 'Google Pay (Mastercard •••• 8819)',
    status: 'settled',
    dropoffPin: '7301',
    receiptNumber: 'ES-2026-ORD-7712'
  }
];
