// @flow

import * as React from 'react'

import { useSafeState } from '../hooks/useSafeState'

type Memo = <T>(component: T) => T

type ForwardRef = (body: (props: any, ref: any) => React.Node) => any

type SetState<S> = (value: S | ((state: S) => S)) => void

type UseCallback = <T: (...args: any[]) => any>(callback: T, deps: any[]) => T

type UseContext = <T>(context: React.Context<T>) => T

type UseDebugValue = <T>(value: T, format?: (value: T) => any) => void

type UseEffect = (effect: () => void | (() => void), deps?: any[]) => void

type UseImperativeHandle = (ref: any, init: () => any, deps?: any[]) => void

type UseMemo = <T>(init: () => T, deps?: any[]) => T

type UseState = <S>(init: S | (() => S)) => [S, SetState<S>]

type UseReducer = {
  // Normal version:
  <State, Action>(reducer: (state: State | void, action: Action) => State, init: State | void): [State, (action: Action) => void],

  // Initializer version:
  <State, Action, Init>(
    reducer: (state: State | void, action: Action) => State,
    init: Init,
    initializer: (init: Init) => State
  ): [State, (action: Action) => void]
}

type UseRef = {
  // Value container:
  <T>(init: T): { current: T },
  <T>(): { current: T | void },

  // Component ref:
  <T>(init: T | null): { current: T | null }
}

// $FlowFixMe
export const forwardRef: ForwardRef = React.forwardRef
// $FlowFixMe
export const memo: Memo = React.memo
// $FlowFixMe
export const useCallback: UseCallback = React.useCallback
// $FlowFixMe
export const useContext: UseContext = React.useContext
// $FlowFixMe
export const useDebugValue: UseDebugValue = React.useDebugValue
// $FlowFixMe
export const useEffect: UseEffect = React.useEffect
// $FlowFixMe
export const useImperativeHandle: UseImperativeHandle = React.useImperativeHandle
// $FlowFixMe
export const useLayoutEffect: UseEffect = React.useLayoutEffect
// $FlowFixMe
export const useMemo: UseMemo = React.useMemo
// $FlowFixMe
export const useReducer: UseReducer = React.useReducer
// $FlowFixMe
export const useRef: UseRef = React.useRef

export const useState: UseState = useSafeState
