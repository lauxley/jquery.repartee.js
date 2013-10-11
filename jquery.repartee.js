/*
 * The goal is to easily change the urls of the images in a page, if need be.
 * this library does not contain any form of url logic, 
 * it only handles the transparent loading and displaying from the new source of the image. * 
 * 
 * Usage:
 * $('img').repartee(url_pattern_callback, [optional_comparaison_function]);
 * 
 * For more docs, see https://github.com/lauxley/jquery.repartee.js
 * 
 */

// patch ie8<
// can't patch the prototype for naturalWidth because setting a property would be too complex for every IE versions
// using a custom method instead
var dummy = new Image();
if (dummy.naturalWidth == undefined) {
    HTMLImageElement.prototype.realWidth = function() {
        var el = this;
        if (el._realWidth == undefined) {
            var img = new Image();
            img.src = this.src;
            el._realWidth = img.width;
        }
        return el._realWidth;
    };
} else {
    HTMLImageElement.prototype.realWidth = function() {
        return this.naturalWidth;
    };
}

(function($) {
jQuery.fn.repartee = function(url_pattern_callback, comparaison_function) {
    var default_comparaison_function = function(source_width, display_width) {
        // the default comparaison function test if the source image is at least 20% too small
        return display_width - source_width / display_width * 100 > 20;
    };
    var cmp = comparaison_function || default_comparaison_function;

    var load_new_img = function(img) {
        var $img = $(img);
        var rpl = new Image();
        $(rpl).on('load', function() {
            $img.attr('src', rpl.src);
            $(rpl).remove();
            return;
        });
        rpl.src = url_pattern_callback($img, img.realWidth(), $img.width());
        $img.trigger('repartee-src-changed');
    };

    var process_img = function(ev, img) {
        var $img = $(img);
        if($img.width() && cmp(img.realWidth(), $img.width())) {
            load_new_img(img);
        }
    };

    $.each(this, function(i, img) {
        $(img).on('repartee-check', function(ev) { process_img(ev, ev.target); });
        if (img.complete) {
            $(img).trigger('repartee-check');
        } else {
            $(img).on('load', process_img);
        }
    });

    return this;
};
})(jQuery);