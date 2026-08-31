import React, { useState } from 'react';
import { Save, Link, DollarSign, RotateCcw, Copy, Check, Sparkles, Key, ExternalLink, HelpCircle } from 'lucide-react';
import { PricingConfig } from '../types';
import { DEFAULT_PRICING } from '../utils/storage';
import { generateKiwifyDeliveryUrl } from '../utils/kiwify';

interface CheckoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingConfig;
  onSavePricing: (config: PricingConfig) => void;
}

export const CheckoutSettingsModal: React.FC<CheckoutSettingsModalProps> = ({
  isOpen,
  onClose,
  pricing,
  onSavePricing,
}) => {
  const [activeTab, setActiveTab] = useState<'prices' | 'kiwify_magic'>('prices');
  const [formData, setFormData] = useState<PricingConfig>({ ...pricing });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://seu-app.com';
  const secretKey = formData.magicSecretKey || 'STRONGPRO';

  const lifetimeDeliveryUrl = generateKiwifyDeliveryUrl(currentOrigin, 'lifetime', secretKey);
  const monthlyDeliveryUrl = generateKiwifyDeliveryUrl(currentOrigin, 'subscription_monthly', secretKey);

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePricing(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    setFormData({ ...DEFAULT_PRICING });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Link className="w-5 h-5 text-amber-400" />
              <span>Configurações de Venda & Integração Kiwify</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Configure preços, links de checkout e os <strong>Links Mágicos de Liberação Automática</strong> da Kiwify.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'prices'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>1. Preços & Checkouts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kiwify_magic')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'kiwify_magic'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2. Links Mágicos Kiwify (Liberação)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {activeTab === 'prices' && (
            <div className="space-y-4">
              {/* Preço e Link Vitalício */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    ⭐ 1. Plano Vitalício (Pagamento Único)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Valor: R$</span>
                    <input
                      type="number"
                      step="0.10"
                      value={formData.lifetimePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, lifetimePrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-zinc-100 text-right font-mono font-bold text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Link de Checkout Kiwify Vitalício:
                  </label>
                  <input
                    type="url"
                    value={formData.lifetimeCheckoutUrl}
                    onChange={(e) => setFormData({ ...formData, lifetimeCheckoutUrl: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/n3n2sqb"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Preço e Link Recorrência Mensal */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    🔄 2. Plano Assinatura Mensal
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Valor: R$</span>
                    <input
                      type="number"
                      step="0.10"
                      value={formData.monthlyPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-zinc-100 text-right font-mono font-bold text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Link de Checkout Kiwify Mensal:
                  </label>
                  <input
                    type="url"
                    value={formData.monthlyCheckoutUrl}
                    onChange={(e) => setFormData({ ...formData, monthlyCheckoutUrl: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/DL4VOlu"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kiwify_magic' && (
            <div className="space-y-4">
              {/* Secret key customization */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-zinc-200 uppercase">Chave de Ativação Secreta:</span>
                  </div>
                  <input
                    type="text"
                    value={formData.magicSecretKey || 'STRONGPRO'}
                    onChange={(e) =>
                      setFormData({ ...formData, magicSecretKey: e.target.value.toUpperCase() })
                    }
                    className="bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs text-amber-400 font-mono font-black uppercase text-right"
                    placeholder="STRONGPRO"
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Esta chave é embutida no link mágico para garantir que apenas quem comprar na sua Kiwify libere o app.
                </p>
              </div>

              {/* Instructions banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-300 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Como configurar na Kiwify em 30 segundos:</span>
                </div>
                <ol className="list-decimal list-inside text-zinc-300 text-[11px] space-y-1 pl-1">
                  <li>Entre no painel da <strong>Kiwify</strong> &gt; clique no seu <strong>Produto</strong>.</li>
                  <li>Vá em <strong>Configurações do Produto</strong> &gt; <strong>Entrega do Conteúdo / Página de Obrigado</strong>.</li>
                  <li>Cole o <strong>Link Mágico</strong> correspondente abaixo no campo <em>"URL da Página de Obrigado / Entrega"</em>.</li>
                </ol>
              </div>

              {/* Delivery Link: Lifetime */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    ⭐ Link Mágico para Produto VITALÍCIO (R$ 149,90):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lifetimeDeliveryUrl, 'lifetime')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-[11px] font-black uppercase flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lifetime' ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-zinc-300 break-all select-all border border-zinc-800">
                  {lifetimeDeliveryUrl}
                </div>
              </div>

              {/* Delivery Link: Monthly */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase">
                    🔄 Link Mágico para MENSALIDADE (R$ 19,90/mês):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(monthlyDeliveryUrl, 'monthly')}
                    className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded text-[11px] font-black uppercase flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'monthly' ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-zinc-300 break-all select-all border border-zinc-800">
                  {monthlyDeliveryUrl}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
