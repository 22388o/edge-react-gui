// @flow

import { type EdgeCurrencyInfo } from 'edge-core-js'
import * as React from 'react'
import { View } from 'react-native'

import { type Theme, cacheStyles, useTheme } from '../services/ThemeContext.js'
import { CurrencyIcon } from '../themed/CurrencyIcon.js'
import { EdgeText } from '../themed/EdgeText.js'

type Props = {
  currencyInfo: EdgeCurrencyInfo
}

export function CurrencySettingsTitle(props: Props) {
  const { displayName, pluginId } = props.currencyInfo

  const styles = getStyles(useTheme())
  return (
    <View style={styles.container}>
      <CurrencyIcon sizeRem={1.25} marginRem={[0, 0.5, 0, 0]} pluginId={pluginId} resizeMode="contain" />
      <EdgeText style={styles.text}>{displayName}</EdgeText>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.rem(0.75)
  },
  text: {
    fontFamily: theme.fontFaceMedium
  }
}))
