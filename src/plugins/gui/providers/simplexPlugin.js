// @flow
// import { div, mul } from 'biggystring'

// import { type EdgeTokenIdExtended } from '../../../types/types'
import {
  type MakePluginParams,
  type PaymentAssetMap,
  type PaymentGetQuoteParams,
  type PaymentPlugin,
  type PaymentPluginFactory,
  type PaymentQuote
} from '../nativeGuiPluginTypes'

const pluginId = 'simplex'

const allowedCurrencyCodes: PaymentAssetMap = {
  bitcoin: { BTC: true },
  ethereum: { ETH: true },
  bitcoincash: { BCH: true },
  ripple: { XRP: true }
}

export const simplexPlugin: PaymentPluginFactory = {
  pluginId,
  pluginTypes: { creditcard: true },
  makePlugin: async (params: MakePluginParams) => {
    const paymentPlugin: PaymentPlugin = {
      pluginId,
      getSupportedAssets: async (): Promise<PaymentAssetMap> => allowedCurrencyCodes,
      getQuote: async (params: PaymentGetQuoteParams): Promise<PaymentQuote> => {
        const paymentQuote: PaymentQuote = {
          pluginId,
          isEstimate: false,
          fiatCurrencyCode: 'iso:USD',
          tokenId: { pluginId: 'bitcoin', currencyCode: 'BTC' },
          fiatAmount: '4',
          exchangeAmount: '3',
          direction: 'buy',

          expirationDate: new Date(),
          approveQuote: async () => {},
          closeQuote: async () => {}
        }
        return paymentQuote
      }
    }
    return paymentPlugin
  }
}
