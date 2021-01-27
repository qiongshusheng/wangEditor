/**
 * @author 翠林
 * @deprecated 视图
 */

const tpl = `<div class="we-palette">
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
<div class="we-color_alpha" ref="a">
    <div class="we-slider vertical" ref="alpha"></div>
</div>
<div class="we-color-preview">
    <div class="we-view" ref="preview"></div>
    <div class="we-input">
        <input class="value" type="text" value="rgba(255, 255, 255, 1)" ref="input" />
        <label class="pattern" ref="pattern">RGB</label>
    </div>
</div>
<div class="we-color-btns">
    <button type="button" class="btn primary" ref="cancel">取消</button>
    <button type="button" class="btn" ref="done">确认</button>
</div>
</div>`

export default tpl
