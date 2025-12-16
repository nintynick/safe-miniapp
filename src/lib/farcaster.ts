'use client';

import sdk from '@farcaster/miniapp-sdk';

export async function initializeFarcasterSDK() {
  try {
    // Signal to Farcaster that the app is ready
    await sdk.actions.ready();
    return true;
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
    return false;
  }
}

export async function getFarcasterContext() {
  try {
    const context = await sdk.context;
    return context;
  } catch (error) {
    console.error('Failed to get Farcaster context:', error);
    return null;
  }
}

export function getEthereumProvider() {
  return sdk.wallet.getEthereumProvider();
}
