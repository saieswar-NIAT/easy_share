import { AirportInfo, DestinationZone, RideGroup, UserProfile, ChatMessage, PaymentRecord } from '../types';

export const AIRPORTS: AirportInfo[] = [
  {
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    ridesharePillarGuide: 'Terminal 3: Multi-Level Car Parking (MLCP) Level 2 & 4, Ola/Uber/Prepaid Island Pillars 12–18. Terminal 2: Curbside Pickup Bay 3.',
    terminals: ['Terminal 3 (Domestic & Int\'l)', 'Terminal 2', 'Terminal 1D'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5', 'Carousel 6', 'Carousel 7', 'Carousel 8']
  },
  {
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    ridesharePillarGuide: 'Terminal 2: Level P7 Parking, Designated App-Cab Pickup Zone Pillars A1-A6. Terminal 1: Arrival Curbside Bay 2.',
    terminals: ['Terminal 2 (T2)', 'Terminal 1 (Domestic T1)'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5', 'Carousel 6']
  },
  {
    code: 'BLR',
    name: 'Kempegowda International Airport',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    ridesharePillarGuide: 'Terminal 1 & 2: Curbside App-Taxi Pickup Zone, Bays 1 to 5 behind Airport Bus Stand.',
    terminals: ['Terminal 1', 'Terminal 2 (Garden Terminal)'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5']
  },
  {
    code: 'HYD',
    name: 'Rajiv Gandhi International Airport',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    ridesharePillarGuide: 'Arrivals Ground Level: Parking Bay C, Ola/Uber Designated Zone Pillars 4-8.',
    terminals: ['Main Passenger Terminal'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4']
  },
  {
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    ridesharePillarGuide: 'Terminal 2 & 3: Level 2 Departures / Rideshare Island. Int\'l: Level 3 Center Island.',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'International'],
    carousels: ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4']
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
    flightNumber: '6E 214',
    airline: 'IndiGo Airlines',
    from: 'Mumbai (BOM)',
    airportCode: 'DEL',
    terminal: 'Terminal 3',
    gate: 'Gate 28',
    carousel: 'Carousel 4',
    arrival: '4:15 PM'
  },
  {
    flightNumber: 'AI 802',
    airline: 'Air India',
    from: 'Bengaluru (BLR)',
    airportCode: 'DEL',
    terminal: 'Terminal 3',
    gate: 'Gate 32',
    carousel: 'Carousel 4', // Same carousel for alert test!
    arrival: '4:18 PM'
  },
  {
    flightNumber: 'UK 945',
    airline: 'Vistara',
    from: 'Hyderabad (HYD)',
    airportCode: 'DEL',
    terminal: 'Terminal 3',
    gate: 'Gate 19',
    carousel: 'Carousel 2',
    arrival: '4:22 PM'
  },
  {
    flightNumber: 'QP 131',
    airline: 'Akasa Air',
    from: 'Goa (GOX)',
    airportCode: 'DEL',
    terminal: 'Terminal 2',
    gate: 'Gate 14',
    carousel: 'Carousel 1',
    arrival: '4:25 PM'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_me_01',
  name: 'Rohan Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isVerified: true,
  flightNumber: '6E 214',
  airline: 'IndiGo',
  arrivalAirport: 'DEL',
  terminal: 'Terminal 3',
  gate: 'Gate 28',
  baggageCarousel: 'Carousel 4',
  scheduledArrival: '4:15 PM',
  luggage: {
    carryOn: 1,
    checked: 1,
    personalItem: true
  },
  status: 'baggage_claim',
  statusText: 'Waiting at Carousel 4',
  currentZoneLocation: 'T3 Baggage Claim Hall (Ground Floor)'
};

export const DESTINATION_ZONES_DEL: DestinationZone[] = [
  {
    id: 'zone_cybercity',
    name: 'Gurgaon Cyber City & Golf Course Rd',
    tagline: 'DLF CyberHub, tech corporate parks & Horizon Centre',
    airportCode: 'DEL',
    distanceMiles: 16.5,
    typicalDurationMin: 28,
    estimatedTaxiRate: 950.0,
    popularDropoffs: [
      'The Leela Ambience Gurugram (Ambience Island)',
      'DLF Cyber City Building 10',
      'One Horizon Center (Golf Course Rd)',
      'Westin Gurgaon (MG Road)'
    ],
    activePassengersCount: 16
  },
  {
    id: 'zone_cp',
    name: 'Connaught Place & Central Delhi',
    tagline: 'Lutyens Delhi, Janpath, hotels & business district',
    airportCode: 'DEL',
    distanceMiles: 18.2,
    typicalDurationMin: 35,
    estimatedTaxiRate: 850.0,
    popularDropoffs: [
      'The Taj Mahal Hotel (1 Mansingh Rd)',
      'The Lalit New Delhi (Barakhamba Rd)',
      'Shangri-La Eros (19 Ashoka Rd)',
      'Connaught Place Inner Circle'
    ],
    activePassengersCount: 21
  },
  {
    id: 'zone_aerocity',
    name: 'Aerocity Hospitality District',
    tagline: 'Aerocity luxury hotels, Worldmark & conference centres',
    airportCode: 'DEL',
    distanceMiles: 4.8,
    typicalDurationMin: 12,
    estimatedTaxiRate: 480.0,
    popularDropoffs: [
      'JW Marriott Hotel Aerocity',
      'Andaz Delhi (Worldmark 1)',
      'Aloft New Delhi Aerocity'
    ],
    activePassengersCount: 11
  },
  {
    id: 'zone_noida',
    name: 'Noida Sector 62 & IT Corridor',
    tagline: 'Expressway tech campuses, Sector 18 & Film City',
    airportCode: 'DEL',
    distanceMiles: 34.0,
    typicalDurationMin: 55,
    estimatedTaxiRate: 1400.0,
    popularDropoffs: [
      'Radisson Blu MBD Hotel (Sector 18)',
      'Logix Cyber Park (Sector 62)',
      'Advant Navis Business Park (Expressway)'
    ],
    activePassengersCount: 9
  },
  {
    id: 'zone_southdelhi',
    name: 'South Delhi & Saket District',
    tagline: 'Greater Kailash, Hauz Khas & Select Citywalk',
    airportCode: 'DEL',
    distanceMiles: 15.2,
    typicalDurationMin: 30,
    estimatedTaxiRate: 750.0,
    popularDropoffs: [
      'Sheraton New Delhi (Saket District Centre)',
      'Eros Hotel (Nehru Place)',
      'Greater Kailash M-Block Market'
    ],
    activePassengersCount: 14
  }
];

export const DESTINATION_ZONES_BOM: DestinationZone[] = [
  {
    id: 'zone_bkc',
    name: 'Bandra Kurla Complex (BKC)',
    tagline: 'Financial capital hub, Jio World Convention Centre & consulates',
    airportCode: 'BOM',
    distanceMiles: 6.5,
    typicalDurationMin: 22,
    estimatedTaxiRate: 450.0,
    popularDropoffs: [
      'Trident Hotel BKC',
      'Sofitel Mumbai BKC',
      'Jio World Centre'
    ],
    activePassengersCount: 18
  },
  {
    id: 'zone_southmumbai',
    name: 'South Mumbai & Colaba',
    tagline: 'Nariman Point, Marine Drive, Fort & Taj Mahal Palace',
    airportCode: 'BOM',
    distanceMiles: 16.5,
    typicalDurationMin: 45,
    estimatedTaxiRate: 850.0,
    popularDropoffs: [
      'The Taj Mahal Palace (Colaba)',
      'The Oberoi (Nariman Point)',
      'Churchgate Station Area'
    ],
    activePassengersCount: 22
  },
  {
    id: 'zone_andheri',
    name: 'Andheri East & MIDC Tech Hub',
    tagline: 'SEEPZ, corporate parks & business hotels near Western Express',
    airportCode: 'BOM',
    distanceMiles: 4.2,
    typicalDurationMin: 15,
    estimatedTaxiRate: 350.0,
    popularDropoffs: [
      'The Lalit Mumbai (Sahar Airport Rd)',
      'Courtyard by Marriott Mumbai International Airport',
      'MIDC Central Road'
    ],
    activePassengersCount: 14
  }
];

export const DESTINATION_ZONES_BLR: DestinationZone[] = [
  {
    id: 'zone_ecity',
    name: 'Electronic City & Koramangala',
    tagline: 'Infosys, Wipro campuses, startup hub & tech parks',
    airportCode: 'BLR',
    distanceMiles: 32.0,
    typicalDurationMin: 65,
    estimatedTaxiRate: 1350.0,
    popularDropoffs: [
      'The Leela Palace (Old Airport Rd)',
      'The Oterra Hotel (Electronic City Phase 1)',
      'Koramangala 4th Block'
    ],
    activePassengersCount: 24
  },
  {
    id: 'zone_whitefield',
    name: 'Whitefield & ITPL',
    tagline: 'International Tech Park Bengaluru & Outer Ring Road',
    airportCode: 'BLR',
    distanceMiles: 26.5,
    typicalDurationMin: 55,
    estimatedTaxiRate: 1200.0,
    popularDropoffs: [
      'The Zuri Whitefield',
      'ITPL Main Gate (Whitefield)',
      'Marriott Hotel Whitefield'
    ],
    activePassengersCount: 19
  },
  {
    id: 'zone_mgroad',
    name: 'MG Road & Central Bengaluru',
    tagline: 'UB City, Brigade Road, hotels & commercial center',
    airportCode: 'BLR',
    distanceMiles: 21.0,
    typicalDurationMin: 45,
    estimatedTaxiRate: 980.0,
    popularDropoffs: [
      'The Ritz-Carlton Bangalore (Residency Rd)',
      'Taj West End (Race Course Rd)',
      'UB City Mall'
    ],
    activePassengersCount: 17
  }
];

export const DESTINATION_ZONES_SFO = DESTINATION_ZONES_DEL;

export function getDestinationZonesForAirport(airportCode: string): DestinationZone[] {
  switch (airportCode) {
    case 'BOM':
      return DESTINATION_ZONES_BOM;
    case 'BLR':
      return DESTINATION_ZONES_BLR;
    case 'DEL':
    default:
      return DESTINATION_ZONES_DEL;
  }
}

export const INITIAL_GROUPS: RideGroup[] = [
  {
    id: 'grp_01_cybercity',
    title: 'Gurgaon Cyber City & Golf Course Rd Split',
    airportCode: 'DEL',
    destinationZone: 'Gurgaon Cyber City & Golf Course Rd',
    primaryAddress: 'The Leela Ambience, Ambience Island, Gurugram',
    creatorId: 'usr_priya_02',
    creatorName: 'Priya Sharma',
    vehicleType: 'suv_xl',
    maxRiders: 4,
    maxCarryOn: 4,
    maxChecked: 4,
    departureTimeText: 'Leaving around 4:35 PM',
    departureTimestamp: Date.now() + 18 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 950.0,
    airportTollFee: 120.0,
    tipAmount: 100.0,
    platformFeePerRider: 29.0,
    splitMethod: 'distance_optimized',
    escrowStatus: 'funds_held_in_escrow',
    notes: 'Landed on AI 802 from BLR. Waiting at Carousel 4 for checked bag. Booking an Ola Prime XL / Innova Crysta.',
    bookedRideshareDetails: {
      service: 'Ola Prime SUV',
      driverName: 'Manish Kumar',
      carModel: 'Toyota Innova Crysta (White)',
      licensePlate: 'DL 1ZB 9402',
      pickupPillar: 'T3 MLCP Level 2 Pillar 14',
      etaMinutes: 12
    },
    members: [
      {
        user: {
          id: 'usr_priya_02',
          name: 'Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'AI 802',
          airline: 'Air India',
          arrivalAirport: 'DEL',
          terminal: 'Terminal 3',
          gate: 'Gate 32',
          baggageCarousel: 'Carousel 4', // Matches Rohan!
          scheduledArrival: '4:18 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: true },
          status: 'baggage_claim',
          statusText: 'At Carousel 4 watching for red bag',
          currentZoneLocation: 'T3 Baggage Claim Carousel 4'
        },
        joinedAt: '4:20 PM',
        dropoffAddress: 'The Leela Ambience, Ambience Island',
        distanceMiles: 16.2,
        splitAmount: 395.0,
        platformFee: 29.0,
        paymentStatus: 'paid',
        dropoffPin: '8214',
        isConfirmedDropoff: true,
        paidAt: '4:28 PM',
        isCreator: true
      },
      {
        user: {
          id: 'usr_vikram_03',
          name: 'Vikram Malhotra',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'UK 945',
          airline: 'Vistara',
          arrivalAirport: 'DEL',
          terminal: 'Terminal 3',
          gate: 'Gate 19',
          baggageCarousel: 'Carousel 2',
          scheduledArrival: '4:22 PM',
          luggage: { carryOn: 1, checked: 0, personalItem: true },
          status: 'walking_to_pickup',
          statusText: 'Walking towards MLCP Level 2',
          currentZoneLocation: 'T3 Exit Skybridge to MLCP'
        },
        joinedAt: '4:24 PM',
        dropoffAddress: 'DLF Cyber City Building 10',
        distanceMiles: 17.5,
        splitAmount: 415.0,
        platformFee: 29.0,
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
        passengerName: 'DEL T3 MLCP Level 2',
        address: 'Indira Gandhi Int\'l T3 Multi-Level Parking Level 2, Pillar 14',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_1',
        stopIndex: 1,
        passengerId: 'usr_priya_02',
        passengerName: 'Priya Sharma',
        address: 'The Leela Ambience, Ambience Island, Gurugram',
        zoneName: 'Gurgaon Cyber City',
        distanceFromAirportMiles: 16.2,
        estimatedArrivalMin: 26
      },
      {
        id: 'stop_2',
        stopIndex: 2,
        passengerId: 'usr_vikram_03',
        passengerName: 'Vikram Malhotra',
        address: 'DLF Cyber City Building 10, Gurugram',
        zoneName: 'Gurgaon Cyber City',
        distanceFromAirportMiles: 17.5,
        estimatedArrivalMin: 32
      }
    ]
  },
  {
    id: 'grp_02_cp',
    title: 'Connaught Place & Central Delhi Cab Split',
    airportCode: 'DEL',
    destinationZone: 'Connaught Place & Central Delhi',
    primaryAddress: 'The Taj Mahal Hotel, 1 Mansingh Rd',
    creatorId: 'usr_ananya_04',
    creatorName: 'Ananya Deshmukh',
    vehicleType: 'sedan',
    maxRiders: 3,
    maxCarryOn: 2,
    maxChecked: 2,
    departureTimeText: 'Leaving around 4:45 PM',
    departureTimestamp: Date.now() + 25 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 850.0,
    airportTollFee: 120.0,
    tipAmount: 80.0,
    platformFeePerRider: 29.0,
    splitMethod: 'equal',
    escrowStatus: 'idle',
    notes: 'Heading to Central Delhi via Dhaula Kuan. Carry-on luggage preferred.',
    members: [
      {
        user: {
          id: 'usr_ananya_04',
          name: 'Ananya Deshmukh',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: '6E 214',
          airline: 'IndiGo',
          arrivalAirport: 'DEL',
          terminal: 'Terminal 3',
          gate: 'Gate 28',
          baggageCarousel: 'Carousel 4',
          scheduledArrival: '4:15 PM',
          luggage: { carryOn: 1, checked: 0, personalItem: true },
          status: 'baggage_claim',
          statusText: 'Carry-on only, waiting at T3 Exit Gate 4',
          currentZoneLocation: 'T3 Arrival Forecourt'
        },
        joinedAt: '4:21 PM',
        dropoffAddress: 'The Taj Mahal Hotel, 1 Mansingh Rd',
        distanceMiles: 18.2,
        splitAmount: 540.0,
        platformFee: 29.0,
        paymentStatus: 'pending',
        dropoffPin: '6192',
        isCreator: true
      },
      {
        user: {
          id: 'usr_arjun_05',
          name: 'Arjun Singhania',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: 'QP 131',
          airline: 'Akasa Air',
          arrivalAirport: 'DEL',
          terminal: 'Terminal 2',
          gate: 'Gate 14',
          baggageCarousel: 'Carousel 1',
          scheduledArrival: '4:25 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: true },
          status: 'walking_to_pickup',
          statusText: 'Taking shuttle from T2 to T3 pickup bay',
          currentZoneLocation: 'Inter-terminal walkway'
        },
        joinedAt: '4:27 PM',
        dropoffAddress: 'Shangri-La Eros, Ashoka Rd',
        distanceMiles: 18.5,
        splitAmount: 540.0,
        platformFee: 29.0,
        paymentStatus: 'pending',
        dropoffPin: '1482'
      }
    ],
    stops: [
      {
        id: 'stop_airport_2',
        stopIndex: 0,
        passengerId: 'origin',
        passengerName: 'DEL Terminal 3 Pickup',
        address: 'DEL Terminal 3 MLCP Pickup Bay 3',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_2_1',
        stopIndex: 1,
        passengerId: 'usr_ananya_04',
        passengerName: 'Ananya Deshmukh',
        address: 'The Taj Mahal Hotel, 1 Mansingh Rd',
        zoneName: 'Connaught Place & Central Delhi',
        distanceFromAirportMiles: 18.2,
        estimatedArrivalMin: 32
      },
      {
        id: 'stop_2_2',
        stopIndex: 2,
        passengerId: 'usr_arjun_05',
        passengerName: 'Arjun Singhania',
        address: 'Shangri-La Eros, 19 Ashoka Rd',
        zoneName: 'Connaught Place',
        distanceFromAirportMiles: 18.5,
        estimatedArrivalMin: 36
      }
    ]
  },
  {
    id: 'grp_03_noida',
    title: 'Noida IT Park & Sector 62 Ride Share',
    airportCode: 'DEL',
    destinationZone: 'Noida Sector 62 & IT Corridor',
    primaryAddress: 'Logix Cyber Park, Sector 62, Noida',
    creatorId: 'usr_kunal_06',
    creatorName: 'Kunal Kapoor',
    vehicleType: 'sedan',
    maxRiders: 3,
    maxCarryOn: 3,
    maxChecked: 2,
    departureTimeText: 'Leaving around 4:55 PM',
    departureTimestamp: Date.now() + 35 * 60 * 1000,
    status: 'forming',
    baseMeterEstimate: 1400.0,
    airportTollFee: 150.0,
    tipAmount: 100.0,
    platformFeePerRider: 29.0,
    splitMethod: 'distance_optimized',
    escrowStatus: 'idle',
    notes: 'Heading towards Noida via Barapullah / DND Flyway. Looking to split an Uber or BluSmart.',
    members: [
      {
        user: {
          id: 'usr_kunal_06',
          name: 'Kunal Kapoor',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          flightNumber: '6E 214',
          airline: 'IndiGo',
          arrivalAirport: 'DEL',
          terminal: 'Terminal 3',
          gate: 'Gate 28',
          baggageCarousel: 'Carousel 4',
          scheduledArrival: '4:15 PM',
          luggage: { carryOn: 1, checked: 1, personalItem: false },
          status: 'just_landed',
          statusText: 'Deplaning aerobridge',
          currentZoneLocation: 'Gate 28 Aerobridge'
        },
        joinedAt: '4:17 PM',
        dropoffAddress: 'Logix Cyber Park, Sector 62, Noida',
        distanceMiles: 34.0,
        splitAmount: 1679.0,
        platformFee: 29.0,
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
        passengerName: 'DEL Terminal 3',
        address: 'DEL T3 MLCP Level 2',
        zoneName: 'Airport Origin',
        distanceFromAirportMiles: 0,
        estimatedArrivalMin: 0,
        isAirportOrigin: true
      },
      {
        id: 'stop_3_1',
        stopIndex: 1,
        passengerId: 'usr_kunal_06',
        passengerName: 'Kunal Kapoor',
        address: 'Logix Cyber Park, Sector 62, Noida',
        zoneName: 'Noida Sector 62',
        distanceFromAirportMiles: 34.0,
        estimatedArrivalMin: 52
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'grp_01_cybercity': [
    {
      id: 'msg_01',
      groupId: 'grp_01_cybercity',
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: 'Ride group created for Gurgaon Cyber City. Estimated fare: ₹950.00 (~₹360/person with 3 riders). Flat ₹29 micro-fee.',
      timestamp: '4:21 PM',
      type: 'system'
    },
    {
      id: 'msg_02',
      groupId: 'grp_01_cybercity',
      senderId: 'usr_priya_02',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'Hi Vikram! Just waiting at carousel 4 for my red checked bag.',
      timestamp: '4:22 PM',
      type: 'text'
    },
    {
      id: 'msg_03',
      groupId: 'grp_01_cybercity',
      senderId: 'usr_vikram_03',
      senderName: 'Vikram Malhotra',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Hey Priya! I only have cabin luggage so I am walking toward T3 MLCP Level 2 pillar 14 now.',
      timestamp: '4:25 PM',
      type: 'text'
    },
    {
      id: 'msg_04',
      groupId: 'grp_01_cybercity',
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: '🚗 Priya pre-reserved Ola Prime SUV (White Innova Crysta, Plate: DL 1ZB 9402). Meeting spot: T3 MLCP Level 2 Pillar 14.',
      timestamp: '4:27 PM',
      type: 'system'
    }
  ]
};

export const QUICK_AIRPORT_REPLIES = [
  '🧳 Just spotted my bag on the carousel!',
  '🚶 Heading to MLCP Level 2 pickup zone now',
  '📍 I am standing near Pillar 14',
  '☕ Grabbing quick chai near arrival exit',
  '🚕 Driver is 3 minutes away'
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_rec_01',
    rideId: 'grp_01_cybercity',
    rideTitle: 'Gurgaon Cyber City & Golf Course Rd Split',
    airportCode: 'DEL',
    flightNumber: '6E 214',
    date: 'Oct 26, 2026',
    timestamp: Date.now() - 25 * 60 * 1000,
    destinationAddress: 'The Leela Ambience, Ambience Island, Gurugram',
    ridersCount: 3,
    coRiders: ['Priya Sharma', 'Vikram Malhotra'],
    splitMethod: 'distance_optimized',
    totalRideCost: 1170.0,
    myFareShare: 320.0,
    myTollShare: 40.0,
    myTipShare: 33.0,
    platformFee: 29.0,
    totalAmountPaid: 422.0,
    savingsVsSolo: 780.0,
    paymentMethod: 'UPI / Google Pay (HDFC •••• 4242)',
    status: 'in_escrow',
    dropoffPin: '8214',
    receiptNumber: 'ES-2026-DEL-8921'
  },
  {
    id: 'pay_rec_02',
    rideId: 'grp_past_bom_01',
    rideTitle: 'Bandra Kurla Complex (BKC) & South Mumbai',
    airportCode: 'BOM',
    flightNumber: 'AI 802',
    date: 'Oct 14, 2026',
    timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
    destinationAddress: 'Trident Hotel BKC, Bandra',
    ridersCount: 4,
    coRiders: ['Siddharth Mehta', 'Ananya Iyer', 'Dev Patel'],
    splitMethod: 'equal',
    totalRideCost: 1250.0,
    myFareShare: 260.0,
    myTollShare: 35.0,
    myTipShare: 25.0,
    platformFee: 29.0,
    totalAmountPaid: 349.0,
    savingsVsSolo: 820.0,
    paymentMethod: 'UPI / PhonePe',
    status: 'settled',
    dropoffPin: '4190',
    receiptNumber: 'ES-2026-BOM-4109'
  },
  {
    id: 'pay_rec_03',
    rideId: 'grp_past_blr_01',
    rideTitle: 'Electronic City & Koramangala IT Corridor',
    airportCode: 'BLR',
    flightNumber: 'UK 945',
    date: 'Sep 28, 2026',
    timestamp: Date.now() - 28 * 24 * 60 * 60 * 1000,
    destinationAddress: 'The Leela Palace, Old Airport Rd, Bengaluru',
    ridersCount: 3,
    coRiders: ['Sneha Reddy', 'Aditya Roy'],
    splitMethod: 'distance_optimized',
    totalRideCost: 1350.0,
    myFareShare: 380.0,
    myTollShare: 45.0,
    myTipShare: 35.0,
    platformFee: 29.0,
    totalAmountPaid: 489.0,
    savingsVsSolo: 920.0,
    paymentMethod: 'RuPay Card (SBI •••• 9921)',
    status: 'settled',
    dropoffPin: '7301',
    receiptNumber: 'ES-2026-BLR-7712'
  }
];
