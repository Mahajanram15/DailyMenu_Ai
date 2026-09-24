import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Cpu, 
  Utensils, 
  ShoppingBag, 
  Ticket, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  TrendingUp, 
  Languages, 
  Clock, 
  CheckCircle2,
  Zap,
  BellRing,
  ChevronRight,
  Scan
} from 'lucide-react';
import { Button, Card, Badge, AnimatedCounter } from '../ui';
import confetti from 'canvas-confetti';

interface Scenario {
  id: string;
  title: string;
  photoUrl: string;
  identifiedIngredients: string[];
  dishName: string;
  dishNameHi: string;
  dishNameMr: string;
  category: string;
  cost: number;
  recommendedPrice: number;
  margin: number;
  prepTime: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'paneer-pav',
    title: 'Morning Dairy & Bakery Stock',
    photoUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    identifiedIngredients: ['Fresh Malai Paneer (2kg)', 'Mint & Coriander', 'Ladi Pav (40 pcs)', 'Butter & Spices'],
    dishName: 'Amritsari Paneer Tikka Sliders',
    dishNameHi: 'अमृतसरी पनीर टिक्का स्लाइडर',
    dishNameMr: 'अमृतसरी पनीर टिक्का स्लायडर',
    category: 'Daily Special Bites',
    cost: 48,
    recommendedPrice: 130,
    margin: 63,
    prepTime: 8,
  },
  {
    id: 'chai-masala',
    title: 'Assam Tea & Whole Spices',
    photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    identifiedIngredients: ['Assam CTC Dust', 'Fresh Crushed Adrak', 'Green Cardamom Pods', 'Full Cream Milk'],
    dishName: 'Signature Adrak Elaichi Kulhad Chai',
    dishNameHi: 'अदरक इलायची कुल्हड़ चाय',
    dishNameMr: 'आले वेलची कुल्हड चहा',
    category: 'Hot Beverages',
    cost: 11,
    recommendedPrice: 35,
    margin: 68,
    prepTime: 4,
  },
  {
    id: 'chaat-tokri',
    title: 'Puris & Sweet Chutneys',
    photoUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    identifiedIngredients: ['Semolina Puris', 'Boiled Potatoes & Sprouts', 'Chilled Thick Curd', 'Imli-Khajoor Chutney'],
    dishName: 'Royal Dahi Sev Batata Puri',
    dishNameHi: 'शाही दही पूरी',
    dishNameMr: 'शाही दही पुरी',
    category: 'Artisanal Chaats',
    cost: 26,
    recommendedPrice: 90,
    margin: 71,
    prepTime: 5,
  }
];

