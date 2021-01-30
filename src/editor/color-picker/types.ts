/**
 * 对象类型数据
 */

import ColorPicker from '.'
import { DomElementSelector } from '../../utils/dom-core'
export interface Data {
    [propName: string]: any
}

export interface Text {
    toSelect: string
    toPalette: string
    done: string
    cancel: string
    empty: string
}

export type ColorGroup = string[]

export type ColorData = ColorGroup | ColorGroup[]

export interface Config {
    alpha: boolean
    builtIn: boolean
    builtInTitle: string
    history: boolean
    historyTitle: string
    custom: ColorData
    customTitle: string
    text: Text
    append: DomElementSelector
    closed: (picker: ColorPicker) => void
    done: (color: string) => void
    cancel: (color: string) => void
    change: (color: string) => void
}

export interface UserConfig {
    alpha?: boolean
    builtIn?: boolean
    builtInTitle?: string
    history?: boolean
    historyTitle?: string
    custom?: ColorData
    customTitle?: string
    text?: Text
    append?: DomElementSelector
    closed?: (picker: ColorPicker) => void
    done: (color: string) => void
    cancel?: (color: string) => void
    change?: (color: string) => void
}
