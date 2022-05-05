// @flow
import { Linking, Platform } from 'react-native'
import SafariView from 'react-native-safari-view'

export type OpenBrowserUriParams = { uri: string, isSafariView: boolean }

/**
 * Uses the device's browser to open a URI.
 * */
export const openBrowserUri = ({ uri, isSafariView }: OpenBrowserUriParams) => {
  if (uri === '') {
    throw new Error('openBrowserUri: Empty uri prop')
  }
  // Try to open a SafariView, if requested and supported
  if (isSafariView && Platform.OS === 'ios') {
    return SafariView.isAvailable()
      .then(SafariView.show({ url: uri }))
      .catch(error => {
        // Fallback WebView code for iOS 8 and earlier
        console.warn(`openBrowserUri: Could not open '${uri}' in Safari: ${error.message}`)
        Linking.openURL(uri)
      })
  } else {
    // Android
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri)
      } else {
        throw new Error('openBrowserUri: Unsupported uri: ' + uri)
      }
    })
  }
}

/**
 * Remove last character if it matches the param
 */
export const omitLastChar = (uri: string, lastChar: string): string => {
  return uri.substr(-1) === lastChar ? uri.substr(0, uri.length - 1) : uri
}
