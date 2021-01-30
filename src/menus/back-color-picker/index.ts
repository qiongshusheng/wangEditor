/**
 * @author 翠林
 * @deprecated 支持调色板的背景色菜单
 */

import Editor from '../../editor'
import ColorPicker from '../../editor/color-picker'
import $ from '../../utils/dom-core'
import { hexToRgb } from '../../utils/util'
import Menu from '../menu-constructors/Menu'

export default class BackColorPicker extends Menu {
    public picker: ColorPicker

    public constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="文字颜色">
                <i class="w-e-icon-paint-brush" ref="icon"></i>
            </div>`
        )
        super($elem, editor)

        // i18next
        function t(name: string) {
            return editor.i18next.t(`colorPicker.${name}`)
        }

        // 初始化颜色选择器
        this.picker = ColorPicker.create(
            Object.assign(
                { ...this.editor.config.colorPicker },
                {
                    builtInTitle: t('内置颜色列表'),
                    historyTitle: t('最近使用的颜色'),
                    customTitle: t('自定义颜色列表'),
                    text: {
                        toPalette: t('调色板'),
                        toSelect: t('颜色列表'),
                        done: t('确定'),
                        cancel: t('取消'),
                        empty: t('无'),
                    },
                    append: $elem,
                    done: (color: string) => {
                        this.command(color)
                    },
                }
            )
        )

        // 配置颜色选择器的 z-index
        this.picker.css('z-index', this.editor.zIndex.get('panel'))

        // 显示颜色选择器的回调函数
        let show = () => {
            const height = this.$elem.getBoundingClientRect().height
            this.picker.css('margin-top', `${height}px`)
            this.picker.show()
            // 重写 show 函数
            show = () => this.picker.show()
        }

        // 绑定菜单的鼠标悬浮事件
        this.$elem.$ref('icon').on('mouseenter', () => {
            if (this.editor.selection.getRange() !== null) {
                this.$elem.css('z-index', this.editor.zIndex.get('menu'))
                show()
            }
        })

        // 隐藏颜色选择器的回调函数
        const hide = () => {
            this.$elem.css('z-index', 'auto')
            this.picker.hide()
        }

        // 将函数加入对应的钩子中
        this.editor.txt.eventHooks.clickEvents.push(hide)
        this.editor.txt.eventHooks.menuClickEvents.push(hide)
        this.editor.txt.eventHooks.toolbarClickEvents.push(hide)
        this.editor.txt.eventHooks.dropListMenuHoverEvents.push(hide)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const isEmptySelection = editor.selection.isSelectionEmpty()
        const $selectionElem = editor.selection.getSelectionContainerElem()?.elems[0]

        if ($selectionElem == null) return

        const isSpan = $selectionElem?.nodeName.toLowerCase() !== 'p'
        const bgColor = $selectionElem?.style.backgroundColor
        const isSameColor = hexToRgb(value) === bgColor

        if (isEmptySelection) {
            if (isSpan && !isSameColor) {
                const $elems = editor.selection.getSelectionRangeTopNodes()
                editor.selection.createRangeByElem($elems[0])
                editor.selection.moveCursor($elems[0].elems[0])
            }
            // 插入空白选区
            editor.selection.createEmptyRange()
        }

        editor.cmd.do('backColor', value)

        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    public tryChangeActive() {}
}
