// import { helpers } from './helpers.js'

export default function (spec) {
  // const help = helpers(spec)
  spec.describe('Send crypto', function () {
    spec.it('From wallet', async function () {
      await spec.pause(20000)
      // await spec.press('MenuTab.pluginBuy')
      // await spec.pause(500)
      // const rows = await help.getWalletListCodes('WalletList.WalletId')
      // for (const row of rows) {
      // await spec.press(row.id)
      await spec.pause(500)
      await spec.press('TransactionListTop.SendButton')
      await spec.pause(500)
      await spec.press('AddressTile.SendEnterAddress')
      await spec.pause(500)
      await spec.fillIn('AddressModal.EnterAddress', '0xceeaf7d1c6da9d1877e4f6e03197c820def9367c')
      await spec.pause(500)
      await spec.press('AddressModal.SubmitAddress')
      // submit
      await spec.pause(500)
      await spec.press('SendScene.OpenFlipInput')
      await spec.pause(500)
      await spec.fillIn('FlipInput.SendEnterFiatAmount', '40')
      await spec.pause(500)
      // }
    })
  })
}
