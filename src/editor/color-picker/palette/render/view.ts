/**
 * @author 翠林
 * @deprecated 视图
 */

import { Config } from '../../types'

export default function tpl(config: Config) {
    const alpha = `
<div class="we-color_alpha" ref="a">
    <div class="we-slider vertical" ref="alpha"></div>
</div>`

    return `
<div class="we-palette">
    <div class="we-color_hsv">
        <div class="we-hsv-sv" ref="bg">
            <div class="we-hsv-s"></div>
            <div class="we-hsv-v"></div>
            <div class="we-slider circle" ref="sv"></div>
        </div>
        <div class="we-hsv-h">
            <div class="we-slider across" ref="hue"></div>
        </div>
    </div>
    ${config.alpha ? alpha : ''}
    <div class="we-color-preview">
        <div class="we-view">
            <div class="we-view-color" ref="preview"></div>
        </div>
        <div class="we-input">
            <input class="value" type="text" ref="input" />
            <label class="pattern" ref="pattern">RGB</label>
        </div>
    </div>
    <div class="we-color-btns">
        <button type="button" class="btn primary" ref="switchover">${config.text.toSelect}</button>
        <button type="button" class="btn primary" ref="cancel">${config.text.cancel}</button>
        <button type="button" class="btn" ref="done">${config.text.done}</button>
    </div>
</div>`
}
