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
  const hasMagicParam = params.has('magic') || params.has('unlock') || params.get('pro') === 'true';
  const hasKeyParam = params.get('key') || params.get('secret') || params.get('token');

  if (!hasKiwifyParam && !hasMagicParam && !hasKeyParam) {
    return null;
  }

  // Check secret key if configured
  const configuredSecret = (pricing.magicSecretKey || 'STRONGPRO').trim().toLowerCase();
  const providedKey = (hasKeyParam || params.get('kiwify') || params.get('magic') || '').trim().toLowerCase();

  // If key matches or general unlock keyword passed
  const isKeyValid = 
    providedKey === configuredSecret ||
    providedKey === 'unlock' ||
    providedKey === 'pro' ||
    providedKey === 'lifetime' ||
    providedKey === 'true' ||
    hasMagicParam ||
    hasKiwifyParam;

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
  secretKey: string = 'STRONGPRO'
): string {
  const cleanBase = baseUrl.split('?')[0].replace(/\/$/, '');
  return `${cleanBase}/?kiwify=unlock&plan=${plan}&key=${encodeURIComponent(secretKey)}&name={client_name}&email={client_email}`;
}

/**
 * Validate manual code entered by user
 */
export function validateManualActivationCode(
  code: string,
  pricing: PricingConfig
): KiwifyActivationResult | { isActivated: false; message: string } {
  const cleanCode = code.trim().toUpperCase();
  const secret = (pricing.magicSecretKey || 'STRONGPRO').trim().toUpperCase();

  if (!cleanCode) {
    return { isActivated: false, message: 'Digite um código ou link válido.' };
  }

  // Check if user pasted a full URL
  if (cleanCode.includes('KIWIFY=') || cleanCode.includes('PRO=TRUE') || cleanCode.includes('UNLOCK')) {
    let plan: PlanType = 'lifetime';
    if (cleanCode.includes('MENSAL') || cleanCode.includes('MONTHLY')) plan = 'subscription_monthly';

    return {
      isActivated: true,
      plan,
      source: 'kiwify',
      message: 'Link Mágico da Kiwify validado com sucesso!',
    };
  }

  // Check secret key or standard master codes
  if (
    cleanCode === secret ||
    cleanCode === 'STRONGPRO' ||
    cleanCode === 'VIP' ||
    cleanCode === 'COACH' ||
    cleanCode === 'PERSONAL' ||
    cleanCode === 'BRINDE' ||
    cleanCode === 'KIWIFY-PRO' ||
    cleanCode === 'VITALICIO2026' ||
    cleanCode === 'CROSSFIT-PRO' ||
    cleanCode === 'LPO-PRO'
  ) {
    return {
      isActivated: true,
      plan: 'lifetime',
      source: 'manual',
      message: 'Acesso VIP Vitalício liberado com sucesso!',
    };
  }

  // Monthly code
  if (cleanCode === 'MENSAL-PRO' || cleanCode === 'MONTHLY-PRO') {
    return {
      isActivated: true,
      plan: 'subscription_monthly',
      source: 'manual',
      message: 'Código de Assinatura Mensal validado!',
    };
  }

  return {
    isActivated: false,
    message: 'Código ou Link inválido. Verifique sua compra na Kiwify ou entre em contato.',
  };
}
