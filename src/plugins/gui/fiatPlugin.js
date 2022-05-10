// @flow
import { type EdgeAccount } from 'edge-core-js'
import * as React from 'react'

import { WalletListModal } from '../../components/modals/WalletListModal'
import { Airship, showError } from '../../components/services/AirshipInstance'
import { type GuiPlugin } from '../../types/GuiPluginTypes'
// import { Dispatch } from '../../types/reduxTypes'
import { type NavigationProp } from '../../types/routerTypes.js'
import { creditCardPlugin } from './creditCardPlugin'
import { type FiatPluginAmountEntryParams, type FiatPluginEnterAmountResponse } from './fiatPluginTypes'

const pluginFactories = [creditCardPlugin]

export const executePlugin = async (params: {
  guiPlugin: GuiPlugin,
  account: EdgeAccount,
  navigation: NavigationProp<'pluginBuy'> | NavigationProp<'pluginSell'>
}): Promise<void> => {
  const { guiPlugin, navigation, account } = params
  const { pluginId } = guiPlugin

  const showUi = {
    walletPicker: async params => {
      const { headerTitle, allowedCurrencyCodes } = params
      const walletListResult = await Airship.show(bridge => (
        <WalletListModal bridge={bridge} headerTitle={headerTitle} allowedCurrencyCodes={allowedCurrencyCodes} />
      ))
      return walletListResult
    },
    errorDropdown: async (e: Error) => {
      showError(e)
    },
    enterAmount: async (params: FiatPluginAmountEntryParams) => {
      const { headerTitle, label1, label2, initialAmount1, convertValue, onChangeText } = params
      return new Promise((resolve, reject) => {
        navigation.navigate('guiPluginEnterAmount', {
          headerTitle,
          label1,
          label2,
          initialAmount1,
          convertValue,
          onChangeText,
          onSubmit: async (value: FiatPluginEnterAmountResponse) => {
            resolve(value)
          }
        })
      })
    }
  }
  const pluginPromises = pluginFactories.map(p => {
    const out = p({ showUi, account })
    return out
  })
  console.log('hello')
  // const plugin = await pluginPromises[0]
  const plugins = await Promise.all(pluginPromises)

  const plugin = plugins.find(p => p.pluginId === pluginId)
  if (plugin == null) {
    throw new Error(`pluginId ${pluginId} not found`)
  }

  plugin.startPlugin()
}
