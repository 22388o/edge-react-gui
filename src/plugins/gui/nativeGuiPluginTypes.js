// @flow
import { type EdgeAccount } from 'edge-core-js'

import { type NavigationProp } from '../../types/routerTypes.js'
import { type EdgeTokenId, type EdgeTokenIdExtended } from '../../types/types.js'

export type NativeGuiPlugin = {
  startPlugin: () => Promise<void>
}

export type MakePluginParams = {
  navigation: NavigationProp<'pluginBuy'> | NavigationProp<'pluginSell'>,
  account: EdgeAccount,
  showModal: {
    walletPicker: (params: { headerTitle: string, allowedCurrencyCodes?: EdgeTokenIdExtended[], showCreateWallet?: boolean }) => Promise<{
      walletId: string,
      currencyCode: string
    }>,
    errorDropdown: (error: Error) => void
  }
}

export type NativeGuiPluginFactory = {
  pluginId: string,
  makePlugin: (params: MakePluginParams) => Promise<NativeGuiPlugin>
}

export const navTargets = {
  enterAmount: 'guiPluginEnterAmount'
}

export type PaymentGetQuoteParams = {
  tokenId: EdgeTokenId,
  fiatCurrencyCode: string,
  exchangeAmount: string,
  amountType: 'fiat' | 'crypto',
  direction: 'buy' | 'sell'
}
export type PaymentQuote = {
  +pluginId: string,
  +isEstimate: boolean,
  +fiatCurrencyCode: string,
  +tokenId: EdgeTokenId,
  +fiatAmount: string,
  +exchangeAmount: string,
  +direction: 'buy' | 'sell',

  +expirationDate?: Date,

  approveQuote(): Promise<void>,
  closeQuote(): Promise<void>
}

export type PaymentAssetMap = {
  [pluginId: string]: {
    [tokenId: string]: boolean
  }
}

export type PaymentPlugin = {
  pluginId: string,
  getSupportedAssets: () => Promise<PaymentAssetMap>,
  getQuote: (params: PaymentGetQuoteParams) => Promise<PaymentQuote>
}

export type PaymentPluginFactory = {
  pluginTypes: { [type: string]: boolean },
  pluginId: string,
  makePlugin: (params: MakePluginParams) => Promise<PaymentPlugin>
}
