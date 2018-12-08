var convertToString = function(arr) {
    return arr.join(',').replace(p2s, '$1');
};
var p2s = /,?([achlmqrstvxz]),?/gi;
var pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig;
var pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig;

function convertToPath(oldElem, rectAsArgs) {
    if (!oldElem) return;
    // Create new path element
    var path = document.createElementNS(svgNS, 'path');
    // All attributes that path element can have
    var attrs = ['requiredFeatures', 'requiredExtensions', 'systemLanguage', 'id', 'xml:base', 'xml:lang', 'xml:space', 'onfocusin', 'onfocusout', 'onactivate', 'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onload', 'alignment-baseline', 'baseline-shift', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cursor', 'direction', 'display', 'dominant-baseline', 'enable-background', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'image-rendering', 'kerning', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'overflow', 'pointer-events', 'shape-rendering', 'stop-color', 'stop-opacity', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'unicode-bidi', 'visibility', 'word-spacing', 'writing-mode', 'class', 'style', 'externalResourcesRequired', 'transform', 'd', 'pathLength'];
    // Copy attributes of oldElem to path
    var attrName, attrValue;
    for (var i = 0, ilen = attrs.length; i < ilen; i++) {
        var attrName = attrs[i];
        var attrValue = oldElem.getAttribute(attrName);
        if (attrValue) path.setAttribute(attrName, attrValue);
    }
    var d = '';
    var valid = function(val) {
        return !(typeof(val) !== 'number' || val == Infinity || val < 0);
    }
    // Possibly the cubed root of 6, but 1.81 works best
    var num = 1.81;
    var tag = oldElem.tagName;
    switch (tag) {
        case 'ellipse':
        case 'circle':
            var rx = +oldElem.getAttribute('rx'),
                ry = +oldElem.getAttribute('ry'),
                cx = +oldElem.getAttribute('cx'),
                cy = +oldElem.getAttribute('cy');
            if (tag == 'circle') {
                rx = ry = +oldElem.getAttribute('r');
            }
            d += convertToString([
                ['M', (cx - rx), (cy)],
                ['C', (cx - rx), (cy - ry / num), (cx - rx / num), (cy - ry), (cx), (cy - ry)],
                ['C', (cx + rx / num), (cy - ry), (cx + rx), (cy - ry / num), (cx + rx), (cy)],
                ['C', (cx + rx), (cy + ry / num), (cx + rx / num), (cy + ry), (cx), (cy + ry)],
                ['C', (cx - rx / num), (cy + ry), (cx - rx), (cy + ry / num), (cx - rx), (cy)],
                ['Z']
            ]);
            break;
        case 'path':
            d = oldElem.getAttribute('d');
            break;
        case 'line':
            var x1 = oldElem.getAttribute('x1'),
                y1 = oldElem.getAttribute('y1');
            x2 = oldElem.getAttribute('x2');
            y2 = oldElem.getAttribute('y2');
            d = 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
            break;
        case 'polyline':
            d = 'M' + oldElem.getAttribute('points');
            break;
        case 'polygon':
            d = 'M' + oldElem.getAttribute('points') + 'Z';
            break;
        case 'rect':
            var rx = +oldElem.getAttribute('rx'),
                ry = +oldElem.getAttribute('ry'),
                b = oldElem.getBBox(),
                x = b.x,
                y = b.y,
                w = b.width,
                h = b.height;
            // Validity checks from http://www.w3.org/TR/SVG/shapes.html#RectElement:
            // If neither ‘rx’ nor ‘ry’ are properly specified, then set both rx and ry to 0. (This will result in square corners.)
            if (!valid(rx) && !valid(ry)) rx = ry = 0;
            // Otherwise, if a properly specified value is provided for ‘rx’, but not for ‘ry’, then set both rx and ry to the value of ‘rx’.
            else if (valid(rx) && !valid(ry)) ry = rx;
            // Otherwise, if a properly specified value is provided for ‘ry’, but not for ‘rx’, then set both rx and ry to the value of ‘ry’.
            else if (valid(ry) && !valid(rx)) rx = ry;
            else {
                // If rx is greater than half of ‘width’, then set rx to half of ‘width’.
                if (rx > w / 2) rx = w / 2;
                // If ry is greater than half of ‘height’, then set ry to half of ‘height’.
                if (ry > h / 2) ry = h / 2;
            }
            if (!rx && !ry) {
                d += convertToString([
                    ['M', x, y],
                    ['L', x + w, y],
                    ['L', x + w, y + h],
                    ['L', x, y + h],
                    ['L', x, y],
                    ['Z']
                ]);
            } else if (rectAsArgs) {
                d += convertToString([
                    ['M', x + rx, y],
                    ['H', x + w - rx],
                    ['A', rx, ry, 0, 0, 1, x + w, y + ry],
                    ['V', y + h - ry],
                    ['A', rx, ry, 0, 0, 1, x + w - rx, y + h],
                    ['H', x + rx],
                    ['A', rx, ry, 0, 0, 1, x, y + h - ry],
                    ['V', y + ry],
                    ['A', rx, ry, 0, 0, 1, x + rx, y]
                ]);
            } else {
                var num = 2.19;
                if (!ry) ry = rx
                d += convertToString([
                    ['M', x, y + ry],
                    ['C', x, y + ry / num, x + rx / num, y, x + rx, y],
                    ['L', x + w - rx, y],
                    ['C', x + w - rx / num, y, x + w, y + ry / num, x + w, y + ry],
                    ['L', x + w, y + h - ry],
                    ['C', x + w, y + h - ry / num, x + w - rx / num, y + h, x + w - rx, y + h],
                    ['L', x + rx, y + h],
                    ['C', x + rx / num, y + h, x, y + h - ry / num, x, y + h - ry],
                    ['L', x, y + ry],
                    ['Z']
                ]);
            }
            break;
        default:
            //path.parentNode.removeChild(path);
            break;
    }
    if (d) path.setAttribute('d', d);
    // Replace the current element with the converted one.
    return path;
};
