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

    /**
     * 当前显示的视图。颜色列表和调色板二选一
     */
    // public view: 'select' | 'palette' = 'select'

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
        if (this.config.history) {
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
         * 调色板是否支持透明度选择
         */
        alpha: true,
        /**
         * 内置颜色列表
         */
        builtIn: true,
        /**
         * 内置颜色列表 Title
         */
        builtInTitle: '内置颜色列表',
        /**
         * 最近使用的颜色
         */
        history: true,
        /**
         * 最近使用的颜色 Title
         */
        historyTitle: '最近使用的颜色',
        /**
         * 用户自定义颜色列表
         */
        custom: [],
        /**
         * 自定义颜色列表 Title
         */
        customTitle: '自定义颜色列表',
        /**
         * 关键节点的文本
         */
        text: {
            /** 切换至【颜色列表】按钮 */
            toSelect: '颜色列表',
            /** 切换至【调色板】按钮 */
            toPalette: '调色板',
            /** 调色板的【确定】按钮 */
            done: '确定',
            /** 调色板的【取消】按钮 */
            cancel: '取消',
            /** 【最近使用的颜色】没有内容时的提示语 */
            empty: '无',
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

        Object.assign(instance.config, config)

        instance.render()

        return instance
    }

    public render() {
        this.$el.on('click', function (e: Event) {
            e.stopPropagation()
        })
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
        this.select.updateHistoryList().show()
        this.palette.hide()
    }

    public hide() {
        this.$el.removeClass('show')
        this.select.hide()
        this.palette.hide()
        this.config.closed(this)
    }

    public destory() {}
}
