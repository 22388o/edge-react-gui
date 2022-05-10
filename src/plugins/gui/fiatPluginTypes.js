// @flow
import { type EdgeAccount } from 'edge-core-js'

import { type EdgeTokenIdExtended } from '../../types/types.js'

export type FiatPluginAmountEntryParams = {
  headerTitle: string,
  label1: string,
  label2: string,
  onChangeText: (fieldNum: number, value: string) => Promise<void>,
  convertValue: (sourceFieldNum: number, value: string) => Promise<string>,
  initialAmount1?: string,
  headerIconUri?: string
}

export type FiatPluginEnterAmountResponse = { lastUsed: number, value1: string, value2: string }

export type FiatPluginUi = {
  walletPicker: (params: { headerTitle: string, allowedCurrencyCodes?: EdgeTokenIdExtended[], showCreateWallet?: boolean }) => Promise<{
    walletId: string,
    currencyCode: string
  }>,
  errorDropdown: (error: Error) => Promise<void>,
  enterAmount: (params: FiatPluginAmountEntryParams) => Promise<FiatPluginEnterAmountResponse>
  // showWebView: (params: { webviewUrl: string }) => Promise<void>
}

export type FiatPluginFactoryArgs = {
  // TODO:
  // io: {
  //   log: EdgeLog, // scoped logs
  //   cacheStorage: Disklet, // Local cache, not synced
  //   syncedStorage: ScopedStorage
  // }
  showUi: FiatPluginUi,
  account: EdgeAccount
}

export type FiatPlugin = {
  pluginId: string,
  startPlugin: () => Promise<void>
}

export type FiatPluginFactory = (params: FiatPluginFactoryArgs) => Promise<FiatPlugin>
