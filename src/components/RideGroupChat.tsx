import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Users, ShieldCheck, MapPin, DollarSign, Clock, Navigation, 
  Sparkles, CreditCard, Car, ChevronRight, AlertCircle, Briefcase, Package, ArrowLeft
} from 'lucide-react';
import { RideGroup, UserProfile, ChatMessage, PassengerStatus, GroupMember } from '../types';
import { InteractiveRouteMap } from './InteractiveRouteMap';
import { TrunkVisualizer } from './TrunkVisualizer';
import { QUICK_AIRPORT_REPLIES } from '../data/mockData';

interface RideGroupChatProps {
  group: RideGroup;
  currentUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: ChatMessage['type']) => void;
  onUpdateUserStatus: (newStatus: PassengerStatus) => void;
  onOpenTerminalGuide: () => void;
  onOpenPaymentModal: () => void;
  onLeaveGroup?: () => void;
  onBackToDiscovery?: () => void;
}

export const RideGroupChat: React.FC<RideGroupChatProps> = ({
  group,
  currentUser,
  messages,
  onSendMessage,
  onUpdateUserStatus,
  onOpenTerminalGuide,
  onOpenPaymentModal,
  onLeaveGroup,
  onBackToDiscovery
}) => {
  const [inputText, setInputText] = useState('');
  const [showTrunkModal, setShowTrunkModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  const handleQuickChip = (chipText: string) => {
    onSendMessage(chipText, 'text');
  };

  // Status buttons configuration
  const statusOptions: Array<{ id: PassengerStatus; label: string; icon: string }> = [
    { id: 'just_landed', label: 'Just Landed', icon: '🛬' },
    { id: 'baggage_claim', label: 'At Baggage Claim', icon: '🧳' },
    { id: 'walking_to_pickup', label: 'En Route to Pickup', icon: '🚶' },
    { id: 'at_rideshare_zone', label: 'At Rideshare Zone', icon: '🚕' },
    { id: 'boarded', label: 'Boarded Car', icon: '🚗' },
  ];

  // Carousel Match Detection
  const carouselBuddy = group.members.find(
    (m) => m.user.id !== currentUser.id && m.user.baggageCarousel === currentUser.baggageCarousel
  );

  // Fare calculations
  const totalRiders = Math.max(1, group.members.length);
  const estimatedTotalFare = (group.baseMeterEstimate || 66.0) + (group.airportTollFee || 7.50) + (group.tipAmount || 10.0);
  const perPersonCost = estimatedTotalFare / totalRiders;
  const soloEstimated = 64.0 + 7.50; // standard solo taxi baseline
  const estimatedSavings = Math.max(0, soloEstimated - perPersonCost);

  return (
    <div className="flex flex-col h-full bg-slate-50/92 backdrop-blur-md rounded-3xl border border-white/80 overflow-hidden shadow-lg">
      
      {/* 1. Header Toolbar with Dynamic Fare Estimation Banner */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBackToDiscovery && (
              <button
                onClick={onBackToDiscovery}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Back to Discovery Hub"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {group.title}
                </h2>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {group.vehicleType === 'suv_xl' ? 'Uber XL' : 'Taxi Sedan'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Drop-off zone: <strong>{group.destinationZone}</strong> · {group.departureTimeText}
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Fare Counter Badge */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onOpenTerminalGuide}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Terminal Map</span>
            </button>

            <button
              onClick={onOpenPaymentModal}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Fare Split (${perPersonCost.toFixed(2)})</span>
            </button>
          </div>

        </div>

        {/* Dynamic Fare Estimation Banner with Low Commission & Escrow Ribbon */}
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-xs shrink-0">
              ${perPersonCost.toFixed(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>Estimated Cost per Person</span>
                <span className="text-slate-400 font-normal">(${estimatedTotalFare.toFixed(2)} total ÷ {totalRiders} riders)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                  $1.25 FEE
                </span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-2 mt-0.5">
                <span>You save <strong>${estimatedSavings.toFixed(2)}</strong> vs solo taxi!</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Bank Escrow Protected
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
            {/* Passenger Dropoff PIN badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-xl border border-slate-200 text-[11px] font-mono shadow-2xs">
              <span className="text-slate-400">Drop-Off PIN:</span>
              <strong className="text-slate-900">
                {group.members.find(m => m.user.id === currentUser.id)?.dropoffPin || '8214'}
              </strong>
            </div>

            <TrunkVisualizer
              vehicleType={group.vehicleType}
              maxCarryOn={group.maxCarryOn}
              maxChecked={group.maxChecked}
              members={group.members}
              compact
            />
          </div>
        </div>
      </div>

      {/* 2. Carousel Match Banner (Micro-Interaction) */}
      {carouselBuddy && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Baggage Carousel Alert:</strong> Both you and {carouselBuddy.user.name} are assigned to{' '}
              <span className="font-bold underline">{currentUser.baggageCarousel}</span>. Meet by column 4B to walk up together!
            </span>
          </div>
          <button
            onClick={onOpenTerminalGuide}
            className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs shrink-0 cursor-pointer"
          >
            Show on Terminal Map
          </button>
        </div>
      )}

      {/* 3. Integrated Interactive Route Mini-Map (Pinned) */}
      <div className="p-3 sm:p-4 pb-0">
        <InteractiveRouteMap group={group} />
      </div>

      {/* 4. Live Status Indicators Strip */}
      <div className="p-3 sm:p-4 pb-2">
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Your Current Airport Status:
            </span>
            <span className="text-[11px] text-blue-600 font-mono font-medium">
              Tap to update all group members
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {statusOptions.map((opt) => {
              const isActive = currentUser.status === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onUpdateUserStatus(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Passenger status chips */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.members.map((member) => (
              <button
                key={member.user.id}
                onClick={onOpenTerminalGuide}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                title="View terminal location"
              >
                <div className="relative">
                  <img
                    src={member.user.avatar}
                    alt={member.user.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {member.user.isVerified && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border border-white"></span>
                  )}
                </div>
                <div className="truncate min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {member.user.name.split(' ')[0]} {member.user.id === currentUser.id ? '(You)' : ''}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">
                    {member.user.status === 'baggage_claim' ? '🧳 At Carousel' : member.user.status === 'at_rideshare_zone' ? '🚕 Pillar 2B' : '🚶 En Route'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Chat Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-[160px]">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.type === 'system';
          const isStatusUpdate = msg.type === 'status_update';

          if (isSystem || isStatusUpdate) {
            return (
              <div key={msg.id} className="flex justify-center my-1">
                <div className="bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full text-[11px] font-medium max-w-md text-center">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={msg.senderName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                />
              )}

              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                isMe ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200'
              }`}>
                {!isMe && (
                  <div className="font-bold text-[10px] text-blue-600 mb-0.5">
                    {msg.senderName}
                  </div>
                )}
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`text-[9px] mt-1 text-right font-mono ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 6. Quick Airport Coordination Replies Chips */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <span className="text-[10px] uppercase font-semibold text-slate-400 shrink-0">Quick:</span>
        {QUICK_AIRPORT_REPLIES.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleQuickChip(reply)}
            className="px-2.5 py-1 bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-700 rounded-lg text-[11px] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* 7. Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message group members (e.g., 'At pillar 2B now')"
          className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
