// @flow

import type { EdgeLobby, EdgeParsedUri, EdgeSwapQuote } from 'edge-core-js'

import { type XPubModalAction } from '../actions/XPubModalActions.js'
import type { AccountActivationPaymentInfo, HandleActivationInfo, HandleAvailableStatus } from '../reducers/scenes/CreateWalletReducer.js'
import { type GuiContact, type GuiCurrencyInfo, type GuiWallet } from '../types.js'
import { type CoreContextAction } from './Core/Context/action.js'
import { type SendLogsAction } from './Logs/action.js'

type LegacyActionName =
  | 'ACCOUNT_INIT_COMPLETE'
  | 'ACCOUNT/LOGGED_IN'
  | 'ACTIVATE_WALLET_START'
  | 'ACTIVATE_WALLET_SUCCESS'
  | 'ADD_NEW_CUSTOM_TOKEN_FAILURE'
  | 'ADD_NEW_CUSTOM_TOKEN_SUCCESS'
  | 'ADD_NEW_TOKEN_THEN_DELETE_OLD_SUCCESS'
  | 'ADD_TOKEN_START'
  | 'ADD_TOKEN_SUCCESS'
  | 'ADD_TOKEN'
  | 'ADDRESS_DEEP_LINK_COMPLETE'
  | 'ADDRESS_DEEP_LINK_RECEIVED'
  | 'ARCHIVE_WALLET_START'
  | 'ARCHIVE_WALLET_SUCCESS'
  | 'CLOSE_CUSTOM_FEES_MODAL'
  | 'CLOSE_DELETE_WALLET_SUCCESS'
  | 'CLOSE_GETSEED_WALLET_MODAL'
  | 'CLOSE_HELP_MODAL'
  | 'CLOSE_RESYNC_WALLET_MODAL'
  | 'CLOSE_RESYNC_WALLET_SUCCESS'
  | 'CLOSE_SPLIT_WALLET_MODAL'
  | 'CLOSE_SPLIT_WALLET_SUCCESS'
  | 'CORE/WALLETS/UPDATE_WALLETS'
  | 'DEEP_LINK_RECEIVED'
  | 'DELETE_CUSTOM_TOKEN_FAILURE'
  | 'DELETE_CUSTOM_TOKEN_START'
  | 'DELETE_CUSTOM_TOKEN_SUCCESS'
  | 'DELETE_WALLET_START'
  | 'DISABLE_OTP_RESET'
  | 'EDIT_CUSTOM_TOKEN_FAILURE'
  | 'EDIT_CUSTOM_TOKEN_START'
  | 'EDIT_CUSTOM_TOKEN_SUCCESS'
  | 'ERASE_DEEP_LINK'
  | 'EXCHANGE_RATES/UPDATE_EXCHANGE_RATES'
  | 'HIDE_DELETE_TOKEN_MODAL'
  | 'HIDE_PASSWORD_RECOVERY_MODAL'
  | 'INSERT_WALLET_IDS_FOR_PROGRESS'
  | 'LEGACY_ADDRESS_MODAL/ACTIVATED'
  | 'LEGACY_ADDRESS_MODAL/DEACTIVATED'
  | 'LEGACY_ADDRESS_MODAL/TOGGLED'
  | 'LIST_USER_USER_SIDE_MENU'
  | 'LOGOUT'
  | 'MANAGE_TOKENS_START'
  | 'MANAGE_TOKENS_SUCCESS'
  | 'MANAGE_TOKENS'
  | 'NEW_RECEIVE_ADDRESS'
  | 'OPEN_CUSTOM_FEES_MODAL'
  | 'OPEN_HELP_MODAL'
  | 'OVERWRITE_THEN_DELETE_TOKEN_SUCCESS'
  | 'PASSWORD_REMINDER_MODAL/CHECK_PASSWORD_FAIL'
  | 'PASSWORD_REMINDER_MODAL/CHECK_PASSWORD_START'
  | 'PASSWORD_REMINDER_MODAL/CHECK_PASSWORD_SUCCESS'
  | 'PASSWORD_REMINDER_MODAL/PASSWORD_REMINDER_POSTPONED'
  | 'PASSWORD_REMINDER_MODAL/REQUEST_CHANGE_PASSWORD'
  | 'PASSWORD_REMINDER_MODAL/SET_PASSWORD_REMINDER_FAIL'
  | 'PASSWORD_REMINDER_MODAL/SET_PASSWORD_REMINDER_START'
  | 'PASSWORD_REMINDER_MODAL/SET_PASSWORD_REMINDER_SUCCESS'
  | 'PASSWORD_REMINDER/PASSWORD_REMINDER_POSTPONED'
  | 'PERMISSIONS/UPDATE'
  | 'PRIVATE_KEY_MODAL/PRIMARY_MODAL/ACTIVATED'
  | 'PRIVATE_KEY_MODAL/PRIMARY_MODAL/DEACTIVATED'
  | 'PRIVATE_KEY_MODAL/SECONDARY_MODAL/ACTIVATED'
  | 'PRIVATE_KEY_MODAL/SECONDARY_MODAL/DEACTIVATED'
  | 'PRIVATE_KEY_MODAL/SWEEP_PRIVATE_KEY_FAIL'
  | 'PRIVATE_KEY_MODAL/SWEEP_PRIVATE_KEY_RESET'
  | 'PRIVATE_KEY_MODAL/SWEEP_PRIVATE_KEY_START'
  | 'PRIVATE_KEY_MODAL/SWEEP_PRIVATE_KEY_SUCCESS'
  | 'RESYNC_WALLET_START'
  | 'SELECT_FIAT'
  | 'SELECT_WALLET_TYPE'
  | 'SET_CONFIRM_PASSWORD_ERROR'
  | 'SET_KEYBOARD_HEIGHT'
  | 'SET_TOKEN_SETTINGS'
  | 'SET_TRANSACTION_SUBCATEGORIES'
  | 'SHOW_DELETE_TOKEN_MODAL'
  | 'SHOW_PASSWORD_RECOVERY_MODAL'
  | 'SPENDING_LIMITS/NEW_SPENDING_LIMITS'
  | 'SPLIT_WALLET_START'
  | 'TOGGLE_ARCHIVE_VISIBILITY'
  | 'UI/COMPONENTS/DROPDOWN_ALERT/DISMISS_DROPDOWN_ALERT'
  | 'UI/COMPONENTS/DROPDOWN_ALERT/DISPLAY_DROPDOWN_ALERT'
  | 'UI/COMPONENTS/ERROR_ALERT/DISMISS_ERROR_ALERT'
  | 'UI/COMPONENTS/ERROR_ALERT/DISPLAY_ERROR_ALERT'
  | 'UI/COMPONENTS/TRANSACTION_ALERT/DISMISS_TRANSACTION_ALERT'
  | 'UI/COMPONENTS/TRANSACTION_ALERT/DISPLAY_TRANSACTION_ALERT'
  | 'UI/SCENES/SETTINGS/SELECT_DEFAULT_FIAT'
  | 'UI/SCENES/SETTINGS/SET_BITCOIN_OVERRIDE_SERVER_START'
  | 'UI/SCENES/SETTINGS/SET_BLUETOOTH_MODE_START'
  | 'UI/SCENES/SETTINGS/SET_DEFAULT_FIAT_START'
  | 'UI/SCENES/SETTINGS/SET_MERCHANT_MODE_START'
  | 'UI/SCENES/SETTINGS/SET_PIN_MODE_START'
  | 'UI/SCENES/SETTINGS/SET_PIN_START'
  | 'UI/SCENES/TRANSACTION_LIST/DELETE_TRANSACTIONS_LIST'
  | 'UI/SCENES/TRANSACTION_LIST/TRANSACTIONS_SEARCH_HIDDEN'
  | 'UI/SCENES/TRANSACTION_LIST/TRANSACTIONS_SEARCH_VISIBLE'
  | 'UI/SCENES/TRANSACTION_LIST/UPDATE_CONTACTS_LIST'
  | 'UI/SCENES/TRANSACTION_LIST/UPDATE_SEARCH_RESULTS'
  | 'UI/SCENES/TRANSACTION_LIST/UPDATE_TRANSACTIONS'
  | 'UI/SEND_CONFIMATION/MAKE_SPEND_FAILED'
  | 'UI/SEND_CONFIMATION/NEW_PIN'
  | 'UI/SEND_CONFIMATION/NEW_SPEND_INFO'
  | 'UI/SEND_CONFIMATION/RESET'
  | 'UI/SEND_CONFIMATION/UPDATE_SPEND_PENDING'
  | 'UI/SEND_CONFIMATION/UPDATE_TRANSACTION'
  | 'UI/SETTINGS/ADD_EXCHANGE_TIMER'
  | 'UI/SETTINGS/CHANGE_TOUCH_ID_SETTINGS'
  | 'UI/SETTINGS/LOAD_SETTINGS'
  | 'UI/SETTINGS/OTP_SETTINGS'
  | 'UI/SETTINGS/SET_ACCOUNT_BALANCE_VISIBILITY'
  | 'UI/SETTINGS/SET_AUTO_LOGOUT_TIME'
  | 'UI/SETTINGS/SET_BITCOIN_OVERRIDE_SERVER'
  | 'UI/SETTINGS/SET_BLUETOOTH_MODE'
  | 'UI/SETTINGS/SET_CUSTOM_TOKENS'
  | 'UI/SETTINGS/SET_DEFAULT_FIAT'
  | 'UI/SETTINGS/SET_DENOMINATION_KEY'
  | 'UI/SETTINGS/SET_LOGIN_STATUS'
  | 'UI/SETTINGS/SET_MERCHANT_MODE'
  | 'UI/SETTINGS/SET_OTP_MODE'
  | 'UI/SETTINGS/SET_OTP'
  | 'UI/SETTINGS/SET_PIN_MODE'
  | 'UI/SETTINGS/SET_PIN'
  | 'UI/SETTINGS/SET_SETTINGS_LOCK'
  | 'UI/SETTINGS/TOGGLE_PIN_LOGIN_ENABLED'
  | 'UI/SETTINGS/TOUCH_ID_SETTINGS'
  | 'UI/SETTINGS/UPDATE_SETTINGS'
  | 'UI/WALLETS/ACTIVATE_WALLET_ID'
  | 'UI/WALLETS/ARCHIVE_WALLET_ID'
  | 'UI/WALLETS/REFRESH_RECEIVE_ADDRESS'
  | 'UI/WALLETS/SELECT_WALLET'
  | 'UI/WALLETS/UPSERT_WALLETS'
  | 'UNIQUE_IDENTIFIER_MODAL/ACTIVATED'
  | 'UNIQUE_IDENTIFIER_MODAL/DEACTIVATED'
  | 'UNIQUE_IDENTIFIER_MODAL/RESET'
  | 'UNIQUE_IDENTIFIER_MODAL/UNIQUE_IDENTIFIER_CHANGED'
  | 'UPDATE_ACTIVE_WALLETS_ORDER_START'
  | 'UPDATE_ACTIVE_WALLETS_ORDER_SUCCESS'
  | 'UPDATE_AMOUNT_RECEIVED_IN_CRYPTO'
  | 'UPDATE_AMOUNT_REQUESTED_IN_CRYPTO'
  | 'UPDATE_AMOUNT_REQUESTED_IN_FIAT'
  | 'UPDATE_ARCHIVED_WALLETS_ORDER_START'
  | 'UPDATE_ARCHIVED_WALLETS_ORDER_SUCCESS'
  | 'UPDATE_CURRENT_SCENE_KEY'
  | 'UPDATE_EXCHANGE_RATES'
  | 'UPDATE_EXISTING_TOKEN_SUCCESS'
  | 'UPDATE_INPUT_CURRENCY_SELECTED'
  | 'UPDATE_METADATA'
  | 'UPDATE_RECEIVE_ADDRESS_ERROR'
  | 'UPDATE_RECEIVE_ADDRESS_SUCCESS'
  | 'UPDATE_SHOW_PASSWORD_RECOVERY_REMINDER_MODAL'
  | 'UPDATE_WALLET_ENABLED_TOKENS'
  | 'UPDATE_WALLET_FIAT_BALANCE_VISIBILITY'
  | 'UPDATE_WALLET_LOADING_PROGRESS'
  | 'UPDATE_WALLET_NAME'
  | 'UPDATE_WALLET_TRANSFER_LIST'

