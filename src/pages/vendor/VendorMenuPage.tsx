import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Camera, 
  Check, 
  Edit3, 
  Trash2, 
  Flame, 
  Clock, 
  Languages, 
  TrendingUp,
  Eye,
  SlidersHorizontal,
  X,
  Store,
  DollarSign,
  CheckCircle2,
  Phone,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, Input, Textarea, Modal, PageHeader, EmptyState } from '../../components/ui';
import { MenuItem, DietaryType } from '../../types';
import { MenuGeneratorModal } from '../../components/vendor/MenuGeneratorModal';
import confetti from 'canvas-confetti';

export const VendorMenuPage: React.FC = () => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleItemAvailability,
    activeVendor
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<'All' | 'in-stock' | 'sold-out'>('All');
  const [languagePreview, setLanguagePreview] = useState<'en' | 'mr' | 'hi'>('en');

  // Preview Mode Toggle (Live customer view directly on vendor page)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // AI Menu Generator Modal State
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Manual Add / Edit Item Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formNameMr, setFormNameMr] = useState('');
  const [formNameHi, setFormNameHi] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('80');
  const [formCostPrice, setFormCostPrice] = useState('25');
  const [formCategory, setFormCategory] = useState('Today\'s Special');
  const [formDietary, setFormDietary] = useState<DietaryType>('veg');
  const [formPrepTime, setFormPrepTime] = useState('5');
  const [formIsSpecial, setFormIsSpecial] = useState(true);
  const [formImage, setFormImage] = useState('');

  // Inline Quick Price Edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nativeNames?.mr && item.nativeNames.mr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nativeNames?.hi && item.nativeNames.hi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'All' || item.dietary === selectedDietary;
    const matchesAvailability = selectedAvailability === 'All' || 
      (selectedAvailability === 'in-stock' ? item.isAvailable : !item.isAvailable);

    return matchesSearch && matchesCategory && matchesDietary && matchesAvailability;
  });

  const handleOpenManualAdd = (itemToEdit?: MenuItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormName(itemToEdit.name);
      setFormNameMr(itemToEdit.nativeNames?.mr || '');
      setFormNameHi(itemToEdit.nativeNames?.hi || '');
      setFormDescription(itemToEdit.description);
      setFormPrice(itemToEdit.price.toString());
      setFormCostPrice(itemToEdit.costPrice ? itemToEdit.costPrice.toString() : Math.round(itemToEdit.price * 0.35).toString());
      setFormCategory(itemToEdit.category);
      setFormDietary(itemToEdit.dietary);
      setFormPrepTime(itemToEdit.prepTimeMin.toString());
      setFormIsSpecial(!!itemToEdit.isChefSpecial);
      setFormImage(itemToEdit.image || '');
    } else {
      setEditingItem(null);
      setFormName('');
      setFormNameMr('');
      setFormNameHi('');
      setFormDescription('');
      setFormPrice('60');
      setFormCostPrice('20');
      setFormCategory('Today\'s Special');
      setFormDietary('veg');
      setFormPrepTime('5');
      setFormIsSpecial(true);
      setFormImage('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80');
    }
    setIsManualModalOpen(true);
  };

  const handleSaveManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formName,
        nativeNames: {
          mr: formNameMr || formName,
          hi: formNameHi || formName
        },
        description: formDescription,
        price: parseFloat(formPrice) || 0,
        costPrice: parseFloat(formCostPrice) || Math.round(parseFloat(formPrice) * 0.35),
        category: formCategory,
        dietary: formDietary,
        prepTimeMin: parseInt(formPrepTime) || 5,
        isChefSpecial: formIsSpecial,
        image: formImage || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
      });
    } else {
      addMenuItem({
        name: formName,
        nativeNames: {
          mr: formNameMr || formName,
          hi: formNameHi || formName
        },
        description: formDescription,
        price: parseFloat(formPrice) || 0,
        costPrice: parseFloat(formCostPrice) || Math.round(parseFloat(formPrice) * 0.35),
        category: formCategory,
        isAvailable: true,
        dietary: formDietary,
        prepTimeMin: parseInt(formPrepTime) || 5,
        isChefSpecial: formIsSpecial,
        image: formImage || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
      });
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
    setIsManualModalOpen(false);
  };

  const handleStartInlinePriceEdit = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setInlinePriceValue(item.price.toString());
  };

  const handleSaveInlinePrice = (itemId: string) => {
    const newPrice = parseFloat(inlinePriceValue);
    if (!isNaN(newPrice) && newPrice > 0) {
      updateMenuItem(itemId, { price: newPrice });
    }
    setEditingPriceId(null);
  };

  const getItemDisplayName = (item: MenuItem) => {
    if (languagePreview === 'mr' && item.nativeNames?.mr) return item.nativeNames.mr;
    if (languagePreview === 'hi' && item.nativeNames?.hi) return item.nativeNames.hi;
    return item.name;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <PageHeader
        title="Menu Studio & Inventory"
        description="Formulate daily dynamic specials, adjust live stall prices, toggle availability, and synthesize dishes from ingredient photos."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsAiGeneratorOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Menu with AI
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenManualAdd()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Item
            </Button>
            <Button
              variant={isPreviewMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              {isPreviewMode ? 'Exit Preview' : 'Preview Customer Menu'}
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search dish name, Marathi title, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-850 border border-slate-700">
            <Languages className="w-3.5 h-3.5 text-brand-400 ml-1.5" />
            <button
              onClick={() => setLanguagePreview('en')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${languagePreview === 'en' ? 'bg-brand-500 text-obsidian-950' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguagePreview('mr')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${languagePreview === 'mr' ? 'bg-brand-500 text-obsidian-950' : 'text-slate-400 hover:text-white'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguagePreview('hi')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${languagePreview === 'hi' ? 'bg-brand-500 text-obsidian-950' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          {/* Dietary Filter */}
          <select
            value={selectedDietary}
            onChange={(e) => setSelectedDietary(e.target.value)}
            className="bg-obsidian-850 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Diets</option>
            <option value="veg">Pure Veg 🟢</option>
            <option value="non-veg">Non-Veg 🔴</option>
          </select>

          {/* Availability Filter */}
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value as any)}
            className="bg-obsidian-850 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="in-stock">In Stock (Active)</option>
            <option value="sold-out">Sold Out (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-brand-500 text-obsidian-950 shadow-md scale-105'
                : 'bg-obsidian-850 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PREVIEW MODE: Live Customer Storefront Preview */}
      {isPreviewMode && (
        <div className="rounded-3xl p-6 md:p-8 bg-obsidian-900 border-2 border-brand-500/50 shadow-2xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Live Customer Menu Preview</h3>
              <Badge variant="emerald" size="sm" dot>Storefront View ({languagePreview.toUpperCase()})</Badge>
            </div>
            <Button variant="ghost" size="xs" onClick={() => setIsPreviewMode(false)} leftIcon={<X className="w-3.5 h-3.5" />}>
              Close Preview
            </Button>
          </div>

          <div className="max-w-xl mx-auto rounded-3xl p-6 bg-obsidian-950 border border-slate-800 shadow-xl space-y-4">
            <div className="text-center pb-4 border-b border-slate-800">
              <h4 className="text-xl font-black font-display text-white">{activeVendor.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{activeVendor.tagline}</p>
            </div>

            <div className="space-y-3">
              {filteredItems.filter(i => i.isAvailable).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
                    <div>
                      <h5 className="text-sm font-bold text-white">{getItemDisplayName(item)}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-brand-400 font-mono ml-4">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No menu dishes match your filter"
          description="Try resetting search keywords or category filters, or use the AI Menu Generator."
          action={
            <Button
              variant="glow"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDietary('All');
                setSelectedAvailability('All');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant="glass"
              className={`p-5 flex flex-col justify-between transition-all duration-300 relative group hover:border-slate-600/70 hover:-translate-y-1 ${
                !item.isAvailable ? 'opacity-65 grayscale-[30%]' : ''
              }`}
            >
              <div>
                {/* Top Image + Badges */}
                <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-slate-800">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                  
                  {/* Dietary badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      item.dietary === 'veg' ? 'bg-emerald-500/85 text-white' : 'bg-red-500/85 text-white'
                    }`}>
                      {item.dietary === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                    {item.isChefSpecial && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-obsidian-950 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Special
                      </span>
                    )}
                  </div>

                  {/* Availability Toggle Button */}
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md transition-all shadow-md ${
                      item.isAvailable
                        ? 'bg-emerald-500 text-obsidian-950 hover:bg-emerald-400'
                        : 'bg-red-500/90 text-white hover:bg-red-500'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300">
                    <span className="bg-obsidian-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono">
                      ⏱ {item.prepTimeMin} mins prep
                    </span>
                    {item.costPrice && (
                      <span className="bg-obsidian-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-emerald-400 font-semibold font-mono">
                        Cost: ₹{item.costPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dish Details */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold text-white leading-snug">
                      {getItemDisplayName(item)}
                    </h4>

                    {/* Quick Inline Price Edit */}
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-brand-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          autoFocus
                          value={inlinePriceValue}
                          onChange={(e) => setInlinePriceValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveInlinePrice(item.id)}
                          className="w-16 bg-obsidian-850 border border-brand-500 text-white rounded px-1.5 py-0.5 text-sm font-bold font-mono"
                        />
                        <button
                          onClick={() => handleSaveInlinePrice(item.id)}
                          className="p-1 text-emerald-400 hover:text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartInlinePriceEdit(item)}
                        className="text-lg font-extrabold text-brand-400 shrink-0 font-mono hover:underline flex items-center gap-1 group/price"
                        title="Click to quickly edit price"
                      >
                        ₹{item.price}
                        <Edit3 className="w-3 h-3 opacity-0 group-hover/price:opacity-100 transition-opacity text-slate-400" />
                      </button>
                    )}
                  </div>

                  {languagePreview !== 'en' && (
                    <p className="text-[11px] text-slate-400 font-sans">{item.name}</p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenManualAdd(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                    title="Edit Item Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI Menu Generator Modal (3-Step Workflow) */}
      <MenuGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
      />

      {/* Manual Add / Edit Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title={editingItem ? "Edit Menu Dish" : "Add New Menu Dish"}
        description="Configure pricing, description, category, and regional translations."
        size="md"
      >
        <form onSubmit={handleSaveManualItem} className="space-y-4">
          <Input
            label="Dish Name (English)"
            placeholder="e.g. Masala Pav"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Marathi Name (मराठी)"
              placeholder="e.g. मसाला पाव"
              value={formNameMr}
              onChange={(e) => setFormNameMr(e.target.value)}
            />
            <Input
              label="Hindi Name (हिन्दी)"
              placeholder="e.g. मसाला पाव"
              value={formNameHi}
              onChange={(e) => setFormNameHi(e.target.value)}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Tawa toasted soft ladi pav doused in spiced butter..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Selling Price (₹)"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              required
            />
            <Input
              label="Cost of Goods (₹)"
              type="number"
              value={formCostPrice}
              onChange={(e) => setFormCostPrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-obsidian-850 text-slate-100 rounded-xl px-3 py-2.5 text-xs border border-slate-700"
              >
                <option value="Today's Special">Today's Special</option>
                <option value="Quick Bites">Quick Bites</option>
                <option value="Chaat & Crunch">Chaat & Crunch</option>
                <option value="Hot Beverages">Hot Beverages</option>
                <option value="Snacks & Samosas">Snacks & Samosas</option>
                <option value="Signature Rolls">Signature Rolls</option>
                <option value="Desserts & Shakes">Desserts & Shakes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Dietary
              </label>
              <select
                value={formDietary}
                onChange={(e) => setFormDietary(e.target.value as DietaryType)}
                className="w-full bg-obsidian-850 text-slate-100 rounded-xl px-3 py-2.5 text-xs border border-slate-700"
              >
                <option value="veg">Pure Veg 🟢</option>
                <option value="non-veg">Non-Veg 🔴</option>
                <option value="egg">Egg 🟡</option>
              </select>
            </div>
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formImage}
            onChange={(e) => setFormImage(e.target.value)}
          />

          <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formIsSpecial}
              onChange={(e) => setFormIsSpecial(e.target.checked)}
              className="rounded bg-obsidian-850 border-slate-700 text-brand-500 focus:ring-brand-500"
            />
            <span>Mark as Chef's Daily Special (Highlights on Storefront)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsManualModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="glow" size="md" type="submit">
              {editingItem ? "Save Changes" : "Publish to Menu"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
