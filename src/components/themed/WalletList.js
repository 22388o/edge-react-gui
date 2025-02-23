// @flow

import * as React from 'react'
import { FlatList, SectionList } from 'react-native'

import { selectWallet } from '../../actions/WalletActions.js'
import { useAllTokens } from '../../hooks/useAllTokens.js'
import { useWatchAccount } from '../../hooks/useWatch.js'
import s from '../../locales/strings'
import { getExchangeDenominationFromState } from '../../selectors/DenominationSelectors.js'
import { calculateFiatBalance } from '../../selectors/WalletSelectors.js'
import { useMemo } from '../../types/reactHooks.js'
import { useDispatch, useSelector } from '../../types/reactRedux.js'
import type { CreateTokenType, CreateWalletType, FlatListItem, GuiWallet } from '../../types/types.js'
import { type EdgeTokenId, asSafeDefaultGuiWallet } from '../../types/types.js'
import { getCreateWalletTypes } from '../../util/CurrencyInfoHelpers.js'
import { fixSides, mapSides, sidesToMargin } from '../../util/sides.js'
import { normalizeForSearch } from '../../util/utils.js'
import { useTheme } from '../services/ThemeContext.js'
import { WalletListCreateRow } from './WalletListCreateRow.js'
import { WalletListCurrencyRow } from './WalletListCurrencyRow.js'
import { WalletListLoadingRow } from './WalletListLoadingRow.js'
import { WalletListSectionHeader } from './WalletListSectionHeader.js'

export const alphabeticalSort = (itemA: string, itemB: string) => (itemA < itemB ? -1 : itemA > itemB ? 1 : 0)

type WalletListItem = {
  id: string | null,
  fullCurrencyCode?: string,
  key: string,
  createWalletType?: CreateWalletType,
  createTokenType?: CreateTokenType
}

type Section = {
  title: string,
  data: WalletListItem[]
}

const getSortOptionsCurrencyCode = (fullCurrencyCode: string): string => {
  const splittedCurrencyCode = fullCurrencyCode.split('-')
  return splittedCurrencyCode[1] || splittedCurrencyCode[0]
}

type Props = {|
  // Filtering:
  allowedAssets?: EdgeTokenId[],
  excludeAssets?: EdgeTokenId[],
  excludeWalletIds?: string[],
  filterActivation?: boolean,

  // Visuals:
  marginRem?: number | number[],
  searching: boolean,
  searchText: string,
  showCreateWallet?: boolean,

  // Callbacks:
  onPress?: (walletId: string, currencyCode: string) => void
|}

