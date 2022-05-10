// @flow
import { add, div, mul, sub } from 'biggystring'

import {
  type FiatProviderApproveQuoteParams,
  type FiatProviderAssetMap,
  type FiatProviderFactory,
  type FiatProviderGetQuoteParams,
  type FiatProviderQuote
} from '../fiatProviderTypes'
const pluginId = 'simplex'

const allowedCurrencyCodes: FiatProviderAssetMap = {
  bitcoin: { BTC: true },
  ethereum: { ETH: true },
  bitcoincash: { BCH: true },
  ripple: { XRP: true }
}

export const simplexProvider: FiatProviderFactory = async () => {
  const out = {
    pluginId,
    getSupportedAssets: async (): Promise<FiatProviderAssetMap> => allowedCurrencyCodes,
    getQuote: async (params: FiatProviderGetQuoteParams): Promise<FiatProviderQuote> => {
      const { tokenId, fiatCurrencyCode, exchangeAmount, amountType, direction } = params

      const { currencyCode } = tokenId
      const currencyPluginId = tokenId.pluginId
      const exchangeRate = { bitcoin: '43123', ethereum: '2212' }
      const fee = '0.025'

      if (currencyCode == null) throw new Error('simplexProvider: Missing tokenId.currencyCode')

      let isEstimate = false
      let fiatAmount = '0'
      let cryptoAmount = '0'
      if (direction === 'buy') {
        isEstimate = true
        if (amountType === 'crypto') {
          cryptoAmount = exchangeAmount
          const feeMultiplier = add('1', fee)
          fiatAmount = mul(exchangeRate[currencyPluginId], exchangeAmount)
          fiatAmount = mul(fiatAmount, feeMultiplier)
        } else {
          fiatAmount = exchangeAmount
          const feeMultiplier = sub('1', fee)
          cryptoAmount = div(exchangeAmount, exchangeRate[currencyPluginId], 16)
          cryptoAmount = mul(cryptoAmount, feeMultiplier)
        }
      } else {
        throw new Error('simplexProvider: Sell unsupported')
      }

      const paymentQuote: FiatProviderQuote = {
        tokenId,
        isEstimate,
        fiatCurrencyCode,
        fiatAmount,
        cryptoAmount,
        direction,
        expirationDate: new Date(Date.now() + 60000),
        approveQuote: async (params: FiatProviderApproveQuoteParams): Promise<void> => {},
        closeQuote: async (): Promise<void> => {}
      }
      return paymentQuote
    }
  }
  return out
}
