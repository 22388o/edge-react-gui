// @flow
// globals spec
// import ENV from '../env.json'

type data = Array<{
  wallet: string,
  id: string,
  currencyCode: string
}>

export const helpers = (spec: any) => ({
  resolveModal: async (modalName: string, returnValue: string) => {
    const modal = await spec.findComponent(modalName)
    return await modal.props.bridge.resolve(returnValue)
  },
  getWalletListCodes: async (walletListName: string): Promise<data> => {
    const walletList = await spec.findComponent(walletListName)
    console.log('walletList', walletList.data)
    return walletList.props.data
  },

  longPress: async (walletName: string) => {
    const row = await spec.findComponent(walletName)
    row.props.onPress()
  }
})