export function WalletList(props: Props) {
  const dispatch = useDispatch()
  const {
    // Filtering:
    allowedAssets,
    excludeAssets,
    excludeWalletIds,
    filterActivation,

    // Visuals:
    marginRem,
    searching,
    searchText,
    showCreateWallet,

    // Callbacks:
    onPress
  } = props

  const theme = useTheme()
  const margin = sidesToMargin(mapSides(fixSides(marginRem, 0), theme.rem))

  const handlePress = useMemo(
    () =>
      onPress ??
      ((walletId: string, currencyCode: string) => {
        dispatch(selectWallet(walletId, currencyCode))
      }),
    [dispatch, onPress]
  )
  const account = useSelector(state => state.core.account)
  const exchangeRates = useSelector(state => state.exchangeRates)
  const mostRecentWallets = useSelector(state => state.ui.settings.mostRecentWallets)
  const walletsSort = useSelector(state => state.ui.settings.walletsSort)
  const wallets = useSelector(state => state.ui.wallets.byId)

  // Subscribe to the wallet list:
  const activeWalletIds = useWatchAccount(account, 'activeWalletIds')

  // Subscribe to all the tokens in the account:
  const allTokens = useAllTokens(account)

  function sortWalletList(walletList: WalletListItem[]): WalletListItem[] {
    const getFiatBalance = (wallet: GuiWallet, fullCurrencyCode: string): number => {
      const currencyWallet = account.currencyWallets[wallet.id]
      const currencyCode = getSortOptionsCurrencyCode(fullCurrencyCode)
      const exchangeDenomination = dispatch(getExchangeDenominationFromState(currencyWallet.currencyInfo.pluginId, currencyCode))
      const fiatBalanceString = calculateFiatBalance(currencyWallet, exchangeDenomination, exchangeRates)
      return parseFloat(fiatBalanceString)
    }

    if (walletsSort === 'name') {
      walletList.sort((itemA, itemB) => {
        if (itemA.id == null || itemB.id == null || wallets[itemA.id] === undefined || wallets[itemB.id] === undefined) return 0
        return alphabeticalSort(wallets[itemA.id].name, wallets[itemB.id].name)
      })
    }

    if (walletsSort === 'currencyCode') {
      walletList.sort((itemA, itemB) => {
        if (itemA.id == null || itemB.id == null) return 0
        return alphabeticalSort(getSortOptionsCurrencyCode(itemA.fullCurrencyCode || ''), getSortOptionsCurrencyCode(itemB.fullCurrencyCode || ''))
      })
    }

    if (walletsSort === 'currencyName') {
      walletList.sort((itemA, itemB) => {
        if (itemA.id == null || itemB.id == null || wallets[itemA.id] === undefined || wallets[itemB.id] === undefined) return 0
        const currencyNameA = wallets[itemA.id || ''].currencyNames[getSortOptionsCurrencyCode(itemA.fullCurrencyCode || '')]
        const currencyNameB = wallets[itemB.id || ''].currencyNames[getSortOptionsCurrencyCode(itemB.fullCurrencyCode || '')]
        return alphabeticalSort(currencyNameA, currencyNameB)
      })
    }

    if (walletsSort === 'highest') {
      walletList.sort((itemA, itemB) => {
        if (itemA.id == null || itemB.id == null || wallets[itemA.id] === undefined || wallets[itemB.id] === undefined) return 0
        const aBalance = getFiatBalance(wallets[itemB.id ?? ''], itemB.fullCurrencyCode || '')
        const bBalance = getFiatBalance(wallets[itemA.id ?? ''], itemA.fullCurrencyCode || '')
        return aBalance - bBalance
      })
    }

    if (walletsSort === 'lowest') {
      walletList.sort((itemA, itemB) => {
        if (itemA.id == null || itemB.id == null || wallets[itemA.id] === undefined || wallets[itemB.id] === undefined) return 0
        return getFiatBalance(wallets[itemA.id ?? ''], itemA.fullCurrencyCode || '') - getFiatBalance(wallets[itemB.id ?? ''], itemB.fullCurrencyCode || '')
      })
    }
    return walletList
  }

  function checkFromExistingWallets(walletList: WalletListItem[], fullCurrencyCode: string): boolean {
    return !!walletList.find((item: WalletListItem) => item.fullCurrencyCode === fullCurrencyCode)
  }

  function getWalletList(): WalletListItem[] {
    const walletList = []

    for (const walletId of activeWalletIds) {
      const wallet = wallets[walletId]

      if (excludeWalletIds != null && excludeWalletIds.find(excludeWalletId => excludeWalletId === walletId)) continue // Skip if excluded

      if (wallet == null && !searching) {
        // Initialize wallets that is still loading
        walletList.push({
          id: walletId,
          key: walletId
        })
      } else if (wallet != null) {
        const { enabledTokens, name, pluginId } = asSafeDefaultGuiWallet(wallet)
        const { currencyInfo } = account.currencyConfig[pluginId]
        const { currencyCode, displayName } = currencyInfo

        // Initialize wallets
        if (checkFilterWallet({ name, currencyCode, currencyName: displayName, pluginId }, searchText, allowedAssets, excludeAssets)) {
          walletList.push({
            id: walletId,
            fullCurrencyCode: currencyCode,
            key: `${walletId}-${currencyCode}`
          })
        }

        // Initialize tokens
        for (const tokenCode of enabledTokens) {
          const tokenId = Object.keys(allTokens[pluginId]).find(id => allTokens[pluginId][id].currencyCode === tokenCode)
          if (tokenId == null) continue
          const token = allTokens[pluginId][tokenId]

          const fullCurrencyCode = `${currencyCode}-${tokenCode}`

          if (
            checkFilterWallet({ name, currencyCode: tokenCode, currencyName: token.displayName, pluginId, tokenId }, searchText, allowedAssets, excludeAssets)
          ) {
            walletList.push({
              id: walletId,
              fullCurrencyCode,
              key: `${walletId}-${fullCurrencyCode}`,
              tokenCode
            })
          }
        }
      }
    }

    const sortedWalletlist = sortWalletList(walletList)

    if (showCreateWallet) {
      // Initialize Create Wallets
      const createWalletCurrencies = getCreateWalletTypes(account, filterActivation)
      for (const createWalletCurrency of createWalletCurrencies) {
        const { currencyCode, currencyName, pluginId } = createWalletCurrency

        if (
          checkFilterWallet({ name: '', currencyCode, currencyName, pluginId }, searchText, allowedAssets, excludeAssets) &&
          !checkFromExistingWallets(walletList, currencyCode)
        ) {
          sortedWalletlist.push({
            id: null,
            fullCurrencyCode: currencyCode,
            key: currencyCode,
            createWalletType: createWalletCurrency
          })
        }
      }

      // Initialize Create Tokens
      for (const pluginId of Object.keys(account.currencyConfig)) {
        const currencyConfig = account.currencyConfig[pluginId]
        const { builtinTokens, currencyInfo } = currencyConfig

        for (const tokenId of Object.keys(builtinTokens)) {
          const { currencyCode, displayName } = builtinTokens[tokenId]

          // Fix for when the token code and chain code are the same (like EOS/TLOS)
          if (currencyCode === currencyInfo.currencyCode) continue
          const fullCurrencyCode = `${currencyInfo.currencyCode}-${currencyCode}`

          if (
            checkFilterWallet({ name: '', currencyCode, currencyName: displayName, pluginId, tokenId }, searchText, allowedAssets, excludeAssets) &&
            !checkFromExistingWallets(walletList, fullCurrencyCode)
          ) {
            sortedWalletlist.push({
              id: null,
              fullCurrencyCode,
              key: fullCurrencyCode,
              createTokenType: {
                currencyCode,
                currencyName: displayName,
                pluginId: currencyInfo.pluginId
              }
            })
          }
        }
      }
    }

    return sortedWalletlist
  }

  function renderRow(data: FlatListItem<WalletListItem>) {
    // Create Wallet/Token
    if (data.item.id == null) {
      const { createWalletType, createTokenType } = data.item
      return <WalletListCreateRow {...{ ...createWalletType, ...createTokenType }} onPress={handlePress} />
    }

    const walletId = data.item.id.replace(/:.*/, '')
    const guiWallet = wallets[walletId]

    if (guiWallet == null || account.currencyWallets[walletId] == null) {
      return <WalletListLoadingRow />
    } else {
      const isToken = guiWallet.currencyCode !== data.item.fullCurrencyCode
      const walletCodesArray = data.item.fullCurrencyCode != null ? data.item.fullCurrencyCode.split('-') : []
      const currencyCode = isToken ? walletCodesArray[1] : walletCodesArray[0]

      return <WalletListCurrencyRow currencyCode={currencyCode} walletId={walletId} onPress={handlePress} />
    }
  }

  const renderSectionHeader = (section: { section: Section }) => <WalletListSectionHeader title={section.section.title} />

  function getMostRecentlyUsedWallets(size: number, walletListItem: WalletListItem[]): WalletListItem[] {
    const recentWallets = []

    for (let i = 0; i < size; i++) {
      const recentUsed = mostRecentWallets[i]
      if (!recentUsed) break
      const wallet = walletListItem.find(item => {
        const fullCurrencyCodeLowerCase = item.fullCurrencyCode ? item.fullCurrencyCode.toLowerCase() : ''
        return item.id === recentUsed.id && fullCurrencyCodeLowerCase.includes(recentUsed.currencyCode.toLowerCase())
      })
      if (wallet) {
        recentWallets.push(wallet)
      }
    }

    return recentWallets
  }

  const getSection = (walletList: WalletListItem[], walletListOnlyCount: number) => {
    const sections: Section[] = []

    let mostRecentWalletsCount = 0
    if (walletListOnlyCount > 4 && walletListOnlyCount < 11) {
      mostRecentWalletsCount = 2
    } else if (walletListOnlyCount > 10) {
      mostRecentWalletsCount = 3
    }

    sections.push({
      title: s.strings.wallet_list_modal_header_mru,
      data: getMostRecentlyUsedWallets(mostRecentWalletsCount, walletList)
    })

    sections.push({
      title: s.strings.wallet_list_modal_header_all,
      data: walletList
    })

    return sections
  }

  const walletList = getWalletList()

  let isSectionList = false
  let walletOnlyList = []
  if (!searching && searchText.length === 0 && mostRecentWallets.length > 1) {
    walletOnlyList = walletList.filter(item => item.id)
    if (walletOnlyList.length > 4) {
      isSectionList = true
    }
  }

  if (isSectionList) {
    return (
      <SectionList
        keyboardShouldPersistTaps="handled"
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        sections={getSection(walletList, walletOnlyList.length)}
        style={margin}
      />
    )
  }

  return <FlatList data={walletList} keyboardShouldPersistTaps="handled" renderItem={renderRow} style={margin} />
}

