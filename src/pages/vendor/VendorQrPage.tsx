import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Printer, 
  Share2, 
  Store, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, PageHeader, Input } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

export const VendorQrPage: React.FC = () => {
  const { activeVendor, vendors, setActiveVendorId } = useApp();
  const { showToast } = useToast();

  const [tableNumber, setTableNumber] = useState('All Tables');
  const [copied, setCopied] = useState(false);

  // Target Customer URL for the active vendor
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dailymenu.ai';
  const customerStorefrontUrl = `${originUrl}/customer/${activeVendor.id}`;

  // Direct high-resolution QR image URL via standard QR API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(customerStorefrontUrl)}&color=060709&bgcolor=ffffff&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerStorefrontUrl);
    setCopied(true);
    showToast({
      type: 'success',
      title: 'Storefront Link Copied!',
      message: 'Direct customer ordering link copied to your clipboard.'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeImageUrl;
    link.download = `${activeVendor.slug}-DailyMenu-QR.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'QR Standee Downloaded',
      message: `Printable QR for ${activeVendor.name} is ready.`
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <PageHeader
        title="Vendor QR Generator & Table Standees"
        description="Generate high-resolution printable QR codes for your food stall counters and dining tables. Customers scan to order directly via mobile."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleDownloadQr}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Standee Image
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Col: Branded Table Standee Poster Preview */}
        <div className="flex flex-col items-center">
          
          <div className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-6 shadow-2xl border-4 border-slate-800 space-y-5 text-center relative overflow-hidden">
            
            {/* Top Standee Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Contactless Smart Menu
              </div>
              <h3 className="text-xl font-black font-display tracking-tight text-slate-950 pt-1">
                {activeVendor.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium line-clamp-1">
                {activeVendor.tagline}
              </p>
            </div>

            {/* QR Code Container with High-Contrast Border */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-2">
              <div className="w-56 h-56 rounded-xl bg-white p-2 shadow-md border border-slate-300 flex items-center justify-center">
                <img 
                  src={qrCodeImageUrl} 
                  alt={`QR Code for ${activeVendor.name}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase font-mono">
                SCAN WITH PHONE CAMERA
              </span>
            </div>

            {/* Bottom Standee Callouts */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-slate-700 uppercase">
                <div className="p-1.5 rounded-lg bg-slate-100">1. Scan QR</div>
                <div className="p-1.5 rounded-lg bg-slate-100">2. Pay UPI</div>
                <div className="p-1.5 rounded-lg bg-slate-100">3. Get Token</div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                No app download required • Zero wait lines
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Print this card in A5 / acrylic standee format and place on dining tables & serving counters.
          </p>
        </div>

        {/* Right Col: Standee Settings & Customer Experience Preview */}
        <div className="space-y-6">
          
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-white">Storefront Link Details</h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Customer Destination URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={customerStorefrontUrl}
                    className="flex-1 bg-obsidian-850 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono select-all"
                  />
                  <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Table / Counter Assignment Note
                </label>
                <Input
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 1, Table 2, Counter Takeaway"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <Link 
                to={`/customer/${activeVendor.id}`}
                className="flex-1 min-w-[200px]"
              >
                <Button variant="glow" size="md" className="w-full" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Open Live Customer Menu
                </Button>
              </Link>

              <Button variant="outline" size="md" onClick={handleDownloadQr} leftIcon={<Download className="w-4 h-4" />}>
                Save QR Image
              </Button>
            </div>
          </Card>

          {/* Value Prop Benefits */}
          <div className="rounded-2xl p-5 bg-obsidian-850 border border-slate-800 space-y-3 text-xs">
            <div className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              Why QR Ordering Powers Fast Stalls
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant UPI Settlement</strong>: Payouts land directly in your registered UPI ID ({activeVendor.upiId}).</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Ordering Crowds</strong>: Diners order from their phone and only step up to the counter when their token rings.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Real-time Menu Sync</strong>: Changing an item or price in Menu Studio instantly reflects on customer phones without reprinting.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
