// // @flow

// import { useCavy } from 'cavy'
// import { createContext, useContext, useEffect} from 'react'

// export type TestReferee = (idOrComponent: string | any) => TestReferee | string

// export const makeTestReferee = (generateTestHook: (id: string, ref?: any) => (ref: any) => any, id: string): TestReferee => {
//   let scope = id
//   const testReferee: TestReferee = idOrComponent => {
//     if (typeof idOrComponent === 'string') {
//       scope = `${id}.${idOrComponent}`
//       return testReferee
//     }
//     return generateTestHook(scope)(idOrComponent)
//   }
//   return testReferee
// }

// const TestRefereeContext = createContext<{ currentTestReferee: TestReferee | null }>({
//   currentTestReferee: null,
// })

// export const useTestReferee = (id: string) => {
//   const generateTestHook = useCavy()
//   const ctx = useContext(TestRefereeContext)

//   const parentTestReferee = ctx.currentTestReferee
//   const testReferee = parentTestReferee != null ? parentTestReferee(id) as TestReferee : makeTestReferee(generateTestHook, id)

//   // Set currentTestReferee to testReferee for child components
//   ctx.currentTestReferee = testReferee

//   // componentDidMount
//   useEffect(() => {
//     // Revert testReferee to parentTestReferee
//     ctx.currentTestReferee = parentTestReferee
//   }, [])

//   return testReferee
// }

///////////////////////////

// // @flow

// import { useCavy } from 'cavy'

// export type TestReferee = (idOrComponent: string | any) => TestReferee | string

// export const makeTestReferee = (generateTestHook: (id: string, ref?: any) => (ref: any) => any, id: string): TestReferee => {
//   let scope = id
//   const testReferee: TestReferee = idOrComponent => {
//     if (typeof idOrComponent === 'string') {
//       scope = `${id}.${idOrComponent}`
//       return testReferee
//     }
//     return generateTestHook(scope)(idOrComponent)
//   }
//   return testReferee
// }

// export const useTestReferee = (id: string) => {
//   const generateTestHook = useCavy()
//   const testReferee = makeTestReferee(generateTestHook, id)
//   return testReferee
// }
