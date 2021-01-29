/**
 * @author 翠林
 * @deprecated 支持调色板的字体颜色菜单
 */

import Editor from '../../editor'
import ColorPicker from '../../editor/color-picker'
import $ from '../../utils/dom-core'
import BtnMenu from '../menu-constructors/BtnMenu'
import initPicker from './render/init-picker'

export default class FontColorPicker extends BtnMenu {
    public picker: ColorPicker

    public constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="文字颜色">
                <i class="w-e-icon-pencil2"></i>
            </div>`
        )
        super($elem, editor)
        this.picker = initPicker(this)
    }

    public clickHandler() {
        this.picker.show()
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

        const isFont = $selectionElem?.nodeName.toLowerCase() !== 'p'
        const isSameColor = $selectionElem?.getAttribute('color') === value

        if (isEmptySelection) {
            if (isFont && !isSameColor) {
                const $elems = editor.selection.getSelectionRangeTopNodes()
                editor.selection.createRangeByElem($elems[0])
                editor.selection.moveCursor($elems[0].elems[0])
            }
            // 插入空白选区
            editor.selection.createEmptyRange()
        }

        editor.cmd.do('foreColor', value)

        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    public tryChangeActive() {}
}
