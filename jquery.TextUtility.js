/*!
	* Plugin utility validazione input
*
* Autore: 					Clementi Marco
* Data Creazione:			09/01/2013 11:14
* Data Ultima Modifica:		22/07/2013 14:51
*
*/
(function ($) {
    $.fn.extend({
        TextLimit: function (options) {
            var defaults = {
                CharLimit: 0,
                DisablePaste: false
            };
            var options = $.extend(defaults, options);

            $(this).keypress(function (e) {
                CheckTextLength(this, options.CharLimit, e);
            });

            $(this).bind('paste', function (e) {
                if (options.DisablePaste) {
                    e.preventDefault();
                } else {
                    CheckTextLength(this, CharLimit, e);
                }
            });

            $(this).bind('blur', function (e) {

                var text = $(this).val();

                if (options.CharLimit > 0) {
                    if (text.length > options.CharLimit) {
                        text = text.substring(0, options.CharLimit);
                    }
                }

                $(this).val(text);
            });
        },
        OnlyNumber: function (options) {
            var defaults = {
                CharLimit: 0,
                Integer: false,
                Natural: false,
                DisablePaste: false
            };
            var options = $.extend(defaults, options);

            $(this).keypress(function (e) {
                if (options.CharLimit > 0) {
                    CheckTextLength(this, options.CharLimit, e);
                }

                if (options.Integer == false) {
                    if ((e.which == 39 || e.which == 44 || e.which == 46) &&
                        ($(this).val().indexOf(String.fromCharCode(39)) === -1 && $(this).val().indexOf(String.fromCharCode(44)) === -1 && $(this).val().indexOf(String.fromCharCode(46)) === -1)) {
                        return;
                    }
                }

                if (options.Natural == false) {
                    if ((e.which == 43 || e.which == 45) &&
                        ($(this).val().indexOf(String.fromCharCode(43)) === -1 && $(this).val().indexOf(String.fromCharCode(45)) === -1)) {
                        return;
                    }
                }

                if (e.which < 48 || e.which > 57) {
                    e.preventDefault();
                }
            });

            if (options.DisablePaste) {
                $(this).bind('paste', function (e) { e.preventDefault(); });
            }

            $(this).bind('blur', function (e) {

                var text = $(this).val();

                if (options.Integer && options.Natural) {
                    text = text.replace(/([^\+{1}\-\d])/g, "");
                }
                else if (options.Integer) {
                    text = text.replace(/\D/g, "");
                }
                else if (options.Natural) {
                    text = text.replace(/([^\+{1}\-\d\.\,])/g, "");
                }

                if (options.CharLimit > 0) {
                    if (text.length > options.CharLimit) {
                        text = text.substring(0, options.CharLimit);
                    }
                }

                $(this).val(text);
            });
        }
    });
})(jQuery);

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
}

String.prototype.htmlEncode = function () {
    return String(this)
            .replace(/&/g, '&amp;')
            .replace(/\r\n/g, '<br/>')
            .replace(/\n/g, '<br/>')
            .replace(/\r/g, '<br/>')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

String.prototype.htmlDecode = function () {
    return String(this)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/<br\/>/g, '\r\n');
}

function CheckTextLength(obj, CharLimit, e) {
    var current = $(obj).val().length;
    if (current >= CharLimit) {
        if (e.which != 0 && e.which != 8) {
            e.preventDefault();
        }
    }
}


(function ($) {
    $.fn.extend({
        IsDefined: function () {
            return typeof this != 'undefined' && $(this).length > 0;
        }
    });
})(jQuery);