import React, { useState } from 'react';
import { X, MapPin, Car, Clock, ShieldCheck, Briefcase, Plus, Check } from 'lucide-react';
import { AirportInfo, DestinationZone, RideGroup, UserProfile, VehicleType } from '../types';

interface CreateRideModalProps {
  currentAirport: AirportInfo;
  zones: DestinationZone[];
  user: UserProfile;
  onClose: () => void;
  onCreateGroup: (newGroup: RideGroup) => void;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  currentAirport,
  zones,
  user,
  onClose,
  onCreateGroup
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone_downtown');
  const [dropoffAddress, setDropoffAddress] = useState<string>(zones[0]?.popularDropoffs[0] || 'Marriott Marquis, 780 Mission St');
  const [vehicleType, setVehicleType] = useState<VehicleType>('suv_xl');
  const [departureMinutes, setDepartureMinutes] = useState<number>(20);
  const [groupNotes, setGroupNotes] = useState<string>('Landed and grabbing checked luggage at baggage claim. Looking to split an Uber XL.');

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const z = zones.find((item) => item.id === zoneId);
    if (z && z.popularDropoffs.length > 0) {
      setDropoffAddress(z.popularDropoffs[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const maxRiders = vehicleType === 'suv_xl' ? 4 : vehicleType === 'van' ? 6 : 3;
    const maxCarryOn = vehicleType === 'suv_xl' ? 4 : vehicleType === 'van' ? 6 : 2;
    const maxChecked = vehicleType === 'suv_xl' ? 4 : vehicleType === 'van' ? 6 : 2;

    const baseFare = selectedZone ? selectedZone.estimatedTaxiRate : 65.0;
    const airportFee = 7.50;

    const departureTimestamp = Date.now() + departureMinutes * 60 * 1000;
    const departureDate = new Date(departureTimestamp);
    const timeFormatted = departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newGroup: RideGroup = {
      id: `grp_${Date.now()}`,
      title: `${selectedZone.name} Split`,
      airportCode: currentAirport.code,
      destinationZone: selectedZone.name,
      primaryAddress: dropoffAddress,
      creatorId: user.id,
      creatorName: user.name,
      vehicleType,
      maxRiders,
      maxCarryOn,
      maxChecked,
      departureTimeText: `Leaving around ${timeFormatted}`,
      departureTimestamp,
      status: 'forming',
      baseMeterEstimate: baseFare,
      airportTollFee: airportFee,
      platformFeePerRider: 1.25,
      tipAmount: 10.0,
      splitMethod: 'distance_optimized',
      escrowStatus: 'idle',
      notes: groupNotes,
      bookedRideshareDetails: {
        service: vehicleType === 'suv_xl' ? 'Uber XL' : 'Airport Taxi',
        driverName: 'Rideshare Requested',
        carModel: vehicleType === 'suv_xl' ? 'Large SUV (7-seater)' : 'Standard Sedan',
        licensePlate: 'Pending',
        pickupPillar: 'Level 2 Island Pillar 2B',
        etaMinutes: departureMinutes
      },
      members: [
        {
          user,
          joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dropoffAddress,
          distanceMiles: selectedZone.distanceMiles,
          splitAmount: (baseFare + airportFee + 10.0) / 1,
          platformFee: 1.25,
          paymentStatus: 'pending',
          dropoffPin: String(Math.floor(1000 + Math.random() * 9000)),
          isCreator: true
        }
      ],
      stops: [
        {
          id: `stop_origin_${Date.now()}`,
          stopIndex: 0,
          passengerId: 'origin',
          passengerName: `${currentAirport.code} Terminal ${user.terminal}`,
          address: `${currentAirport.name} Level 2 Rideshare Zone, Island 3, Pillar 2B`,
          zoneName: 'Airport Origin',
          distanceFromAirportMiles: 0,
          estimatedArrivalMin: 0,
          isAirportOrigin: true
        },
        {
          id: `stop_user_${Date.now()}`,
          stopIndex: 1,
          passengerId: user.id,
          passengerName: user.name,
          address: dropoffAddress,
          zoneName: selectedZone.name,
          distanceFromAirportMiles: selectedZone.distanceMiles,
          estimatedArrivalMin: selectedZone.typicalDurationMin
        }
      ]
    };

    onCreateGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Create a Ride Group from {currentAirport.code}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Launch a group chat to connect with landing travelers heading your way
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Destination Zone Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Select Destination Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleZoneChange(zone.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedZoneId === zone.id
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{zone.name}</span>
                    <span className="font-mono text-blue-600">${zone.estimatedTaxiRate.toFixed(0)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{zone.tagline}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {zone.distanceMiles} mi · ~{zone.typicalDurationMin} min
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Specific Dropoff Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Specific Drop-off Address or Hotel
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="e.g. Marriott Marquis, 780 Mission St"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            {/* Quick address suggestions */}
            {selectedZone.popularDropoffs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedZone.popularDropoffs.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDropoffAddress(item)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {item.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              3. Vehicle Type & Trunk Capacity
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVehicleType('suv_xl')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  vehicleType === 'suv_xl'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>XL SUV / Highlander</span>
                  <span className="text-[10px] text-amber-600 font-bold">POPULAR</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">Up to 4 riders</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Fits 4 Carry-ons + 4 Checked Bags
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVehicleType('sedan')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  vehicleType === 'sedan'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Standard Sedan</div>
                <div className="text-[11px] text-slate-600 mt-1">Up to 3 riders</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Fits 2 Carry-ons + 2 Checked Bags
                </div>
              </button>
            </div>
          </div>

          {/* Departure Buffer */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <span>4. Target Departure Time</span>
              <span className="text-blue-600 font-mono lowercase font-bold">
                Leaving in ~{departureMinutes} mins
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDepartureMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    departureMinutes === mins
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Group Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              5. Group Notes / Pickup Details
            </label>
            <textarea
              rows={2}
              value={groupNotes}
              onChange={(e) => setGroupNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-blue-500"
              placeholder="e.g. Waiting for luggage at carousel 4, wearing a grey jacket"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Ride Group</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
