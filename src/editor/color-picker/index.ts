/**
 * @author 翠林
 * @deprecated 颜色选择器
 */

import '../../assets/style/color-picker.less'
import { Config, UserConfig } from './types'
import { colorRegex, EMPTY_FN } from '../../utils/const'
import Select from './select'
import Palette from './palette'
import $, { DomElement } from '../../utils/dom-core'

export default class ColorPicker {
    public $el: DomElement
    /**
     * 颜色列表
     */
    public select: Select

    /**
     * 调色板
     */
    public palette: Palette

    constructor() {
        this.$el = $(`<div class="we-color-picker"></div>`)
        this.select = new Select(this)
        this.palette = new Palette(this)
    }

    public get history(): string[] {
        const history = localStorage.getItem('wech')
        if (history && /^\[.*\]$/.test(history)) {
            return JSON.parse(history)
        }
        return []
    }

    public set history(value: string[]) {
        localStorage.setItem('wech', JSON.stringify(value.slice(0, 20)))
    }

    /**
     * 保存颜色值
     * @param value color 值
     */
    public record(value: string) {
        if (this.config.history.show) {
            value = value.toLowerCase()
            if (colorRegex.test(value)) {
                const history = this.history
                const index = history.indexOf(value)
                if (index > -1) {
                    history.splice(index, 1)
                }
                history.unshift(value)
                this.history = history
            }
        }
    }

    /**
     * 配置
     */
    public config: Config = {
        /**
         * 内置颜色列表
         */
        builtIn: {
            show: true,
            title: '内置颜色列表',
        },
        /**
         * 历史选色
         */
        history: {
            show: true,
            title: '最近使用的颜色',
        },
        /**
         * 用户自定义颜色列表
         */
        custom: {
            color: [],
            title: '自定义颜色列表',
        },
        /**
         * 颜色选择器的父容器
         */
        append: document.body,
        /**
         * 颜色选择器关闭的回调
         */
        closed: EMPTY_FN,
        /**
         * 确认选择某一颜色的回调
         */
        done: EMPTY_FN,
        /**
         * 未选色而关闭选择器的回调
         */
        cancel: EMPTY_FN,
        /**
         * 调色板颜色变化的回调
         */
        change: EMPTY_FN,
    }

    public static create(config: UserConfig) {
        const instance = new ColorPicker()

        if ('builtIn' in config) {
            if (typeof config.builtIn === 'object') {
                Object.assign(instance.config.builtIn, config.builtIn)
            } else {
                instance.config.builtIn.show = !!config.builtIn
            }
        }

        if ('history' in config) {
            if (typeof config.history === 'object') {
                Object.assign(instance.config.history, config.history)
            } else {
                instance.config.builtIn.show = !!config.history
            }
        }

        if (typeof config.custom === 'object') {
            Object.assign(instance.config.custom, config.custom)
        }

        if (config.append) {
            instance.config.append = config.append
        }

        if (typeof config.closed === 'function') {
            instance.config.closed = config.closed
        }

        if (typeof config.done === 'function') {
            instance.config.done = config.done
        }

        if (typeof config.cancel === 'function') {
            instance.config.cancel = config.cancel
        }

        instance.render()

        return instance
    }

    public render() {
        $(this.config.append).append(this.$el)
        this.select.render()
        this.palette.render()
    }

    css(key: string, value: string | number) {
        this.$el.css(key, value)
        return this
    }

    public show() {
        this.$el.addClass('show')
        this.select.show()
        this.palette.hide()
    }

    public hide() {
        this.$el.removeClass('show')
        this.select.hide()
        this.palette.hide()
    }

    public destory() {
        this.select.destory()
        this.palette.destory()
    }
}
