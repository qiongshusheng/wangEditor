/**
 * @author 翠林
 * @deprecated 调色板
 */

import ColorPicker from '..'
import { Data } from '../types'
import { RGBAToHEX } from '../util/color-conversion'
import $, { DomElement } from './../../../utils/dom-core'
import observe from './render/observe'
import bindEvent from './render/event'
import tpl from './render/view'

export default class Palette {
    /**
     * 调色板的根节点
     */
    public $el: DomElement

    /**
     * 支持输入的颜色类型
     */
    public pattern = ['rgb', 'hex']

    /**
     * 数据
     */
    public data: Data = {
        // 滑块定位数据
        position: {
            h: 0,
            s: 1,
            v: 1,
            a: 1,
        },
        h: '0deg',
        s: '100%',
        v: '100%',
        r: 255,
        g: 0,
        b: 0,
        a: 1,
        // 当前颜色值的类型。
        pattern: 'rgb',
        // 用于输出的值，这个值的类型由 pattern 决定
        value: 'rgb(255, 0, 0)',
    }

    /**
     * 当前数据变化的模式：
     *  true：视图改变数据（鼠标拖拽 => 更新滑块定位 => 更新 hsva 的值 => 更新 rgb 的值 => 更新预览色块和输出框的值）
     *  false：数据改变视图（输入框变化 => 更新 rgba 的值和预览色块 => 更新 hsv 的值 => 更新滑块定位）
     */
    public forward = true

    public picker: ColorPicker

    public constructor(picker: ColorPicker) {
        this.picker = picker
        this.$el = $('<div></div>')
    }

    public render() {
        this.$el = $(tpl)
        bindEvent(this)
        observe(this)
        $(document.body).append(this.$el)
    }

    /**
     * 生成颜色最终值
     */
    public computedValue() {
        const { r, g, b, a } = this.data
        switch (this.data.pattern) {
            case 'hex':
                this.data.value = RGBAToHEX(r, g, b, a)
                break
            default:
                this.data.value = a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
                break
        }
    }

    public show() {}

    public hide() {}

    public destory() {}
}
