export const Validators = {
  exists: (variable: any): boolean => {
    const doesExist: boolean = !!variable && variable !== null && variable !== undefined
    if (!doesExist) console.log(`Exists?: ${doesExist}`)
    return doesExist
  },
  minLength: (variable: string | Array<any>, length: number): boolean => {
    const hasMinLength: boolean = variable.length >= length
    if (!hasMinLength) console.log(`Has a min length of ${length}?: ${hasMinLength}`)
    return hasMinLength
  },
  isType: (variable: any, type: string): boolean => {
    const hasType = typeof variable === type
    if (!hasType) console.log(`Has type '${type}'?: ${hasType}, it is ${typeof variable}`)
    return hasType
  }
}