// Actions with no payload:
type NoDataActionName =
  | 'CLOSE_ALL_WALLET_LIST_MODALS'
  | 'CLOSE_CRYPTO_EXEC_CONF_MODAL'
  | 'CLOSE_SELECT_USER'
  | 'DEVELOPER_MODE_OFF'
  | 'DEVELOPER_MODE_ON'
  | 'DISABLE_SCAN'
  | 'DISABLE_WALLET_LIST_MODAL_VISIBILITY'
  | 'DONE_SHIFT_TRANSACTION'
  | 'DUMMY_ACTION_PLEASE_IGNORE'
  | 'EDGE_LOBBY_ACCEPT_FAILED'
  | 'ENABLE_SCAN'
  | 'INVALIDATE_EDGE_LOBBY'
  | 'INVALIDATE_SHIFT_TRANSACTION'
  | 'LOGGED_OUT'
  | 'NEED_FINISH_KYC_OFF'
  | 'NEED_KYC_SETTING'
  | 'NEED_KYC'
  | 'NEED_KYC'
  | 'ON_KYC_TOKEN_SET'
  | 'OPEN_SELECT_USER'
  | 'PASSWORD_USED'
  | 'PLAY_SEND_SOUND'
  | 'PROCESS_EDGE_LOGIN'
  | 'RECEIVED_INSUFFICENT_FUNDS_ERROR'
  | 'SHIFT_COMPLETE'
  | 'SHIFT_ERROR'
  | 'START_CALC_MAX'
  | 'START_SHIFT_TRANSACTION'
  | 'TOGGLE_ADDRESS_MODAL_VISIBILITY'
  | 'TOGGLE_ENABLE_TORCH'
  | 'TOGGLE_SCAN_TO_WALLET_LIST_MODAL'
  | 'TOGGLE_WALLET_LIST_MODAL_VISIBILITY'
  | 'UI/WALLETS/CREATE_WALLET_FAILURE'
  | 'UI/WALLETS/CREATE_WALLET_START'
  | 'UI/WALLETS/CREATE_WALLET_SUCCESS'
  | 'USE_LEGACY_REQUEST_ADDRESS'
  | 'USE_REGULAR_REQUEST_ADDRESS'
  | 'WIPE_KYC_NEED'
  | 'WIPE_KYC_NEED'

