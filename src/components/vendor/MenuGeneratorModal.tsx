import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  Languages, 
  Check, 
  Trash2, 
  Edit3, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  Flame, 
  DollarSign, 
  Layers, 
  Clock, 
  Cpu, 
  FileText, 
  Store,
  Info,
  X
} from 'lucide-react';
import { Modal, Button, Badge, Input, Textarea } from '../ui';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { 
  generateAiMenu, 
  InputSourceType, 
  MenuLanguage, 
  getActiveAiProvider, 
  isLiveAiConfigured 
} from '../../services/aiService';
import { MenuItem, DietaryType } from '../../types';
import confetti from 'canvas-confetti';

interface MenuGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditableDish {
  id: string;
  name: string;
  nativeNames: {
    mr: string;
    hi: string;
  };
  description: string;
  price: number;
  costPrice: number;
  category: string;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  prepTimeMin: number;
  dietary: DietaryType;
  image: string;
}

const SAMPLE_UPLOADS = [
  {
    type: 'ingredients' as InputSourceType,
    title: 'Fresh Paneer & Pav Stock',
    desc: 'Morning dairy crates, butter, ladi pav and spices',
    previewUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    tag: 'Raw Ingredients'
  },
  {
    type: 'handwritten' as InputSourceType,
    title: 'Chalkboard "Aajche Khas"',
    desc: 'Handwritten daily specials written on kitchen blackboard',
    previewUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tag: 'Handwritten Chalkboard'
  },
  {
    type: 'stocklist' as InputSourceType,
    title: 'Morning Samosa & Curd Sheet',
    desc: 'Inventory notepad list of evening chaat batches',
    previewUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    tag: 'Stock Inventory List'
  }
];

