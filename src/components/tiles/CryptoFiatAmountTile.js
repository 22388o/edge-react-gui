// @flow
import { abs, div } from 'biggystring'
import { type EdgeDenomination } from 'edge-core-js'
import * as React from 'react'

import { MAX_CRYPTO_AMOUNT_CHARACTERS } from '../../constants/WalletAndCurrencyConstants.js'
import { formatNumber, trimEnd } from '../../locales/intl.js'
import { DECIMAL_PRECISION } from '../../util/utils'
import { type Theme, cacheStyles, useTheme } from '../services/ThemeContext.js'
import { FiatText } from '../text/FiatText'
import { EdgeText } from '../themed/EdgeText'
import { Tile } from './Tile'

type Props = {
  nativeCryptoAmount: string,
  cryptoCurrencyCode: string,
  isoFiatCurrencyCode: string,
  maxCryptoChars?: number,
  title: string,
  denomination: EdgeDenomination
}

export const CryptoFiatAmountTile = (props: Props) => {
  const { title, nativeCryptoAmount, cryptoCurrencyCode, isoFiatCurrencyCode, maxCryptoChars, denomination } = props
  const styles = getStyles(useTheme())

  const { name: cryptoName, multiplier: cryptoDenomMult } = denomination

  // Convert wallet native denomination to exchange denomination
  // Does NOT take into account display denomination settings here,
  // i.e. sats, bits, etc.
  const cryptoAmountDenom = div(nativeCryptoAmount, cryptoDenomMult, DECIMAL_PRECISION)

  // Default to 10 displayed chars for crypto amount
  const fmtCryptoAmount = trimEnd(formatNumber(cryptoAmountDenom, { toFixed: maxCryptoChars === undefined ? MAX_CRYPTO_AMOUNT_CHARACTERS : maxCryptoChars }))

  const cryptoAmountText = `${fmtCryptoAmount} ${cryptoName} `

  // Fiat amount is always positive for this specific tile
  const absCryptoAmount = abs(nativeCryptoAmount)
  const fiatAmount = (
    <FiatText
      nativeCryptoAmount={absCryptoAmount}
      cryptoCurrencyCode={cryptoCurrencyCode}
      isoFiatCurrencyCode={isoFiatCurrencyCode}
      cryptoExchangeMultiplier={cryptoDenomMult}
      parenthesisEnclosed
    />
  )

  return (
    <Tile type="static" title={title} contentPadding={false} style={styles.tileContainer}>
      <EdgeText>
        {cryptoAmountText}
        {fiatAmount}
      </EdgeText>
    </Tile>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  tileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
}))
