/**
 * @author 翠林
 * @deprecated 颜色列表
 */

import ColorPicker from '..'
import $, { DomElement } from '../../../utils/dom-core'
import builtInColor from './render/build-in-color'
import colorTPL, { colorGroupTPL } from './render/view'

export default class Select {
    /**
     * 颜色列表的根节点
     */
    public $el: DomElement

    public picker: ColorPicker

    public constructor(picker: ColorPicker) {
        this.picker = picker
        this.$el = $(`<div class="we-selections"></div>`)
        this.$el.on('click', 'i', function (e: MouseEvent) {
            const color = $(e.target).attr('data-color')
            if (color) {
                picker.config.done(color)
                picker.record(color)
                picker.hide()
            }
        })
    }

    /**
     * 渲染颜色列表
     */
    public render() {
        const doms = []
        const { builtIn, history, custom } = this.picker.config
        if (builtIn.show) {
            doms.push(colorTPL(builtInColor, builtIn.title))
        }
        if (custom.color.length) {
            doms.push(colorTPL(custom.color, custom.title))
        }
        if (history.show) {
            doms.push(
                colorTPL(this.picker.history, history.title).replace(
                    'class="we-selection-main"',
                    'class="we-selection-main" ref="history"'
                )
            )
        }
        this.$el.html(doms.join(''))
        $(document.body).append(this.$el)
    }

    /**
     * 更新历史颜色列表
     */
    public updateHistoryList() {
        const $refs = this.$el.$refs
        if ('history' in $refs) {
            ;($refs['history'] as DomElement).html(colorGroupTPL(this.picker.history))
        }
    }

    public show() {}

    public hide() {}

    public destory() {}
}
