/**
 * jQuery Ellipsis Plugin
 *
 * Copyright 2012 Minjie Zha
 */
(function($) {
    $.fn.ellipsize = function(options) {
        options = $.extend({
            'ellipsis': '\u2026',
            'multiline': false
        }, options);

        // Ellipsize the target element.
        function fnEllipsize() {
            var el = $(this);

            if (el.css("overflow") === "hidden") {
                var multiline = options.multiline,
                    ellipsisText = options.ellipsis,
                    // clone the element
                    t = $(this.cloneNode(true))
                        .hide()
                        .css({
                            'position': 'absolute',
                            'overflow': 'visible'
                        })
                        .width(multiline ? el.width() : 'auto')
                        .height(multiline ? 'auto' : el.height());
                el.after(t);

                // functions testing whether the content fits
                function heightFit() { return el.height() >= t.height(); }
                function widthFit() { return el.width() >= t.width(); }
                var fit = multiline ? heightFit : widthFit;

                // if already fits, do nothing
                if(fit()) {
                    t.remove();
                    return;
                }

                // add ellipsis to a specific position
                function addEllipsis(elements, length) {
                    var els = elements.slice(0,length);
                    var dummy = $(document.createElement('div'));
                    for(var i=0; i < els.length; i++) {
                        dummy.append(els.get(i));
                    }
                    dummy.append('<span>' + ellipsisText + '</span>');
                    return dummy.html();
                }

                // using binary search to ellipsize the element
                var c = t;
                while(true) {
                    // text node, we should finally come to here
                    if(c.nodeType == 3) {
                        var text = c.nodeValue,
                            low = 0,
                            high = text.length - 1,
                            ellipsizedText = null;
                        while(low <= high) {
                            var mid = Math.floor((low + high) / 2);
                            var str = text.substring(0, mid+1) + ellipsisText;
                            c.nodeValue = str;

                            if(fit()) {
                                low = mid + 1;
                                ellipsizedText = str;
                            } else {
                                high = mid - 1;
                            }
                        }
                        
                        if(ellipsizedText) {
                            c.nodeValue = ellipsizedText;
                        } else {
                            // if no ellipsizedText found, need to remove the 
                            // parent element and append ellipsis
                            p = $(c).parent();
                            while(p.contents().length == 1) {
                                c = p;
                                p = p.parent();
                            }
                            c.remove();
                            p.append(ellipsisText);
                        }
                        
                        break;
                    } else {
                        var children = c.contents(),
                            low = 0,
                            high = children.length - 1,
                            cutEl;
                        while(low <= high) {
                            var mid = Math.floor((low + high) / 2);
                            c.html(addEllipsis(children, mid+1));

                            if(fit()) {
                                low = mid + 1;
                            } else {
                                // remove the appended ellipsis
                                $(c.contents().last()).remove();
                                // last element is the cut element
                                cutEl = c.contents().get(mid);
                                if(high == mid) {
                                    // prevent infinite loop
                                    break;
                                }
                                high = mid;
                            }
                        }

                        if(cutEl && cutEl.nodeType == 3) {
                            c = cutEl;
                        } else if(cutEl) {
                            c = $(cutEl);
                        } else {
                            // no cut Element found, hopefully this could
                            // never happen
                            break;
                        }
                    }
                }

                // set content and clean up
                el.html(t.html());
                t.remove();
            }
        }

        return this.each(fnEllipsize);
    };
})(jQuery);
