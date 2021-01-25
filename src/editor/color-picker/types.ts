/**
 * 对象类型数据
 */
export interface Data {
    [propName: string]: any
}

export type ColorGroup = string[]

export type ColorData = ColorGroup | ColorGroup[]

export interface Config {
    builtIn: {
        show: boolean
        title: string
    }
    history: {
        show: boolean
        title: string
    }
    custom: {
        color: ColorData
        title: string
    }
    closed: (color: string) => void
    done: (color: string) => void
    cancel: (color: string) => void
    change: (color: string) => void
}

export interface UserConfig {
    builtIn?:
        | Boolean
        | {
              show?: boolean
              title?: string
          }
    history?:
        | Boolean
        | {
              show?: boolean
              title?: string
          }
    custom?: {
        color: ColorData
        title: string
    }
    closed?: (color: string) => void
    done: (color: string) => void
    cancel?: (color: string) => void
    change?: (color: string) => void
}
