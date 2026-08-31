import { PlanType, UserSubscription, PricingConfig } from '../types';

export interface KiwifyActivationResult {
  isActivated: boolean;
  plan: PlanType;
  buyerName?: string;
  buyerEmail?: string;
  source: 'kiwify' | 'mercadopago' | 'manual';
  message: string;
}

/**
 * Checks current window URL for Kiwify redirect or magic link parameters
 */
export function checkKiwifyUrlParams(pricing: PricingConfig): KiwifyActivationResult | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);

  // Indicators of magic unlock
  const hasKiwifyParam = params.has('kiwify') || params.has('kiwify_pro') || params.has('kiwify_token');
  const hasMagicParam = params.has('magic') || params.has('unlock');
  const hasKeyParam = params.get('key') || params.get('secret') || params.get('token');

  if (!hasKiwifyParam && !hasMagicParam && !hasKeyParam) {
    return null;
  }

  // Check secret key if configured
  const configuredSecret = (pricing.magicSecretKey || 'SPRO-LIFETIME-2026').trim().toLowerCase();
  const providedKey = (hasKeyParam || params.get('kiwify') || params.get('magic') || '').trim().toLowerCase();

  // Validate secret key or structured unlock
  const isKeyValid =
    providedKey === configuredSecret ||
    providedKey === 'unlock' ||
    params.get('kiwify') === 'unlock';

  if (!isKeyValid) {
    return null;
  }

  // Determine plan
  const planParam = (params.get('plan') || params.get('tipo') || '').toLowerCase();
  let plan: PlanType = 'lifetime';

  if (planParam.includes('month') || planParam.includes('mensal')) {
    plan = 'subscription_monthly';
  } else {
    plan = 'lifetime';
  }

  const buyerName = 
    params.get('name') || 
    params.get('client_name') || 
    params.get('buyer_name') || 
    params.get('cliente') || 
    undefined;

  const buyerEmail = 
    params.get('email') || 
    params.get('client_email') || 
    params.get('buyer_email') || 
    undefined;

  return {
    isActivated: true,
    plan,
    buyerName: buyerName ? decodeURIComponent(buyerName) : undefined,
    buyerEmail: buyerEmail ? decodeURIComponent(buyerEmail) : undefined,
    source: 'kiwify',
    message: 'Acesso PRO liberado com sucesso via Kiwify!',
  };
}

/**
 * Generate Kiwify Post-Purchase / Thank You Page URL for copying
 */
export function generateKiwifyDeliveryUrl(
  baseUrl: string,
  plan: PlanType,
  secretKey: string = 'SPRO-LIFETIME-2026'
): string {
  const cleanBase = baseUrl.split('?')[0].replace(/\/$/, '');
  return `${cleanBase}/?kiwify=unlock&plan=${plan}&key=${encodeURIComponent(secretKey)}&name={client_name}&email={client_email}`;
}

/**
 * Validate manual code or pasted magic link entered by user
 */
export function validateManualActivationCode(
  code: string,
  pricing: PricingConfig
): KiwifyActivationResult | { isActivated: false; message: string } {
  const cleanCode = code.trim();
  const configuredSecret = (pricing.magicSecretKey || 'SPRO-LIFETIME-2026').trim().toUpperCase();

  if (!cleanCode) {
    return { isActivated: false, message: 'Por favor, insira seu Link Mágico recebido na compra.' };
  }

  // Check if user pasted a full URL / Magic Link
  if (cleanCode.toLowerCase().includes('kiwify=unlock') || cleanCode.toLowerCase().includes('plan=')) {
    let plan: PlanType = 'lifetime';
    if (cleanCode.toLowerCase().includes('month') || cleanCode.toLowerCase().includes('mensal')) {
      plan = 'subscription_monthly';
    }

    return {
      isActivated: true,
      plan,
      source: 'kiwify',
      message: 'Link Mágico validado! Seu Acesso PRO está ativo.',
    };
  }

  // Check configured secret key or previous master key
  const upperCode = cleanCode.toUpperCase();
  if (upperCode === configuredSecret || upperCode === 'STRONGPRO' || upperCode === 'SPRO-LIFETIME-2026') {
    return {
      isActivated: true,
      plan: 'lifetime',
      source: 'manual',
      message: 'Acesso Vitalício liberado com sucesso!',
    };
  }

  if (upperCode === 'SPRO-MENSAL-2026' || upperCode === 'MENSAL-PRO') {
    return {
      isActivated: true,
      plan: 'subscription_monthly',
      source: 'manual',
      message: 'Assinatura Mensal validada com sucesso!',
    };
  }

  return {
    isActivated: false,
    message: 'Link ou código não reconhecido. Cole o Link Mágico enviado no pós-compra da Kiwify.',
  };
}
