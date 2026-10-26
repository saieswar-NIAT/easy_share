import { GroupMember, RouteStop } from '../types';

export interface SplitResult {
  memberId: string;
  memberName: string;
  distanceMiles: number;
  fixedShare: number;
  distanceShare: number;
  tipShare: number;
  platformFee: number;
  totalDue: number;
  savingsVsSolo: number;
  savingsVsCommercialRideshare: number;
  soloEstimatedFare: number;
  escrowStatus: 'pending' | 'pre_authorized' | 'escrow_held' | 'paid';
  dropoffPin: string;
}

export interface FareCalculationSummary {
  splitMethod: 'equal' | 'distance_optimized';
  totalFare: number;
  baseFare: number;
  airportTollFee: number;
  tipAmount: number;
  platformFeePerRider: number;
  totalPlatformFees: number;
  riderCount: number;
  perPersonAverage: number;
  totalSavedCombined: number;
  competitorCommissionSaved: number;
  escrowHoldTotal: number;
  netCreatorPayout: number;
  breakdown: SplitResult[];
}

// Low Commission Guarantee: flat $1.25 micro-fee vs 25%-35% commercial cuts
export const PLATFORM_FEE_PER_RIDER = 1.25;

export function calculateFareSplits(
  members: GroupMember[],
  stops: RouteStop[],
  baseFare: number,
  airportTollFee: number,
  tipAmount: number,
  splitMethod: 'equal' | 'distance_optimized'
): FareCalculationSummary {
  const riderCount = members.length;
  const totalPlatformFees = riderCount * PLATFORM_FEE_PER_RIDER;
  const totalRideCost = baseFare + airportTollFee + tipAmount;
  const totalFareWithFees = totalRideCost + totalPlatformFees;

  if (riderCount === 0) {
    return {
      splitMethod,
      totalFare: 0,
      baseFare,
      airportTollFee,
      tipAmount,
      platformFeePerRider: PLATFORM_FEE_PER_RIDER,
      totalPlatformFees: 0,
      riderCount: 0,
      perPersonAverage: 0,
      totalSavedCombined: 0,
      competitorCommissionSaved: 0,
      escrowHoldTotal: 0,
      netCreatorPayout: 0,
      breakdown: []
    };
  }

  // Calculate solo taxi cost baseline for each member based on their distance
  const getSoloFare = (distance: number) => {
    // Standard taxi formula: $3.50 flag drop + $3.25/mile + $5.50 airport fee
    return Math.max(25, 3.50 + distance * 3.25 + airportTollFee);
  };

  // What commercial rideshare (Uber/Lyft) would take at ~28% platform commission:
  const commercialCut = totalRideCost * 0.28;
  const competitorCommissionSaved = Math.max(0, commercialCut - totalPlatformFees);

  if (splitMethod === 'equal') {
    const perPersonRideShare = totalRideCost / riderCount;
    const perPersonTotal = perPersonRideShare + PLATFORM_FEE_PER_RIDER;

    const breakdown: SplitResult[] = members.map((m) => {
      const solo = getSoloFare(m.distanceMiles || 14);
      return {
        memberId: m.user.id,
        memberName: m.user.name,
        distanceMiles: m.distanceMiles || 14,
        fixedShare: Number((airportTollFee / riderCount).toFixed(2)),
        distanceShare: Number((baseFare / riderCount).toFixed(2)),
        tipShare: Number((tipAmount / riderCount).toFixed(2)),
        platformFee: PLATFORM_FEE_PER_RIDER,
        totalDue: Number(perPersonTotal.toFixed(2)),
        savingsVsSolo: Number(Math.max(0, solo - perPersonTotal).toFixed(2)),
        savingsVsCommercialRideshare: Number((competitorCommissionSaved / riderCount).toFixed(2)),
        soloEstimatedFare: Number(solo.toFixed(2)),
        escrowStatus: m.paymentStatus,
        dropoffPin: m.dropoffPin || '4921'
      };
    });

    const totalSavedCombined = breakdown.reduce((acc, curr) => acc + curr.savingsVsSolo, 0);

    return {
      splitMethod: 'equal',
      totalFare: Number(totalFareWithFees.toFixed(2)),
      baseFare,
      airportTollFee,
      tipAmount,
      platformFeePerRider: PLATFORM_FEE_PER_RIDER,
      totalPlatformFees: Number(totalPlatformFees.toFixed(2)),
      riderCount,
      perPersonAverage: Number(perPersonTotal.toFixed(2)),
      totalSavedCombined: Number(totalSavedCombined.toFixed(2)),
      competitorCommissionSaved: Number(competitorCommissionSaved.toFixed(2)),
      escrowHoldTotal: Number(totalRideCost.toFixed(2)),
      netCreatorPayout: Number(totalRideCost.toFixed(2)), // 100% of ride fare + tip goes to creator/driver!
      breakdown
    };
  }

  // Sequential Distance-Optimized Split:
  // Sort members by dropoff distance from airport
  const sortedStops = [...stops]
    .filter((s) => !s.isAirportOrigin)
    .sort((a, b) => a.distanceFromAirportMiles - b.distanceFromAirportMiles);

  // Equal division of fixed airport fee & tolls
  const fixedSharePerPerson = airportTollFee / riderCount;
  const tipSharePerPerson = tipAmount / riderCount;

  const totalRouteMiles = Math.max(1, sortedStops[sortedStops.length - 1]?.distanceFromAirportMiles || 15);
  const costPerMile = baseFare / totalRouteMiles;

  const distanceShareMap = new Map<string, number>();
  members.forEach(m => distanceShareMap.set(m.user.id, 0));

  let previousMileage = 0;
  for (let i = 0; i < sortedStops.length; i++) {
    const currentStop = sortedStops[i];
    const segmentMiles = Math.max(0, currentStop.distanceFromAirportMiles - previousMileage);
    const segmentCost = segmentMiles * costPerMile;
    
    // Remaining riders who travel this segment (from index i to end)
    const activeRidersInSegment = sortedStops.slice(i);
    const activeCount = Math.max(1, activeRidersInSegment.length);
    const costPerRiderInSegment = segmentCost / activeCount;

    for (const riderStop of activeRidersInSegment) {
      const currentVal = distanceShareMap.get(riderStop.passengerId) || 0;
      distanceShareMap.set(riderStop.passengerId, currentVal + costPerRiderInSegment);
    }

    previousMileage = currentStop.distanceFromAirportMiles;
  }

  const breakdown: SplitResult[] = members.map((m) => {
    const distShare = distanceShareMap.get(m.user.id) || (baseFare / riderCount);
    const totalDue = Number((fixedSharePerPerson + distShare + tipSharePerPerson + PLATFORM_FEE_PER_RIDER).toFixed(2));
    const solo = getSoloFare(m.distanceMiles || 14);
    return {
      memberId: m.user.id,
      memberName: m.user.name,
      distanceMiles: m.distanceMiles || 14,
      fixedShare: Number(fixedSharePerPerson.toFixed(2)),
      distanceShare: Number(distShare.toFixed(2)),
      tipShare: Number(tipSharePerPerson.toFixed(2)),
      platformFee: PLATFORM_FEE_PER_RIDER,
      totalDue,
      savingsVsSolo: Number(Math.max(0, solo - totalDue).toFixed(2)),
      savingsVsCommercialRideshare: Number((competitorCommissionSaved / riderCount).toFixed(2)),
      soloEstimatedFare: Number(solo.toFixed(2)),
      escrowStatus: m.paymentStatus,
      dropoffPin: m.dropoffPin || '4921'
    };
  });

  const totalSavedCombined = breakdown.reduce((acc, curr) => acc + curr.savingsVsSolo, 0);

  return {
    splitMethod: 'distance_optimized',
    totalFare: Number(totalFareWithFees.toFixed(2)),
    baseFare,
    airportTollFee,
    tipAmount,
    platformFeePerRider: PLATFORM_FEE_PER_RIDER,
    totalPlatformFees: Number(totalPlatformFees.toFixed(2)),
    riderCount,
    perPersonAverage: Number((totalFareWithFees / riderCount).toFixed(2)),
    totalSavedCombined: Number(totalSavedCombined.toFixed(2)),
    competitorCommissionSaved: Number(competitorCommissionSaved.toFixed(2)),
    escrowHoldTotal: Number(totalRideCost.toFixed(2)),
    netCreatorPayout: Number(totalRideCost.toFixed(2)), // 100% of ride goes to creator!
    breakdown
  };
}