export const MenuGeneratorModal: React.FC<MenuGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { addMenuItem, activeVendor } = useApp();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [sourceType, setSourceType] = useState<InputSourceType>('ingredients');
  const [selectedLanguage, setSelectedLanguage] = useState<MenuLanguage>('mr');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>(SAMPLE_UPLOADS[0].previewUrl);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Step 2 Animation state
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [aiProviderBadge, setAiProviderBadge] = useState<string>(getActiveAiProvider());

  // Step 3 Result State
  const [generatedDishes, setGeneratedDishes] = useState<EditableDish[]>([]);
  const [identifiedItems, setIdentifiedItems] = useState<string[]>([]);
  const [menuTitle, setMenuTitle] = useState("Today's Special");

  // Edit / Add Item Dialog within Generator
  const [editingDish, setEditingDish] = useState<EditableDish | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewCustomerOpen, setIsPreviewCustomerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setUploadedImagePreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Launch AI Processing Workflow
  const handleStartAiProcessing = async () => {
    setCurrentStep(2);
    setProcessingStage(0);

    const stages = [
      'Scanning photo & optical character analysis...',
      'Identifying raw ingredients & inventory weights...',
      'Synthesizing high-margin chef recipes...',
      'Translating into Marathi, Hindi & English...',
      'Optimizing selling prices for zero leftover waste...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const result = await generateAiMenu({
        sourceType,
        customPrompt,
        targetLanguage: selectedLanguage,
        imagePreviewUrl: uploadedImagePreview
      });

      setGeneratedDishes(result.dishes);
      setIdentifiedItems(result.identifiedItems);
      setMenuTitle(result.menuTitle);
      setAiProviderBadge(result.providerName);
      setCurrentStep(3);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Processing failed',
        message: 'Could not formulate dishes. Retrying with fallback.'
      });
      setCurrentStep(1);
    }
  };

  // Step 3 Operations
  const handleToggleDishAvailability = (dishId: string) => {
    setGeneratedDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const handleDeleteDish = (dishId: string) => {
    setGeneratedDishes((prev) => prev.filter((d) => d.id !== dishId));
    showToast({
      type: 'info',
      title: 'Dish Removed',
      message: 'Item removed from generated batch'
    });
  };

  const handleOpenEditDish = (dish: EditableDish) => {
    setEditingDish({ ...dish });
    setIsEditModalOpen(true);
  };

  const handleSaveEditedDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    setGeneratedDishes((prev) =>
      prev.map((d) => (d.id === editingDish.id ? editingDish : d))
    );
    setIsEditModalOpen(false);
    setEditingDish(null);
  };

  const handleAddNewDish = () => {
    const newDish: EditableDish = {
      id: `ai-custom-${Date.now()}`,
      name: 'Special Tawa Pav Bhaji',
      nativeNames: {
        mr: 'स्पेशल तवा पाव भाजी',
        hi: 'स्पेशल तवा पाव भाजी'
      },
      description: 'Mashed spiced seasonal vegetables topped with dollop of white butter & toasted pavs.',
      price: 90,
      costPrice: 30,
      category: "Today's Special",
      isAvailable: true,
      isChefSpecial: true,
      prepTimeMin: 5,
      dietary: 'veg',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
    };
    setGeneratedDishes((prev) => [newDish, ...prev]);
    showToast({
      type: 'success',
      title: 'Dish Added',
      message: 'New custom dish added to batch'
    });
  };

  // Publish all generated dishes to live stall menu
  const handleSaveToVendorMenu = () => {
    if (generatedDishes.length === 0) return;

    generatedDishes.forEach((dish) => {
      addMenuItem({
        name: dish.name,
        nativeNames: dish.nativeNames,
        description: dish.description,
        price: dish.price,
        costPrice: dish.costPrice,
        category: dish.category,
        isAvailable: dish.isAvailable,
        isChefSpecial: dish.isChefSpecial,
        prepTimeMin: dish.prepTimeMin,
        dietary: dish.dietary,
        image: dish.image
      });
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast({
      type: 'success',
      title: 'Menu Published!',
      message: `Successfully added ${generatedDishes.length} dishes to your live storefront.`
    });

    onClose();
  };

  const getDisplayName = (dish: EditableDish) => {
    if (selectedLanguage === 'mr' && dish.nativeNames.mr) return dish.nativeNames.mr;
    if (selectedLanguage === 'hi' && dish.nativeNames.hi) return dish.nativeNames.hi;
    return dish.name;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Top Header & Step Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold font-display text-white tracking-tight">
                AI Smart Menu Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Snap ingredients, handwritten chalkboards, or stock notes to formulate your daily specials.
            </p>
          </div>

          {/* AI Provider Transparency Badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-semibold border ${
              isLiveAiConfigured 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-obsidian-850 text-slate-400 border-slate-700'
            }`}>
              {aiProviderBadge}
            </span>
          </div>
        </div>

        {/* STEP 1: Upload / Source Selection */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Choose Source Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Input Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSourceType('ingredients')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    sourceType === 'ingredients'
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-md'
                      : 'bg-obsidian-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🥦</span>
                    {sourceType === 'ingredients' && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Raw Ingredients Photo</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Vegetable crates, dairy & pantry</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType('handwritten')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    sourceType === 'handwritten'
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-md'
                      : 'bg-obsidian-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">📝</span>
                    {sourceType === 'handwritten' && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Handwritten Menu / Board</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Chalkboard or paper notebook</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType('stocklist')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    sourceType === 'stocklist'
                      ? 'bg-brand-500/15 border-brand-500/50 shadow-md'
                      : 'bg-obsidian-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">📦</span>
                    {sourceType === 'stocklist' && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Stock List / Inventory</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Batch quantities & prep notes</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone + Mobile Camera */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragOver ? 'border-brand-400 bg-brand-500/10' : 'border-slate-700/80 bg-obsidian-850/60 hover:border-slate-600'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-obsidian-900 border border-slate-700 flex items-center justify-center text-brand-400 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Drag & drop your photo here</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, HEIC, or mobile live capture</p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    variant="glow"
                    size="sm"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Camera className="w-4 h-4" />}
                  >
                    Take Photo / Browse
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Photo Presets for Quick Testing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Or Select a Sample Stock Photo</span>
                <span>Click to use instant preset</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_UPLOADS.map((sample) => (
                  <div
                    key={sample.type}
                    onClick={() => {
                      setSourceType(sample.type);
                      setUploadedImagePreview(sample.previewUrl);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      uploadedImagePreview === sample.previewUrl
                        ? 'bg-brand-500/10 border-brand-500/60 shadow-md'
                        : 'bg-obsidian-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={sample.previewUrl} alt={sample.title} className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{sample.title}</h5>
                      <span className="text-[10px] text-brand-400 block">{sample.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language & Extra Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-brand-400" /> Default Menu Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as MenuLanguage)}
                  className="w-full bg-obsidian-850 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="en">English (English)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Optional Chef Prompt / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Keep items spicy, promote pav bhaji as special..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-obsidian-850 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="glow"
                size="md"
                onClick={handleStartAiProcessing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Scan & Generate Menu
              </Button>
            </div>

          </div>
        )}

        {/* STEP 2: AI Processing Animation */}
        {currentStep === 2 && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
            
            {/* Holographic Laser Photo Scan Container */}
            <div className="relative w-64 h-40 rounded-2xl overflow-hidden border-2 border-brand-500/80 shadow-[0_0_50px_rgba(16,185,129,0.35)]">
              <img 
                src={uploadedImagePreview} 
                alt="Scanning stock" 
                className="w-full h-full object-cover opacity-85" 
              />
              
              {/* Laser Scan Line */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-300 to-transparent shadow-[0_0_20px_#10b981] animate-laser" />
              
              {/* Corner reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-400" />

              <div className="absolute inset-0 bg-brand-500/5 pointer-events-none animate-optical-grid" />
            </div>

            {/* Stages checklist */}
            <div className="space-y-3 w-full max-w-md text-left bg-obsidian-850 p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>DailyMenu Neural Engine Pipeline</span>
                <span className="text-[10px] text-slate-400">Step {processingStage + 1} of 5</span>
              </div>

              {[
                '1. Scanning image & optical character recognition',
                '2. Identifying ingredients & stock weights',
                '3. Formulating daily high-profit recipes',
                '4. Translating into Marathi, Hindi & English',
                '5. Preparing editable menu & pricing yield'
              ].map((label, idx) => {
                const isPassed = processingStage > idx;
                const isCurrent = processingStage === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between text-xs transition-colors ${
                      isPassed
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-white font-bold animate-pulse'
                        : 'text-slate-600'
                    }`}
                  >
                    <span>{label}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Generating zero-waste menu dishes tailored for {activeVendor.name}...
            </p>
          </div>
        )}

        {/* STEP 3: Editable Generated Menu */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Bar of Step 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-obsidian-850 border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white font-display">{menuTitle}</h3>
                  <Badge variant="emerald" size="sm" dot>AI Formulated ({generatedDishes.length} Items)</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Language View:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedLanguage('mr')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedLanguage === 'mr' ? 'bg-brand-500 text-obsidian-950' : 'bg-obsidian-900 text-slate-300'}`}
                    >
                      मराठी
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('hi')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedLanguage === 'hi' ? 'bg-brand-500 text-obsidian-950' : 'bg-obsidian-900 text-slate-300'}`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('en')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${selectedLanguage === 'en' ? 'bg-brand-500 text-obsidian-950' : 'bg-obsidian-900 text-slate-300'}`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddNewDish}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewCustomerOpen(!isPreviewCustomerOpen)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  {isPreviewCustomerOpen ? 'Exit Preview' : 'Customer Preview'}
                </Button>
              </div>
            </div>

            {/* Identified Stock Chips */}
            {identifiedItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Detected Stock:</span>
                {identifiedItems.map((item, i) => (
                  <span key={i} className="bg-obsidian-850 px-2.5 py-0.5 rounded-lg border border-slate-700/60 text-slate-300 text-[11px]">
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Visual Clean Menu Preview Mode (Like the requested ASCII specification) */}
            {isPreviewCustomerOpen ? (
              <div className="rounded-2xl p-6 bg-obsidian-950 border-2 border-brand-500/40 shadow-2xl space-y-4 max-w-lg mx-auto font-mono">
                <div className="text-center border-b border-dashed border-slate-700 pb-3">
                  <h4 className="text-lg font-black text-white">{menuTitle}</h4>
                  <div className="text-slate-600 font-mono tracking-widest text-xs">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  <p className="text-[11px] text-brand-400 font-sans mt-1">Live Customer Storefront Menu View</p>
                </div>

                <div className="space-y-3">
                  {generatedDishes.map((dish) => (
                    <div key={dish.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <div>
                        <div className="font-bold text-white font-sans">{getDisplayName(dish)}</div>
                        <div className="text-[11px] text-slate-500 font-sans">{dish.description}</div>
                      </div>
                      <span className="font-black text-brand-400 font-mono text-sm shrink-0 ml-4">₹{dish.price}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2 text-[10px] text-slate-500 font-sans">
                  Ready for instant customer QR scanning & UPI payments
                </div>
              </div>
            ) : (
              /* Editable Dishes Table/Cards */
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {generatedDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={`rounded-xl p-4 bg-obsidian-850 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !dish.isAvailable ? 'opacity-60 border-slate-800' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${dish.dietary === 'veg' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {getDisplayName(dish)}
                          </h4>
                          {dish.isChefSpecial && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              Special
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{dish.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="text-brand-400 font-bold font-mono">Selling: ₹{dish.price}</span>
                          <span>•</span>
                          <span className="text-slate-500 font-mono">Cost: ₹{dish.costPrice}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{Math.round(((dish.price - dish.costPrice) / dish.price) * 100)}% Margin</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* Availability button */}
                      <button
                        type="button"
                        onClick={() => handleToggleDishAvailability(dish.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditDish(dish)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800"
                        title="Edit Dish"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3 Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Scan Different Photo
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onClose}
                >
                  Discard
                </Button>
                <Button
                  variant="glow"
                  size="md"
                  onClick={handleSaveToVendorMenu}
                  rightIcon={<Check className="w-4 h-4 stroke-[3]" />}
                >
                  Save & Publish Menu
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Edit Single Generated Dish Dialog */}
      {editingDish && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Dish Details"
          size="sm"
        >
          <form onSubmit={handleSaveEditedDish} className="space-y-4">
            <Input
              label="Dish Name (English)"
              value={editingDish.name}
              onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Marathi Name"
                value={editingDish.nativeNames.mr}
                onChange={(e) => setEditingDish({
                  ...editingDish,
                  nativeNames: { ...editingDish.nativeNames, mr: e.target.value }
                })}
              />
              <Input
                label="Hindi Name"
                value={editingDish.nativeNames.hi}
                onChange={(e) => setEditingDish({
                  ...editingDish,
                  nativeNames: { ...editingDish.nativeNames, hi: e.target.value }
                })}
              />
            </div>

            <Textarea
              label="Description"
              value={editingDish.description}
              onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Selling Price (₹)"
                type="number"
                value={editingDish.price}
                onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                required
              />
              <Input
                label="Cost of Prep (₹)"
                type="number"
                value={editingDish.costPrice}
                onChange={(e) => setEditingDish({ ...editingDish, costPrice: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="glow" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </Modal>
  );
};
