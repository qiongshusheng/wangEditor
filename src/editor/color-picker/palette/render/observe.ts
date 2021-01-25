/**
 * @author 翠林
 * @deprecated 监听数据
 *
 * 整体逻辑：
 *  视图改变数据：鼠标拖拽 => 更新滑块定位 => 更新 hsva 的值 => 更新 rgb 的值 => 更新预览色块和输出框的值
 *  数据改变视图：输入框变化 => 更新 rgba 的值和预览色块 => 更新 hsv 的值 => 更新滑块定位
 */

import throttle from 'lodash/throttle'
import Palette from '..'
import { HSVToRGB, RGBToHSV } from '../../util/color-conversion'
import define from '../../util/define'

export default function observe(palette: Palette) {
    const $refs = palette.$el.$refs()

    /**
     * 过滤数据，将数据限定在 0 ~ 1
     * @param value 被过滤的数据
     */
    function between0and1(value: number) {
        if (value > 1) {
            value /= 100
        }
        if (value < 0) {
            value = 0
        }
        value = parseFloat(value.toFixed(2))
        return {
            valid: true,
            data: value,
        }
    }

    /**
     * 滑块定位 - 色度
     */
    define(palette.data.position, 'h', function (value) {
        $refs.hue.css('top', `${value * 100}%`)
        if (palette.forward) {
            palette.data.h = -value
        }
    }, between0and1)

    /**
     * 滑块定位 - 饱和度
     */
    define(palette.data.position, 's', function (value) {
        $refs.sv.css('left', `${value * 100}%`)
        if (palette.forward) {
            palette.data.s = -value
        }
    }, between0and1)

    /**
     * 滑块定位 - 纯度
     */
    define(palette.data.position, 'v', function (value) {
        $refs.sv.css('top', `${value * 100}%`)
        if (palette.forward) {
            palette.data.v = value - 1
        }
    }, between0and1)

    /**
     * 滑块定位 - 透明度
     */
    define(palette.data.position, 'a', function (value) {
        $refs.alpha.css('left', `${value * 100}%`)
        if (palette.forward) {
            palette.data.a = value
        }
    }, between0and1)

    // 转换颜色
    const hsvChange = throttle(() => {
        const { h, s, v } = palette.data
        if (palette.forward) {
            // hsv 转 rgb
            const { r, g, b } = HSVToRGB(h, s, v)
            palette.data.r = r
            palette.data.g = g
            palette.data.b = b
        } else {
            const reg = /\d+(\.\d+)?/
            // 更新 hsv 视图的定位
            palette.data.position.h = h.match(reg)[0] / 360
            palette.data.position.s = s.match(reg)[0] / 100
            palette.data.position.v = v.match(reg)[0] / 100
        }
    }, 25)

    /**
     * 色度（值的范围限定在 -1 ~ 360；-1 ~ 0 表示传入的百分比；0 ~ 360 表示传入的最终值）
     */
    define<number, string>(palette.data, 'h', hsvChange, function (value) {
        if (value >= -1) {
            if (value < 0) {
                value = Math.abs(value * 360)
            }
            value = parseFloat(value.toFixed(1))
            if (value >= 360 || value < 0) {
                value = 0
            }
            return {
                valid: true,
                data: `${value}deg`,
            }
        } else {
            return {
                valid: false,
                data: value,
            }
        }
    })

    /**
     * 将值限定在 0 ~ max 之间
     * @param value 需要被过滤的值（值的范围限定在 -1 ~ max；-1 ~ 0 表示传入的百分比；0 ~ max 表示传入的最终值）
     * @param max 最大值
     * @param template 过滤值后的模板
     */
    function between(value: number, max: number, template?: string) {
        if (value >= -1) {
            if (value < 0) {
                value = Math.abs(value * max)
            }
            value = parseFloat(value.toFixed(1))
            if (value > max) {
                value = max
            }
            return {
                valid: true,
                data: template ? template.replace(/\$/, value.toString()) : value,
            }
        } else {
            return {
                valid: false,
                data: value,
            }
        }
    }

    /**
     * 饱和度（值的范围限定在 -1 ~ 100；-1 ~ 0 表示传入的百分比；0 ~ 100 表示传入的最终值）
     */
    define<number, string>(palette.data, 's', hsvChange, function (value) {
        return between(value, 100, '$%')
    })

    /**
     * 纯度（值的范围限定在 -1 ~ 100；-1 ~ 0 表示传入的百分比；0 ~ 100 表示传入的最终值）
     */
    define<number, string>(palette.data, 'v', hsvChange, function (value) {
        return between(value, 100, '$%')
    })

    const rgbChange = throttle(() => {
        if (palette.forward) {
            // 生成输出框的值
            palette.computedValue()
        } else {
            // rgb 转 hsv
            const { r, g, b } = palette.data
            const { h, s, v } = RGBToHSV(r, g, b)
            palette.data.h = h
            palette.data.s = s
            palette.data.v = v
        }
    }, 25)

    /**
     * RGBA - R
     */
    define(palette.data, 'r', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * RGBA - G
     */
    define(palette.data, 'g', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * RGBA - B
     */
    define(palette.data, 'b', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * RGBA - A
     */
    define(palette.data, 'a', function (value) {
        if (palette.forward) {
            // 视图拖拽：
            rgbChange()
        } else {
            // 代码赋值：更新透明度滑块的定位
            palette.data.position.a = value
        }
    }, between0and1)

    /**
     * 模式切换
     */
    define(palette.data, 'pattern', function (value: string) {
        // 生成新模式下的输出框值
        palette.computedValue()
        // 更新视图中模式切换文字信息
        $refs.pattern.text(value.toUpperCase())
    }, function (value: string) {
        return {
            valid: palette.pattern.indexOf(value) !== -1,
            data: value,
        }
    })

    /**
     * value
     */
    define(palette.data, 'value', function (value: string) {
        if (palette.forward) {
            // 更新输入框
            ;($refs.input.elems[0] as HTMLInputElement).value = value
        }
        // 更新预览色块
        $refs.preview.css('background-color', value)
        palette.picker.config.change(value)
    }, function (value: string) {
        return {
            valid: true,
            data: value,
        }
    })
}
