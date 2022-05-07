// @flow
import { type EdgeAccount } from 'edge-core-js'
import * as React from 'react'

import { WalletListModal } from '../../components/modals/WalletListModal'
import { Airship, showError } from '../../components/services/AirshipInstance'
import { type GuiPlugin } from '../../types/GuiPluginTypes'
// import { Dispatch } from '../../types/reduxTypes'
import { type NavigationProp } from '../../types/routerTypes.js'
import { creditCardPlugin } from './creditCardGuiPlugin'

const plugins = [creditCardPlugin]

export const executePlugin = async (params: {
  guiPlugin: GuiPlugin,
  account: EdgeAccount,
  navigation: NavigationProp<'pluginBuy'> | NavigationProp<'pluginSell'>
}): Promise<void> => {
  const { guiPlugin, navigation, account } = params
  const { pluginId } = guiPlugin

  const pluginFactory = plugins.find(p => p.pluginId === pluginId)
  if (pluginFactory == null) {
    throw new Error(`pluginId ${pluginId} not found`)
  }
  const showModal = {
    walletPicker: async params => {
      const { headerTitle, allowedCurrencyCodes } = params
      const walletListResult = await Airship.show(bridge => (
        <WalletListModal bridge={bridge} headerTitle={headerTitle} allowedCurrencyCodes={allowedCurrencyCodes} />
      ))
      return walletListResult
    },
    errorDropdown: showError
  }
  const plugin = await pluginFactory.makePlugin({ navigation, showModal, account })
  plugin.startPlugin()
}
