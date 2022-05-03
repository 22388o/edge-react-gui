// @flow
import { Linking, Platform } from 'react-native'
import SafariView from 'react-native-safari-view'

/**
 * Uses the device's browser to open a URI
 * */
export const openBrowserUri = (uri: string) => {
  if (uri === '') {
    throw new Error('openBrowserUri: Empty uri prop')
  }
  if (Platform.OS === 'ios') {
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
 * Makes sure that the last character of the URI is as expected.
 */
export const enforceLastChar = (uri: string, lastChar: string): string => {
  return uri.substr(-1) === lastChar ? uri : uri + lastChar
}

/**
 * Remove last character if it matches the param
 */
export const omitLastChar = (uri: string, lastChar: string): string => {
  return uri.substr(-1) === lastChar ? uri.substr(0, uri.length - 1) : uri
}
