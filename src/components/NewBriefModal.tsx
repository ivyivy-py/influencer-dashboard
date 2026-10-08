import React, { useState } from 'react';
import { X, PlusCircle, FolderKanban } from 'lucide-react';
import { CampaignBrief, NicheCategory, PlatformType } from '../types';

interface NewBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBrief: (brief: CampaignBrief) => void;
}

export const NewBriefModal: React.FC<NewBriefModalProps> = ({
  isOpen,
  onClose,
  onSaveBrief,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [niche, setNiche] = useState<NicheCategory>('Tech & AI');
  const [targetDemographic, setTargetDemographic] = useState('');
  const [objective, setObjective] = useState<CampaignBrief['objective']>('Product Launch');
  const [budgetTotal, setBudgetTotal] = useState(50000);
  const [platforms, setPlatforms] = useState<PlatformType[]>(['instagram', 'youtube']);
  const [deliverables, setDeliverables] = useState('1x Dedicated Video, 2x Reels');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    const newBrief: CampaignBrief = {
      id: `brief-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      niche,
      targetDemographic: targetDemographic.trim() || 'Core demographic',
      objective,
      budgetTotal: Number(budgetTotal) || 25000,
      targetPlatforms: platforms,
      deliverablesRequired: deliverables.split(',').map((d) => d.trim()).filter(Boolean),
      deadline,
      description: description.trim() || 'Comprehensive influencer campaign brief.',
    };

    onSaveBrief(newBrief);
    onClose();
  };

  const togglePlatform = (p: PlatformType) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((item) => item !== p));
      }
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#141822] shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <h3 className="font-heading font-semibold text-lg text-white">
              Create Campaign Brief
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Global Drop"
                required
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Brand / Product
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Lumina Audio"
                required
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Niche Industry
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as NicheCategory)}
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Tech & AI">Tech & AI</option>
                <option value="Gaming & Esports">Gaming & Esports</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Personal Finance">Personal Finance</option>
                <option value="Lifestyle & Vlog">Lifestyle & Vlog</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Fashion & Style">Fashion & Style</option>
                <option value="Food & Culinary">Food & Culinary</option>
                <option value="Travel & Adventure">Travel & Adventure</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Campaign Objective
              </label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Product Launch">Product Launch</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Conversion / Sales">Conversion / Sales</option>
                <option value="App Installs">App Installs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Total Budget Pool ($)
              </label>
              <input
                type="number"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs font-data text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Target Platforms
            </label>
            <div className="flex gap-2">
              {(['instagram', 'tiktok', 'youtube'] as PlatformType[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize border cursor-pointer ${
                    platforms.includes(p)
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#0f131c] text-slate-400 border-white/[0.08]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Deliverables (comma-separated)
            </label>
            <input
              type="text"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="1x Dedicated Review, 2x Reels"
              className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Target Demographic & Creative Brief
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe campaign goals, key messaging, and audience guidelines..."
              rows={3}
              className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Save Campaign Brief
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
