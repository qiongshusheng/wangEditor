/**
 * @author 翠林
 * @deprecated 颜色列表生成
 */

import { ColorData, ColorGroup } from '../../types'

export function colorGroupTPL(colors: ColorGroup) {
    const doms = colors.map(
        color =>
            `<i class="we-color" style="background-color: ${color};" data-color="${color}"></i>`
    )
    return `<div class="we-color-group">${doms.join('')}</div>`
}

export default function colorTPL(colors: ColorData, title: string) {
    const doms = []
    if (colors.length) {
        if (Array.isArray(colors[0])) {
            ;(colors as ColorGroup[]).forEach(group => {
                doms.push(colorGroupTPL(group))
            })
        } else {
            doms.push(colorGroupTPL(colors as ColorGroup))
        }
    }
    return `
<fieldset class="we-selection">
    <legend class="we-selection-title">${title}</legend>
    <div class="we-selection-main">${doms.join('')}</div>
</fieldset>`
}
