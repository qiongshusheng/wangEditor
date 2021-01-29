/**
 * @author 翠林
 * @deprecated 初始化颜色选择器
 */

import FontColorPicker from '..'
import ColorPicker from '../../../editor/color-picker'

export default function initPicker(menu: FontColorPicker) {
    const picker = ColorPicker.create({
        done: menu.command,
        append: menu.$elem,
    })
    picker.css('z-index', menu.editor.zIndex.get('panel'))
    return picker
}
