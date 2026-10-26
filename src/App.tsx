/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DiscoveryHub } from './components/DiscoveryHub';
import { RideGroupChat } from './components/RideGroupChat';
import { FlightSyncModal } from './components/FlightSyncModal';
import { CreateRideModal } from './components/CreateRideModal';
import { PaymentSplitModal } from './components/PaymentSplitModal';
import { TerminalMapOverlay } from './components/TerminalMapOverlay';
import { SecurityGuaranteeModal } from './components/SecurityGuaranteeModal';
import { PaymentHistoryModal } from './components/PaymentHistoryModal';
import { AestheticBackdrop, BackgroundTheme } from './components/AestheticBackdrop';
import { Toast, ToastNotification } from './components/Toast';
import { 
  AIRPORTS, 
  INITIAL_USER, 
  DESTINATION_ZONES_DEL,
  getDestinationZonesForAirport,
  INITIAL_GROUPS, 
  INITIAL_CHAT_MESSAGES,
  INITIAL_PAYMENTS 
} from './data/mockData';
import { AirportInfo, DestinationZone, RideGroup, UserProfile, PassengerStatus, ChatMessage, PaymentRecord } from './types';

export default function App() {
  const [currentAirport, setCurrentAirport] = useState<AirportInfo>(AIRPORTS[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [groups, setGroups] = useState<RideGroup[]>(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState<string>('grp_01_cybercity');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [activeTab, setActiveTab] = useState<'discovery' | 'my_ride'>('discovery');
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('runway_twilight');

  // Modals state
  const [isFlightSyncOpen, setIsFlightSyncOpen] = useState(false);
  const [isCreateRideOpen, setIsCreateRideOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTerminalGuideOpen, setIsTerminalGuideOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const handleToggleTheme = () => {
    setBgTheme(prev => prev === 'runway_twilight' ? 'stratosphere' : prev === 'stratosphere' ? 'night_grid' : 'runway_twilight');
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const userHasActiveRide = groups.some((g) => g.members.some((m) => m.user.id === currentUser.id));

  // Trigger Carousel Match toast on initial landing if user shares carousel with someone
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find someone in active groups who shares the carousel
      const match = groups
        .flatMap(g => g.members)
        .find(m => m.user.id !== currentUser.id && m.user.baggageCarousel === currentUser.baggageCarousel);

      if (match) {
        setToast({
          id: 'toast_carousel_match',
          type: 'carousel',
          title: 'Baggage Claim Carousel Alert',
          message: `${match.user.name} (${match.user.flightNumber}) is also at ${currentUser.baggageCarousel}! Meet up at column 4B before heading to rideshare.`,
          actionLabel: 'Open Terminal Map',
          onAction: () => setIsTerminalGuideOpen(true)
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentUser.baggageCarousel, groups]);

  // Handle joining a ride group
  const handleJoinGroup = (group: RideGroup) => {
    // Check if user is already member
    if (group.members.some((m) => m.user.id === currentUser.id)) {
      setActiveGroupId(group.id);
      setActiveTab('my_ride');
      return;
    }

    // Check capacity
    if (group.members.length >= group.maxRiders) {
      setToast({
        id: 'toast_err_full',
        type: 'info',
        title: 'Group Full',
        message: 'This group has reached its maximum passenger capacity.'
      });
      return;
    }

    const defaultAddress = group.primaryAddress;
    const distanceMiles = group.stops[group.stops.length - 1]?.distanceFromAirportMiles || 14.2;

    const newMember = {
      user: currentUser,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dropoffAddress: defaultAddress,
      distanceMiles,
      splitAmount: (group.baseMeterEstimate + group.airportTollFee) / (group.members.length + 1),
      platformFee: 29.0,
      paymentStatus: 'pre_authorized' as const,
      dropoffPin: String(Math.floor(1000 + Math.random() * 9000)),
      isConfirmedDropoff: false
    };

    const newStop = {
      id: `stop_${currentUser.id}_${Date.now()}`,
      stopIndex: group.stops.length,
      passengerId: currentUser.id,
      passengerName: currentUser.name,
      address: defaultAddress,
      zoneName: group.destinationZone,
      distanceFromAirportMiles: distanceMiles,
      estimatedArrivalMin: (group.stops[group.stops.length - 1]?.estimatedArrivalMin || 25) + 4
    };

    const updatedGroup: RideGroup = {
      ...group,
      members: [...group.members, newMember],
      stops: [...group.stops, newStop]
    };

    setGroups((prev) => prev.map((g) => (g.id === group.id ? updatedGroup : g)));
    setActiveGroupId(group.id);
    setActiveTab('my_ride');

    // Add system message to group chat
    const joinMsg: ChatMessage = {
      id: `msg_join_${Date.now()}`,
      groupId: group.id,
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: `🎉 ${currentUser.name} joined the ride group! Pre-authorized in escrow. Estimated fare updated to ₹${(
        (group.baseMeterEstimate + group.airportTollFee + (group.tipAmount || 80) + updatedGroup.members.length * 29) /
        updatedGroup.members.length
      ).toFixed(0)}/rider.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    };

    setChatMessages((prev) => ({
      ...prev,
      [group.id]: [...(prev[group.id] || []), joinMsg]
    }));

    setToast({
      id: 'toast_join_success',
      type: 'success',
      title: 'Joined Ride Group!',
      message: `You joined "${group.title}". Fares are now split between ${updatedGroup.members.length} riders.`
    });
  };

  // Handle creating a new group
  const handleCreateGroup = (newGroup: RideGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(newGroup.id);
    setActiveTab('my_ride');

    const welcomeMsg: ChatMessage = {
      id: `msg_init_${Date.now()}`,
      groupId: newGroup.id,
      senderId: 'system',
      senderName: 'easy_share Bot',
      senderAvatar: '',
      text: `Group chat launched for ${newGroup.destinationZone}. Share your baggage status or tap Terminal Map to coordinate pickup.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    };

    setChatMessages((prev) => ({
      ...prev,
      [newGroup.id]: [welcomeMsg]
    }));

    setToast({
      id: 'toast_created',
      type: 'success',
      title: 'Ride Group Created',
      message: `Group is live on the ${currentAirport.code} destination board for incoming travelers.`
    });
  };

  // Handle sending a chat message
  const handleSendMessage = (text: string, type: ChatMessage['type'] = 'text') => {
    if (!activeGroup) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      groupId: activeGroup.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeGroup.id]: [...(prev[activeGroup.id] || []), newMsg]
    }));

    // Simulated responsive reply after 2.5s if talking in Downtown group
    if (activeGroup.id === 'grp_01_downtown' && text.includes('bag')) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          groupId: activeGroup.id,
          senderId: 'usr_sarah_02',
          senderName: 'Sarah Lin',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          text: 'Awesome, just got mine too! I will meet you at the central escalator to head up to Level 2.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        setChatMessages((prev) => ({
          ...prev,
          [activeGroup.id]: [...(prev[activeGroup.id] || []), replyMsg]
        }));
      }, 2500);
    }
  };

  // Handle updating user's airport status
  const handleUpdateStatus = (newStatus: PassengerStatus) => {
    const statusLabels: Record<PassengerStatus, string> = {
      just_landed: '🛬 Just Landed (Deplaning)',
      baggage_claim: '🧳 At Baggage Claim Carousel 4',
      walking_to_pickup: '🚶 Walking to Rideshare Level 2',
      at_rideshare_zone: '🚕 At Rideshare Zone (Pillar 2B)',
      boarded: '🚗 Boarded in Vehicle'
    };

    const label = statusLabels[newStatus];

    const updatedUser: UserProfile = {
      ...currentUser,
      status: newStatus,
      statusText: label
    };

    setCurrentUser(updatedUser);

    // Update in group members
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        members: g.members.map((m) =>
          m.user.id === currentUser.id ? { ...m, user: updatedUser } : m
        )
      }))
    );

    // Broadcast status message in chat
    if (activeGroup) {
      const statusMsg: ChatMessage = {
        id: `msg_status_${Date.now()}`,
        groupId: activeGroup.id,
        senderId: 'system',
        senderName: 'Status Update',
        senderAvatar: '',
        text: `📍 ${currentUser.name} updated status: ${label}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'status_update'
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeGroup.id]: [...(prev[activeGroup.id] || []), statusMsg]
      }));
    }
  };

  // Handle updating fare and split method in payment modal
  const handleUpdateFare = (baseFare: number, tipAmount: number, splitMethod: 'equal' | 'distance_optimized') => {
    if (!activeGroup) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroup.id
          ? {
              ...g,
              finalFare: baseFare,
              baseMeterEstimate: baseFare,
              tipAmount,
              splitMethod
            }
          : g
      )
    );

    setToast({
      id: 'toast_fare_updated',
      type: 'success',
      title: 'Fare & Split Updated',
      message: `Total meter set to ₹${baseFare.toFixed(2)} with ${splitMethod === 'equal' ? 'Equal' : 'Distance-Optimized'} split.`
    });
  };

  // Handle settling payment for a member
  const handleSettlePayment = (memberId: string) => {
    if (!activeGroup) return;

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroup.id) return g;
        return {
          ...g,
          members: g.members.map((m) =>
            m.user.id === memberId
              ? {
                  ...m,
                  paymentStatus: 'paid',
                  paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              : m
          )
        };
      })
    );

    // If settling current user, record or update in payments ledger
    if (memberId === currentUser.id) {
      setPayments((prev) => {
        const existing = prev.find((p) => p.rideId === activeGroup.id);
        if (existing) {
          return prev.map((p) =>
            p.id === existing.id ? { ...p, status: 'settled' as const } : p
          );
        }

        const totalRide = (activeGroup.baseMeterEstimate || 950) + activeGroup.airportTollFee + (activeGroup.tipAmount || 100);
        const perRider = totalRide / Math.max(1, activeGroup.members.length);

        const newRec: PaymentRecord = {
          id: `pay_${Date.now()}`,
          rideId: activeGroup.id,
          rideTitle: activeGroup.title,
          airportCode: activeGroup.airportCode,
          flightNumber: currentUser.flightNumber,
          date: 'Oct 26, 2026',
          timestamp: Date.now(),
          destinationAddress: activeGroup.primaryAddress,
          ridersCount: activeGroup.members.length,
          coRiders: activeGroup.members.filter((m) => m.user.id !== currentUser.id).map((m) => m.user.name),
          splitMethod: activeGroup.splitMethod,
          totalRideCost: totalRide,
          myFareShare: (activeGroup.baseMeterEstimate || 950) / Math.max(1, activeGroup.members.length),
          myTollShare: activeGroup.airportTollFee / Math.max(1, activeGroup.members.length),
          myTipShare: (activeGroup.tipAmount || 100) / Math.max(1, activeGroup.members.length),
          platformFee: 29.0,
          totalAmountPaid: Number((perRider + 29).toFixed(2)),
          savingsVsSolo: 780.0,
          paymentMethod: 'UPI / Google Pay (HDFC •••• 4242)',
          status: 'settled',
          dropoffPin: '8214',
          receiptNumber: `ES-2026-${activeGroup.airportCode}-${Math.floor(1000 + Math.random() * 9000)}`
        };

        return [newRec, ...prev];
      });
    }

    setToast({
      id: 'toast_paid',
      type: 'success',
      title: 'Payment Confirmed & Receipt Logged',
      message: 'Escrow released. Itemized digital receipt saved to your Payment History ledger.'
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col antialiased text-slate-900 overflow-x-hidden">
      
      {/* Aesthetic Aviation Atmospheric Backdrop */}
      <AestheticBackdrop theme={bgTheme} />

      {/* Toast Micro-Interaction Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Bar Contract (Wordmark, Nav Links, Profile Action, Theme Switcher) */}
      <Header
        currentAirport={currentAirport}
        airports={AIRPORTS}
        onSelectAirport={(ap) => setCurrentAirport(ap)}
        user={currentUser}
        onOpenFlightSync={() => setIsFlightSyncOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        hasActiveRide={userHasActiveRide}
        onOpenTerminalGuide={() => setIsTerminalGuideOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenPaymentHistory={() => setIsPaymentHistoryOpen(true)}
        currentTheme={bgTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {activeTab === 'discovery' ? (
          <DiscoveryHub
            currentAirport={currentAirport}
            destinationZones={getDestinationZonesForAirport(currentAirport.code)}
            groups={groups}
            currentUser={currentUser}
            onSelectGroup={(grp) => {
              setActiveGroupId(grp.id);
              setActiveTab('my_ride');
            }}
            onJoinGroup={handleJoinGroup}
            onOpenCreateRide={() => setIsCreateRideOpen(true)}
            onOpenFlightSync={() => setIsFlightSyncOpen(true)}
            onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          />
        ) : (
          /* Active Ride Group View (Chat, Mini-Map, Status Bar, Fare Banner) */
          <div className="h-[calc(100vh-7.5rem)] max-h-[880px]">
            <RideGroupChat
              group={activeGroup}
              currentUser={currentUser}
              messages={chatMessages[activeGroup.id] || []}
              onSendMessage={handleSendMessage}
              onUpdateUserStatus={handleUpdateStatus}
              onOpenTerminalGuide={() => setIsTerminalGuideOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onBackToDiscovery={() => setActiveTab('discovery')}
            />
          </div>
        )}

      </main>

      {/* Flight Sync & Verification Modal */}
      {isFlightSyncOpen && (
        <FlightSyncModal
          user={currentUser}
          onClose={() => setIsFlightSyncOpen(false)}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* Create Ride Modal */}
      {isCreateRideOpen && (
        <CreateRideModal
          currentAirport={currentAirport}
          zones={getDestinationZonesForAirport(currentAirport.code)}
          user={currentUser}
          onClose={() => setIsCreateRideOpen(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* In-App Payment & Split Modal */}
      {isPaymentModalOpen && activeGroup && (
        <PaymentSplitModal
          group={activeGroup}
          currentUser={currentUser}
          onClose={() => setIsPaymentModalOpen(false)}
          onUpdateFare={handleUpdateFare}
          onSettlePayment={handleSettlePayment}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          onOpenPaymentHistory={() => setIsPaymentHistoryOpen(true)}
        />
      )}

      {/* Terminal Indoor Navigation Overlay */}
      {isTerminalGuideOpen && (
        <TerminalMapOverlay
          currentUser={currentUser}
          members={activeGroup?.members || []}
          onClose={() => setIsTerminalGuideOpen(false)}
        />
      )}

      {/* Low Commission & Bank Escrow Security Modal */}
      {isSecurityModalOpen && (
        <SecurityGuaranteeModal
          onClose={() => setIsSecurityModalOpen(false)}
        />
      )}

      {/* Payment History & Digital Receipts Ledger Modal */}
      {isPaymentHistoryOpen && (
        <PaymentHistoryModal
          payments={payments}
          onClose={() => setIsPaymentHistoryOpen(false)}
        />
      )}

    </div>
  );
}
