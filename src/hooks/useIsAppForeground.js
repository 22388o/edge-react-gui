// @flow

import { type AppStateStatus, AppState } from 'react-native'

import { useEffect, useState } from '../types/reactHooks.js'

export const useIsAppForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true)

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === 'active')
    }
    const listener = AppState.addEventListener('change', onChange)
    return () => listener.remove()
  }, [setIsForeground])

  return isForeground
}
