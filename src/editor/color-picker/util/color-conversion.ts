/**
 * @author 翠林
 * @deprecated 颜色转换
 */

/**
 * RGBA 转 HEX
 * @param r RGBA 的 R
 * @param g RGBA 的 G
 * @param b RGBA 的 B
 * @param a RGBA 的 A
 */
export function RGBAToHEX(r: number, g: number, b: number, a: number = 1) {
    const hex = `#${((1 << 24) + r * (1 << 16) + g * (1 << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`
    return a == 1 ? hex : `${hex}${a.toString(16).toUpperCase().slice(2, 4) || 'FF'}`
}

/**
 * HEX 转 RGBA
 * https://www.rapidtables.com/convert/color/hex-to-rgb.html
 * @param hex HEX
 */
export function HEXToRGBA(hex: string) {
    const rgba = { r: 0, g: 0, b: 0, a: 1 }
    if (hex.charAt(0) === '#') {
        hex = hex.substring(1, hex.length)
    }
    if ([3, 6, 8].indexOf(hex.length) === -1) {
        throw new Error('无效的 HEX 值')
    }
    if (hex.length === 3) {
        rgba.r = parseInt(hex.substring(0, 1).repeat(2), 16)
        rgba.g = parseInt(hex.substring(1, 2).repeat(2), 16)
        rgba.b = parseInt(hex.substring(2, 3).repeat(2), 16)
    } else {
        rgba.r = parseInt(hex.substring(0, 2), 16)
        rgba.g = parseInt(hex.substring(2, 4), 16)
        rgba.b = parseInt(hex.substring(4, 6), 16)
    }
    if (hex.length === 8) {
        rgba.a = parseFloat((parseInt(hex.substring(6, 8), 16) / 255).toFixed(2))
    }
    return rgba
}

/**
 * RGB 转 HSV
 * https://www.rapidtables.com/convert/color/rgb-to-hsV.html
 * @param r RGB 的 R
 * @param g RGB 的 G
 * @param b RGB 的 B
 */
export function RGBToHSV(r: number, g: number, b: number) {
    const hsv = { h: 0, s: 100, v: 100 }
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const c = max - min
    if (c === 0) {
        hsv.h = 0
    } else if (max === r) {
        hsv.h = ((g - b) / c) % 6
    } else if (max === g) {
        hsv.h = (b - r) / c + 2
    } else {
        hsv.h = (r - g) / c + 4
    }
    hsv.h *= 60
    if (hsv.h < 0) {
        hsv.h += 360
    }
    hsv.v = max
    hsv.s = hsv.v === 0 ? 0 : c / hsv.v
    hsv.s *= 100
    hsv.v *= 100
    return hsv
}

/**
 * HSV 转 RGB
 * https://www.rapidtables.com/convert/color/hsv-to-rgb.html
 * @param h HSV 的 H
 * @param s HSV 的 S
 * @param v HSV 的 V
 */
export function HSVToRGB(h: number, s: number, v: number) {
    const rgb = { r: 0, g: 0, b: 0 }
    if (h < 0) h = 0
    if (s < 0) s = 0
    if (v < 0) v = 0
    if (h >= 360) h = 359
    if (s > 100) s = 100
    if (v > 100) v = 100
    s /= 100.0
    v /= 100.0
    const C = v * s
    const hh = h / 60.0
    const X = C * (1.0 - Math.abs((hh % 2) - 1.0))
    if (hh >= 0 && hh < 1) {
        rgb.r = C
        rgb.g = X
    } else if (hh >= 1 && hh < 2) {
        rgb.r = X
        rgb.g = C
    } else if (hh >= 2 && hh < 3) {
        rgb.g = C
        rgb.b = X
    } else if (hh >= 3 && hh < 4) {
        rgb.g = X
        rgb.b = C
    } else if (hh >= 4 && hh < 5) {
        rgb.r = X
        rgb.b = C
    } else {
        rgb.r = C
        rgb.b = X
    }
    const m = v - C
    rgb.r += m
    rgb.g += m
    rgb.b += m
    rgb.r *= 255
    rgb.g *= 255
    rgb.b *= 255
    rgb.r = Math.round(rgb.r)
    rgb.g = Math.round(rgb.g)
    rgb.b = Math.round(rgb.b)
    return rgb
}
