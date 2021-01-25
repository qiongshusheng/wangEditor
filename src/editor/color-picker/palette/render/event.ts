/**
 * @author 翠林
 * @deprecated 绑定事件
 */

import Palette from '..'
import { HEXToRGBA } from '../../util/color-conversion'
import drag from '../../util/drag'

export default function bindEvent(palette: Palette) {
    const $refs = palette.$el.$refs()

    // 拖拽绑定 - 色度
    drag($refs.hue, function ({ y, h }) {
        palette.forward = true
        palette.data.position.h = y / h
    })

    // 拖拽绑定 - 饱和度、纯度
    drag($refs.sv, function ({ x, y, w, h }) {
        palette.forward = true
        palette.data.position.s = x / w
        palette.data.position.v = y / h
    })

    // 拖拽绑定 - 透明度
    drag($refs.alpha, function ({ x, w }) {
        palette.forward = true
        palette.data.position.a = x / w
    })

    // 输入绑定
    $refs.input.on('blur', function (e: FocusEvent) {
        palette.forward = false
        let value = (e.target as HTMLInputElement).value.trim()
        // 分析用户的输入
        if (/\^#[0-9a-zA-Z]$/.test(value)) {
            palette.data.value = value
            palette.data.pattern = 'hex'
            const { r, g, b, a } = HEXToRGBA(value)
            palette.data.r = r
            palette.data.g = g
            palette.data.b = b
            palette.data.a = a
        } else if (/^(rgb|RGB)/.test(value)) {
            const rgba = value.match(/\d+(\.\d+)?/g)
            if (rgba && rgba.length > 2) {
                palette.data.value = value
                palette.data.pattern = 'rgb'
                const [r, g, b, a] = rgba.map(n => parseFloat(n))
                palette.data.r = r
                palette.data.g = g
                palette.data.b = b
                palette.data.a = typeof a === 'number' ? a : 1
            }
        }
    })

    // 切换输出值的模式
    $refs.pattern.on('click', function () {
        let index = palette.pattern.indexOf(palette.data.pattern) + 1
        if (index >= palette.pattern.length) {
            index = 0
        }
        palette.data.pattern = palette.pattern[index]
    })

    const picker = palette.picker

    // 取消
    $refs.cancel.on('click', function () {
        picker.hide()
        picker.config.cancel(palette.data.value)
    })

    // 确定
    $refs.done.on('click', function () {
        picker.hide()
        picker.record(palette.data.value)
        picker.config.done(palette.data.value)
    })
}