export type Action =
  | { type: LegacyActionName, data?: any }
  | { type: NoDataActionName }
  | XPubModalAction
  | CoreContextAction
  | SendLogsAction
  // Actions with known payloads:
  | { type: 'ACCOUNT_ACTIVATION_INFO', data: HandleActivationInfo }
  | { type: 'ACCOUNT_ACTIVATION_PAYMENT_INFO', data: AccountActivationPaymentInfo }
  | { type: 'IS_CHECKING_HANDLE_AVAILABILITY', data: boolean }
  | { type: 'HANDLE_AVAILABLE_STATUS', data: HandleAvailableStatus }
  | {
      type: 'SELECT_FROM_WALLET_CRYPTO_EXCHANGE' | 'SELECT_TO_WALLET_CRYPTO_EXCHANGE',
      data: {
        balanceMessage: string,
        currencyCode: string,
        primaryInfo: GuiCurrencyInfo,
        wallet: GuiWallet
      }
    }
  | { type: 'CONTACTS/LOAD_CONTACTS_SUCCESS', data: { contacts: Array<GuiContact> } }
  | { type: 'NEED_FINISH_KYC', data: { pluginName: string } }
  | { type: 'GENERIC_SHAPE_SHIFT_ERROR', data: string }
  | { type: 'OPEN_WALLET_SELECTOR_MODAL', data: 'from' | 'to' }
  | { type: 'PARSE_URI_SUCCEEDED', data: { parsedUri: EdgeParsedUri } }
  | { type: 'SAVE_EDGE_LOBBY', data: EdgeLobby }
  | { type: 'SET_LOBBY_ERROR', data: string }
  | { type: 'SET_FROM_WALLET_MAX', data: string }
  | {
      type: 'UPDATE_SHIFT_TRANSACTION_FEE',
      data: {
        quote: EdgeSwapQuote,
        toNativeAmount: string,
        toDisplayAmount: string,
        fromNativeAmount: string,
        fromDisplayAmount: string,
        quoteExpireDate: Date | null,
        fee: string
      }
    }
  | { type: 'WALLET_ACCOUNT_ACTIVATION_ESTIMATE_ERROR', data: string }