type FilterDetailsType = {
  // For searching:
  name: string,
  currencyCode: string,
  currencyName: string,

  // For filtering:
  pluginId: string,
  tokenId?: string
}

function checkFilterWallet(details: FilterDetailsType, filterText: string, allowedAssets?: EdgeTokenId[], excludeAssets?: EdgeTokenId[]): boolean {
  const { pluginId, tokenId } = details
  if (allowedAssets != null && !hasAsset(allowedAssets, { pluginId, tokenId })) {
    return false
  }

  if (excludeAssets != null && hasAsset(excludeAssets, { pluginId, tokenId })) {
    return false
  }

  if (filterText === '') {
    return true
  }

  const currencyCode = details.currencyCode.toLowerCase()
  const walletName = normalizeForSearch(details.name)
  const currencyName = normalizeForSearch(details.currencyName)
  const filterString = normalizeForSearch(filterText)
  return walletName.includes(filterString) || currencyCode.includes(filterString) || currencyName.includes(filterString)
}

/**
 * Returns true if the asset array includes the given asset.
 */
function hasAsset(assets: EdgeTokenId[], target: EdgeTokenId): boolean {
  for (const asset of assets) {
    if (asset.pluginId === target.pluginId && asset.tokenId === target.tokenId) {
      return true
    }
  }
  return false
}
