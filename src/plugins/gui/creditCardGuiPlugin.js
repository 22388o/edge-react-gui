// @flow
import { div, mul } from 'biggystring'

import { type EdgeTokenIdExtended } from '../../types/types'
import { type MakePluginParams, type NativeGuiPlugin, type NativeGuiPluginFactory, type PaymentAssetMap, navTargets } from './nativeGuiPluginTypes'
import { simplexPlugin } from './providers/simplexPlugin'

const pluginFactories = [simplexPlugin]

export const creditCardPlugin: NativeGuiPluginFactory = {
  pluginId: 'creditcard',
  makePlugin: async (params: MakePluginParams) => {
    let fiatAmount = '0'
    let cryptoAmount = '0'
    const { navigation, showModal, account } = params
    const exchangeRate = '40000'

    const convertValue = async (sourceFieldNum: number, value: string): Promise<string> => {
      if (sourceFieldNum === 1) {
        return div(value, exchangeRate, 8)
      } else {
        return mul(value, exchangeRate)
      }
    }
    const onChangeText = (fieldNum: number, value: string): void => {
      if (fieldNum === 1) fiatAmount = value
      else cryptoAmount = value
    }
    const assetPromises = []
    for (const pluginFactory of pluginFactories) {
      const plugin = await pluginFactory.makePlugin(params)
      assetPromises.push(plugin.getSupportedAssets())
    }

    const onSubmit = lastUsed => {
      console.log(`lastUsed: ${lastUsed.toString()}`)
      console.log(`fiatAmount: ${fiatAmount}`)
      console.log(`cryptoAmount: ${cryptoAmount}`)
    }

    const nativeGuiPlugin: NativeGuiPlugin = {
      startPlugin: async () => {
        const assetArray = await Promise.all(assetPromises)

        const allowedCurrencyCodes: EdgeTokenIdExtended[] = []
        for (const assetMap of assetArray) {
          for (const currencyPluginId in assetMap) {
            const currencyCodeMap = assetMap[currencyPluginId]
            for (const currencyCode in currencyCodeMap) {
              if (currencyCodeMap[currencyCode]) {
                allowedCurrencyCodes.push({ pluginId: currencyPluginId, currencyCode })
              }
            }
          }
        }

        // Pop up modal to pick wallet/asset
        const walletListResult = await showModal.walletPicker({ headerTitle: 'Select Asset to Purchase', allowedCurrencyCodes, showCreateWallet: true })
        const { walletId, currencyCode } = walletListResult
        if (walletId == null) return

        const coreWallet = account.currencyWallets[walletId]
        if (!coreWallet) return showModal.errorDropdown(new Error(`Missing wallet with ID ${walletId}`))
        // Navigate to scene to have user enter amount
        navigation.navigate(navTargets.enterAmount, {
          headerTitle: `Buy ${currencyCode}`,
          label1: `Amount USD`,
          label2: `Amount ${currencyCode}`,
          initialAmount1: '500',
          convertValue,
          onChangeText,
          onSubmit
        })
      }
    }
    return nativeGuiPlugin
  }
}