export const InteractiveAiDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenCode, setTokenCode] = useState<string>('A24');

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setCurrentStep(1);
  };

  const runAiAnalysis = () => {
    setIsProcessing(true);
    setCurrentStep(2);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
    }, 1800);
  };

  const handleSimulateOrder = () => {
    const nextCode = `A${Math.floor(20 + Math.random() * 30)}`;
    setTokenCode(nextCode);
    setCurrentStep(5);
  };

  const handleAdvanceToReady = () => {
    setCurrentStep(6);
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const pipelineStages = [
    { num: 1, label: 'PHOTO', icon: Camera },
    { num: 2, label: 'AI', icon: Cpu },
    { num: 3, label: 'MENU', icon: Utensils },
    { num: 4, label: 'ORDER', icon: ShoppingBag },
    { num: 5, label: 'TOKEN', icon: Ticket },
    { num: 6, label: 'READY', icon: BellRing },
  ];

  return (
    <div className="w-full relative">
      
      {/* Background radiant ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/15 via-electric-500/15 to-amber-500/15 blur-3xl -z-10 rounded-3xl animate-mesh" />

      {/* Main Container Card */}
      <div className="glass-dropdown rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Animated Connected Pipeline Bar (PHOTO → AI → MENU → ORDER → TOKEN → READY) */}
        <div className="space-y-4 pb-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Interactive Live Food Pipeline</h3>
                <p className="text-xs text-slate-400">Experience zero-waste menu synthesis from crate photo to customer token</p>
              </div>
            </div>

            <Badge variant="brand" size="sm" className="font-mono">
              Stage {currentStep} of 6
            </Badge>
          </div>

          {/* Connected Flow Steps with Animated Connecting Lines */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
            {pipelineStages.map((stage, idx) => {
              const isPast = currentStep > stage.num;
              const isCurrent = currentStep === stage.num;
              const Icon = stage.icon;

              return (
                <React.Fragment key={stage.num}>
                  {/* Stage Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      if (stage.num <= currentStep || stage.num === 1) {
                        setCurrentStep(stage.num as any);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 ${
                      isCurrent
                        ? 'bg-brand-500 text-obsidian-950 shadow-lg shadow-brand-500/40 scale-105 ring-2 ring-brand-400/60'
                        : isPast
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                        : 'bg-obsidian-850 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{stage.label}</span>
                    {isPast && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Animated Connecting Line */}
                  {idx < pipelineStages.length - 1 && (
                    <div className="flex-1 min-w-[12px] sm:min-w-[28px] h-0.5 relative mx-1">
                      <div className={`h-full w-full rounded-full transition-colors ${
                        idx < currentStep - 1 ? 'bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-800'
                      }`} />
                      {idx === currentStep - 1 && (
                        <div className="absolute inset-0 bg-brand-400 animate-ping opacity-75" />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area for Stages */}
        <div className="py-2">
          
          {/* STEP 1: PHOTO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">1. Select Morning Kitchen Inventory Batch</h4>
                  <p className="text-xs text-slate-400">Click a test stock batch to trigger computer vision analysis:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SCENARIOS.map((sc) => (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden group menu-card-hover ${
                      selectedScenario.id === sc.id
                        ? 'bg-brand-500/15 border-brand-400 shadow-xl shadow-brand-500/10 scale-[1.02]'
                        : 'bg-obsidian-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                      <img src={sc.photoUrl} alt={sc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                      {selectedScenario.id === sc.id && (
                        <div className="absolute top-2 right-2 bg-brand-500 text-obsidian-950 rounded-full p-1 shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white mb-1.5">{sc.title}</h5>
                    <div className="space-y-1">
                      {sc.identifiedIngredients.slice(0, 2).map((ing, i) => (
                        <span key={i} className="inline-block text-[11px] bg-obsidian-900 text-slate-300 px-2 py-0.5 rounded-md mr-1 border border-slate-700/50">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  variant="glow" 
                  size="md" 
                  onClick={runAiAnalysis}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Analyze with AI Vision Model
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: AI SCANNING ANIMATION */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in zoom-in-95">
              <div className="relative w-56 h-36 rounded-2xl overflow-hidden border-2 border-brand-500/80 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <img src={selectedScenario.photoUrl} alt="Scanning" className="w-full h-full object-cover opacity-85" />
                
                {/* Optical Laser Grid Scan Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-300 to-transparent shadow-[0_0_20px_#10b981] animate-laser" />
                
                {/* Corner reticle elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-400" />

                <div className="absolute inset-0 bg-brand-500/5 pointer-events-none animate-optical-grid" />
              </div>

              <div className="space-y-2 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-mono font-semibold border border-brand-500/30">
                  <Scan className="w-3.5 h-3.5 animate-spin" /> Neural Vision Scan Active
                </div>
                <h4 className="text-lg font-bold font-display text-white">Extracting Ingredients & Formulating Yield</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Optical recognition running • Computing unit batch costing • Generating Hindi/Marathi culinary descriptions...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: MENU GENERATED */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">3. AI Formulated Dish & Optimal Margin</h4>
                  <p className="text-xs text-slate-400">Priced to ensure zero leftover evening waste</p>
                </div>
                <Badge variant="emerald" size="sm" dot>AI Confidence 99.4%</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Dish Card */}
                <div className="rounded-2xl p-4 bg-obsidian-850 border border-slate-800 space-y-3 menu-card-hover">
                  <div className="flex gap-3.5 items-start">
                    <img src={selectedScenario.photoUrl} alt={selectedScenario.dishName} className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0" />
                    <div className="space-y-1">
                      <Badge variant="brand" size="sm">{selectedScenario.category}</Badge>
                      <h5 className="text-sm font-bold text-white">{selectedScenario.dishName}</h5>
                      <p className="text-xs text-brand-400 font-medium font-sans">{selectedScenario.dishNameMr} • {selectedScenario.dishNameHi}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3 text-amber-400" /> Prep: ~{selectedScenario.prepTime} mins
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Selling Price</span>
                      <span className="text-xl font-extrabold text-white font-mono">₹{selectedScenario.recommendedPrice}</span>
                    </div>
                    <Badge variant="emerald" size="md" className="font-mono">
                      {selectedScenario.margin}% Profit Margin
                    </Badge>
                  </div>
                </div>

                {/* AI Costing Details */}
                <div className="rounded-2xl p-4 bg-obsidian-850/60 border border-slate-800 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">Yield Breakdown</span>
                  
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Unit Ingredient Cost</span>
                    <span className="font-semibold text-slate-200 font-mono">₹{selectedScenario.cost}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Recommended Price</span>
                    <span className="font-semibold text-brand-400 font-mono">₹{selectedScenario.recommendedPrice}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Waste Prevention</span>
                    <span className="font-semibold text-emerald-400">100% Stock Consumed</span>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Try Different Stock
                </Button>
                <Button variant="glow" size="md" onClick={() => setCurrentStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Publish & Simulate Customer Order
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SIMULATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">4. Customer Scans QR & Adds to Tray</h4>
                  <p className="text-xs text-slate-400">Contactless mobile checkout via instant UPI</p>
                </div>
                <Badge variant="brand" size="sm">Customer Store View</Badge>
              </div>

              <div className="max-w-md mx-auto rounded-3xl p-5 bg-obsidian-900 border-2 border-slate-700 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">☕</span>
                    <span className="text-xs font-bold text-white">Chai & Chaat Junction</span>
                  </div>
                  <Badge variant="emerald" size="sm" dot>Live Open</Badge>
                </div>

                <div className="rounded-xl p-3 bg-obsidian-850 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">{selectedScenario.dishName}</h5>
                    <p className="text-[11px] text-slate-400 font-mono">₹{selectedScenario.recommendedPrice} × 1 Plate</p>
                  </div>
                  <span className="text-xs font-bold text-brand-400 font-mono">₹{selectedScenario.recommendedPrice}</span>
                </div>

                <Button 
                  variant="glow" 
                  size="md" 
                  onClick={handleSimulateOrder}
                  className="w-full py-3 text-sm font-bold" 
                  rightIcon={<Zap className="w-4 h-4" />}
                >
                  Pay ₹{selectedScenario.recommendedPrice} & Get Token
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: TOKEN ISSUED */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">5. Digital Token #{tokenCode} Generated</h4>
                  <p className="text-xs text-slate-400">Diner tracks status on their phone without waiting in line</p>
                </div>
                <Badge variant="amber" size="sm">Order Received</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Token Callout */}
                <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-500/20 via-obsidian-900 to-obsidian-850 border border-brand-500/50 text-center space-y-3 animate-token-glow">
                  <span className="text-[11px] font-bold text-brand-400 tracking-widest uppercase font-mono block">
                    CUSTOMER TOKEN
                  </span>
                  <div className="text-5xl font-black font-mono tracking-tight text-white py-1">
                    #{tokenCode}
                  </div>
                  <div className="text-xs text-slate-300">
                    Estimated Wait: <strong className="text-amber-400">~{selectedScenario.prepTime} min</strong>
                  </div>
                </div>

                {/* Queue Status */}
                <div className="rounded-2xl p-5 bg-obsidian-850 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">KITCHEN STATUS</span>
                    <h5 className="text-sm font-bold text-white">Order Received & Ticket Queued</h5>
                    <p className="text-xs text-slate-400">Stall chef is preparing fresh batch on iron tawa.</p>
                  </div>

                  <Button
                    variant="glow"
                    size="sm"
                    className="w-full"
                    onClick={handleAdvanceToReady}
                    rightIcon={<BellRing className="w-4 h-4" />}
                  >
                    Simulate Chef: Mark Ready
                  </Button>
                </div>

              </div>
            </div>
          )}

          {/* STEP 6: READY AT COUNTER */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in zoom-in-95 text-center">
              <div className="rounded-3xl p-6 bg-gradient-to-b from-brand-500/25 via-obsidian-900 to-obsidian-900 border-2 border-brand-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-brand-500 text-obsidian-950 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/40">
                  <BellRing className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-400 tracking-widest uppercase font-mono">
                    READY FOR PICKUP
                  </span>
                  <h4 className="text-3xl font-black font-mono text-white">Token #{tokenCode}</h4>
                  <p className="text-xs text-slate-300">
                    Your {selectedScenario.dishName} is hot & ready at the counter!
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Replay Interactive Pipeline
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
