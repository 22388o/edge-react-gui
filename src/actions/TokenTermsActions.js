// @flow
import type { Disklet } from 'disklet'
import * as React from 'react'
import { sprintf } from 'sprintf-js'

import { ConfirmContinueModal } from '../components/modals/common/ConfirmContinueModal.js'
import { Airship } from '../components/services/AirshipInstance.js'
import { TOKEN_TERMS_AGREEMENT } from '../constants/constantSettings.js'
import s from '../locales/strings.js'
import { config } from '../theme/appConfig.js'

export const approveTokenTerms = async (disklet: Disklet, currencyCode: string) => {
  const title = sprintf(s.strings.token_agreement_modal_title, currencyCode)
  const body = sprintf(s.strings.token_agreement_modal_message, currencyCode, config.appName)
  const filePath = `${currencyCode}-${TOKEN_TERMS_AGREEMENT}`

  try {
    return await disklet.getText(filePath)
  } catch (error) {
    Airship.show(bridge => <ConfirmContinueModal bridge={bridge} title={title} body={body} />).then(() => disklet.setText(filePath, ''))
  }
}
