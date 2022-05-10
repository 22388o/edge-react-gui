// @flow

import * as React from 'react'
import { Image, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { SceneWrapper } from '../../../components/common/SceneWrapper.js'
// import { Actions } from '../../types/routerTypes.js'
import { type Theme, cacheStyles, useTheme } from '../../../components/services/ThemeContext.js'
import { OutlinedTextInput } from '../../../components/themed/OutlinedTextInput.js'
import { SceneHeader } from '../../../components/themed/SceneHeader.js'
import { memo, useCallback, useRef, useState } from '../../../types/reactHooks.js'
import type { RouteProp } from '../../../types/routerTypes'

type Props = {
  route: RouteProp<'guiPluginEnterAmount'>
}

export const FiatPluginEnterAmountScene = memo((props: Props): React.Node => {
  const theme = useTheme()
  const styles = getStyles(theme)
  const { headerIconUri, headerTitle, onSubmit, convertValue, onChangeText, label1, label2, initialAmount1 = '' } = props.route.params
  const [value1, setValue1] = useState(initialAmount1)
  const [value2, setValue2] = useState('')
  const firstRun = useRef<boolean>(true)
  const lastUsed = useRef<number>(1)

  if (firstRun.current && initialAmount1 != null) {
    convertValue(1, initialAmount1).then(val => setValue2(val))
  }
  firstRun.current = false
  let headerIcon = null
  if (headerIconUri != null) {
    headerIcon = <Image style={styles.icon} source={{ uri: headerIconUri }} />
  }

  const handleChangeText1 = useCallback(
    (value: string) => {
      lastUsed.current = 1
      onChangeText(1, value)
      setValue1(value)
      convertValue(1, value).then(v => setValue2(v))
    },
    [convertValue, onChangeText]
  )
  const handleChangeText2 = useCallback(
    (value: string) => {
      lastUsed.current = 2
      onChangeText(2, value)
      setValue2(value)
      convertValue(2, value).then(v => setValue1(v))
    },
    [convertValue, onChangeText]
  )
  const handleSubmit = useCallback(() => {
    onSubmit({ lastUsed: lastUsed.current, value1, value2 })
  }, [onSubmit, value1, value2])

  return (
    <SceneWrapper scroll background="theme">
      <ScrollView>
        <SceneHeader style={styles.sceneHeader} title={headerTitle} underline withTopMargin>
          {headerIcon}
        </SceneHeader>
        <View style={styles.container}>
          <View style={styles.textFields}>
            <OutlinedTextInput
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              autoCapitalize="none"
              keyboardType="decimal-pad"
              label={label1}
              onChangeText={handleChangeText1}
              onSubmitEditing={handleSubmit}
              value={value1 ?? '0'}
              // marginRem={[0, 1]}
              // error={handleError}
            />
            <OutlinedTextInput
              autoCorrect={false}
              autoFocus={false}
              returnKeyType="done"
              autoCapitalize="none"
              keyboardType="decimal-pad"
              label={label2}
              onChangeText={handleChangeText2}
              onSubmitEditing={handleSubmit}
              value={value2 ?? '0'}
              // marginRem={[0, 1]}
              // error={handleError}
            />
          </View>
        </View>
      </ScrollView>
    </SceneWrapper>
  )
})

const getStyles = cacheStyles((theme: Theme) => ({
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    alignItems: 'center'
  },
  textFields: {
    flexDirection: 'column',
    minWidth: theme.rem(15),
    maxWidth: theme.rem(20)
  },
  icon: {
    height: theme.rem(1.5),
    width: theme.rem(1.5),
    marginRight: theme.rem(0.5),
    marginLeft: theme.rem(0.5),
    resizeMode: 'contain'
  }
}))
