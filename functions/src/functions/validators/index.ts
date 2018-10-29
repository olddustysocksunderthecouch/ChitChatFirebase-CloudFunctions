export const Validators = {
  exists: (variable: any): boolean => {
    return variable && variable !== null && variable !== undefined
  },
  minLength: (variable: string | Array<any>, length: number): boolean => {
    return variable.length >= length
  },
  isType: (variable: any, type: string): boolean => {
    return typeof variable === type
  }
}
