/*effetti knockout*/

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var defaults = {
            startFormat: 'yyyyMMddHHmmss', endFormat: 'dd/MM/yyyy'
            //, datePicker: {}
        };

        var options = $.extend(defaults, allBindings().datepicker);

        var value = $(element).val();

        if (value != '') {
            value = formatDate(new Date(getDateFromFormat(value, options.startFormat)), options.endFormat);
            $(element).val(value);
        }

        $(element).datepicker(options.datePicker);

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor;
            observable($(element).datepicker("getDate"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });

    }
};


/*!
	* Plugin utility
*
* Autore: 					Clementi Marco
* Data Creazione:			09/01/2013 11:14
* Data Ultima Modifica:		08/04/2014 10:20
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

String.IsNullOrEmpty = function () {
    var s = arguments[0];
    return s == undefined || s == null || s == '';
}

String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.contains = function (pattern) {
    return this.indexOf(pattern) > -1;
}

String.prototype.containsCaseInsensitive = function (pattern) {
    return this.toLowerCase().contains(pattern.toLowerCase());
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

//validator custom

jQuery.validator.addMethod("Times", function (value, element, params) {
    var ret = false;

    if (value.length == 5) {
        var hours = value.substring(0, 2);
        var separator = value.substring(2, 3);
        var min = value.substring(3, 5);

        var hoursInt = Number(hours);
        var minInt = Number(min);

        if (separator == ':' && hoursInt >= 0 && hoursInt < 24 && minInt >= 0 && minInt < 60) {
            ret = true;
        }
    }

    return ret;
}, 'errore 3');

jQuery.validator.addMethod("TimesGreater", function (value, element, param) {
    var target = $(param.TargetId);

    var excludeTarget = $(param.ExcludeTarget);

    if (this.settings.onfocusout) {
        target.unbind(".validate-TimesGreater").bind("blur.validate-TimesGreater", function () {
            $(element).valid();
        }).bind("keyup.validate-TimesGreater", function () {
            $(element).valid();
        });
    }

    if (excludeTarget.is(param.ExcludeAttr)) {
        return true;
    } else {

        var targetVal = target.val();

        if (value.length == 5 && targetVal.length == 5) {
            var hours = value.substring(0, 2);
            var min = value.substring(3, 5);
            var hours2 = targetVal.substring(0, 2);
            var min2 = targetVal.substring(3, 5);

            var times1 = Math.round(new Date(2014, 1, 1, Number(hours), Number(min), 0).getTime() / 1000);
            var times2 = Math.round(new Date(2014, 1, 1, Number(hours2), Number(min2), 0).getTime() / 1000);
            return times1 >= times2;
        }

        return false;
    }
}, 'errore 2'
);

jQuery.validator.addMethod("datetimeformat", function (value, element, param) {
    if (value != '') {
        return isDate(value, param.format);
    } else {
        return true;
    }
});

jQuery.validator.unobtrusive.adapters.add(
  'datetimeformat', ['format'], function (options) {
      options.rules['datetimeformat'] = { format: options.params.format };
      options.messages['datetimeformat'] = options.message;
  }
);

jQuery.validator.addMethod("guidformat", function (value, element, param) {
    if (value != '') {
    return value.match('^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$')
    } else {
        return true;
    }
});

jQuery.validator.unobtrusive.adapters.add(
  'guidformat', function (options) {
      options.rules['guidformat'] = {};
      options.messages['guidformat'] = options.message;
  }
);

//PLUGIN maschera input CLEME
//Times
+ function ($) {
    "use strict";

    var selectorPlugin = '[data-clplugin="timesinput"]';

    var charsPermitted = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'];

    var CLTimesInput = function (element) {
        this.element = $(element);
    }

    CLTimesInput.prototype.validateTimes = function () {
        var $this = this.element;
        var defaults = {
            ErrorMessage: 'HH:mm',
            Mandatory: false
        };

        var options = defaults;

        if ($this.attr('data-clplugin-options')) {
            options = $.extend(defaults, JSON.parse($this.attr('data-clplugin-options')));
        }

        var value = $this.val();

        var ret = false;

        if (value.length == 5) {
            var hours = value.substring(0, 2);
            var separator = value.substring(2, 3);
            var min = value.substring(3, 5);

            var hoursInt = Number(hours);
            var minInt = Number(min);

            if (separator == ':' && hoursInt >= 0 && hoursInt < 24 && minInt >= 0 && minInt < 60) {
                ret = true;
            }
        }
        else if (options.Mandatory == false && value.length == 0) {
            ret = true;
        }

        if (ret) {
            $this.removeClass('ErrorValidationCL');
            $this.popover('destroy');
        } else {
            if (options.ErrorMessage) {
                $this.popover({ placement: 'top', content: options.ErrorMessage, trigger: 'hover' });
                $this.popover('show');
            }
            $this.addClass('ErrorValidationCL');
        }
    }

    $.fn.clTimesInput = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('cl.timeOk');

            if (!data) {
                $this.data('cl.timeOk', (data = new CLTimesInput(this)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    }

    $.fn.clTimesInput.Constructor = CLTimesInput;

    //function

    $(document).on('focusout.cl.timeOk.data-api', selectorPlugin, function (e) {
        $(this).clTimesInput('validateTimes');
    })

    $(document).on('keypress.cl.timeOk.data-api', selectorPlugin, function (e) {
        var $this = $(this);
        var value = $this.val();
        var char = String.fromCharCode(e.charCode);


        if (value.length == 5) {
            e.preventDefault();
        }
        else if (value.length == 2 && char != ':') {
            $this.val(value + ':');
        }

        if ($.inArray(char, charsPermitted) < 0 || (char == ':' && value.indexOf(":") > 0)) {
            e.preventDefault();
        }
    })

}(window.jQuery);



/*Plugin Input image selector*/
+ function ($) {
    "use strict";

    var defaultOptions = {
        inputRef: 'inputRef'
    };

    var options = defaultOptions;

    var selectorPlugin = '[data-clplugin="imageSelector"]';

    var popInSelector = '#popInSelectImageCl';
    var accordionImageSelector = 'accordionImageSelector';
    var ddlFolderSelector = 'ddlpopInSelectImageClUFolders';
    var inputFileSelector = 'popInSelectImageClUInputFile';
    var accordionImageThumb = 'accordionImageThumb';
    var loadFileSelector = 'popInSelectImageClUInputFileLoadCLick';

    var htmlPanelTemplate = '';
    htmlPanelTemplate += '<div class="panel panel-default">';
    htmlPanelTemplate += '  <div class="panel-heading">';
    htmlPanelTemplate += '      <h4 class="panel-title">';
    htmlPanelTemplate += '          <a data-toggle="collapse" data-parent="#' + accordionImageSelector + '"   href="#{0}" pathFolder="{0}">';
    htmlPanelTemplate += '              <img src="{1}" height="20px" />';
    htmlPanelTemplate += '              {0}';
    htmlPanelTemplate += '          </a>';
    htmlPanelTemplate += '      </h4>';
    htmlPanelTemplate += '  </div>';
    htmlPanelTemplate += '  <div id="{0}" class="panel-collapse collapse">';
    htmlPanelTemplate += '      <div class="panel-body threeViewImages_FolderPanel ">';
    htmlPanelTemplate += '          <ul class="threeViewImages_Folder">';
    htmlPanelTemplate += '          </ul>';
    htmlPanelTemplate += '      </div>';
    htmlPanelTemplate += '  </div>';
    htmlPanelTemplate += '</div>';

    var imageTemplate = '<li><img src="{0}" class="thumbImage accordionImageThumb" data-toggle="popover" ImageRelPath="{1}" data-html="true" data-content="<div class=\'popoverImage\'><img src=\'{0}\'/></div>"  data-trigger="hover"/></li>';

    var popinTemplate = '';
    popinTemplate += '<div class="modal fade" id="popInSelectImageCl" tabindex="-1" role="dialog" aria-labelledby="popInSelectImageLabelCl" aria-hidden="true">';
    popinTemplate += '  <div class="modal-dialog">';
    popinTemplate += '      <div class="modal-content">';
    popinTemplate += '          <div class="modal-header">';
    popinTemplate += '              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    popinTemplate += '              <h3 class="modal-title" id="popInSelectImageLabelCl">Seleziona Immagine</h3>';
    popinTemplate += '          </div>';
    popinTemplate += '          <div class="modal-body">';
    popinTemplate += '              <div class="uploadImageBlock">';
    popinTemplate += '                  <h4>Carica Immagine:</h4>';
    popinTemplate += '                  <select id="{0}" />';
    popinTemplate += '                  <input type="file" name="{1}" id="{1}" />';
    popinTemplate += '                  <a class="btn btn-default popInSelectImageClUInputFileLoadCLick">Carica</a>';
    popinTemplate += '              </div>';
    popinTemplate += '              <div>';
    popinTemplate += '                  <h4>Selezione Immagine:</h4>';
    popinTemplate += '              </div>';
    popinTemplate += '              <div id="accordionImageSelector" class="panel-group SelectImage">';
    popinTemplate += '              </div>';
    popinTemplate += '          </div>';
    popinTemplate += '          <div class="modal-footer">';
    popinTemplate += '              <button type="button" class="btn btn-default" data-dismiss="modal">Chiudi</button>';
    popinTemplate += '          </div>';
    popinTemplate += '          <div class="loader" style="display:none;">';
    popinTemplate += '              <img src="{2}" />';
    popinTemplate += '          </div>';
    popinTemplate += '      </div>';
    popinTemplate += '  </div>';
    popinTemplate += '</div>';

    function OpenLoader() {
        $(String.format('{0} .modal-dialog .modal-content .loader', popInSelector)).css('display', 'block');
    }

    function CloseLoader() {
        $(String.format('{0} .modal-dialog .modal-content .loader', popInSelector)).css('display', 'none');
    }

    function LoadImageSelector() {

        OpenLoader();

        $.getJSON(UrlPluginVariables.GetImageFolders, null, function (data) {

            var htmlResult = '';

            $('#' + ddlFolderSelector).html('');

            $(data).each(function () {
                htmlResult += String.format(htmlPanelTemplate, this.FolderName, UrlPluginVariables.FolderImageUrl, this.FolderPath);
                $('#' + ddlFolderSelector).append(String.format('<option value="{0}">{0}</option>', this.FolderName));
            });

            $('#' + accordionImageSelector).html(htmlResult);

            CloseLoader();
        });
    };

    $(document).on('click.data-parent' + accordionImageSelector, "[data-parent=#" + accordionImageSelector + "]", function (event) {

        var pathFolder = $(this).attr('pathFolder');
        var href = $(this).attr('href');

        OpenLoader();

        $.getJSON(UrlPluginVariables.GetImagesFolder + pathFolder, null, function (data) {

            var htmlResult = '';

            $(data).each(function () {
                htmlResult += String.format(imageTemplate, this.ImageUrl, this.ImageRelPath);
            });

            $('#' + accordionImageSelector).find(href).find('ul').html(htmlResult);

            $("[data-toggle=popover]").popover();

            CloseLoader();
        });
    });

    $(document).on('click.data-clplugin.imageSelector' + accordionImageSelector, selectorPlugin, function (event) {
        if ($(popInSelector).length < 1) {
            $(body).append(String.format(popinTemplate, ddlFolderSelector, inputFileSelector, UrlPluginVariables.LoaderImage));
        }

        var $this = $(this);

        options = defaultOptions;

        if ($this.attr('data-clplugin-options')) {
            options = $.extend(defaultOptions, JSON.parse($this.attr('data-clplugin-options')));
        }

        LoadImageSelector();
        $(popInSelector).modal('show');
    });

    $(document).on('click.data-clplugin.imageSelector' + accordionImageThumb, '.' + accordionImageThumb, function (event) {
        var $this = $(this);
        $(options.inputRef).val($this.attr('ImageRelPath'));
        $(options.inputRef).attr('data-content', String.format('<div class=\'popoverImage\'><img src=\'{0}\'/></div>', $this.attr('src')));
        $(popInSelector).modal('hide');
    });

    $(document).on('click.data-clplugin.imageSelector' + loadFileSelector, '.' + loadFileSelector, function (event) {
        var $this = $(this);

        var data = new FormData();

        jQuery.each($('#' + inputFileSelector)[0].files, function (i, file) {
            data.append('file-' + i, file);
        });

        data.append('Folder', $('#' + ddlFolderSelector).val());

        $.ajax({
            type: "POST",
            url: UrlPluginVariables.UploadImage,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                OpenLoader();
            },
            complete: function () {
                CloseLoader();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(String.format('Il caricamento ha generato un errore.\r\nTextStatus: {1}\r\nErrorThrown: {2}', jqXHR.responseText, textStatus, errorThrown));
            },
            success: function (data) {
                if (data.StatusCode == 'KO') {
                    alert(data.Message);
                }
                else {
                    LoadImageSelector();
                }
            },
        });
    });

}(window.jQuery);

//pager knockout

(function (ko) {
    var numericObservable = function (initialValue) {
        var _actual = ko.observable(initialValue);

        var result = ko.dependentObservable({
            read: function () {
                return _actual();
            },
            write: function (newValue) {
                var parsedValue = parseFloat(newValue);
                _actual(isNaN(parsedValue) ? newValue : parsedValue);
            }
        });

        return result;
    };

    function Pager(totalItemCount) {
        var self = this;
        self.CurrentPage = numericObservable(1);
        self.TotalItemCount = ko.computed(totalItemCount);
        self.PageSize = numericObservable(20);
        self.PageSlide = numericObservable(3);

        self.LastPage = ko.computed(function () {
            return Math.floor((self.TotalItemCount() - 1) / self.PageSize()) + 1;
        });

        self.HasNextPage = ko.computed(function () {
            return self.CurrentPage() < self.LastPage();
        });

        self.HasPrevPage = ko.computed(function () {
            return self.CurrentPage() > 1;
        });

        self.FirstItemIndex = ko.computed(function () {
            return self.PageSize() * (self.CurrentPage() - 1) + 1;
        });

        self.LastItemIndex = ko.computed(function () {
            return Math.min(self.FirstItemIndex() + self.PageSize() - 1, self.TotalItemCount());
        });

        self.ThisPageCount = ko.computed(function () {
            var mod = self.LastItemIndex() % self.PageSize();
            if (mod > 0) return mod;
            return self.PageSize();
        });

        self.Pages = ko.computed(function () {
            var pageCount = self.LastPage();
            var pageFrom = Math.max(1, self.CurrentPage() - self.PageSlide());
            var pageTo = Math.min(pageCount, self.CurrentPage() + self.PageSlide());
            pageFrom = Math.max(1, Math.min(pageTo - 2 * self.PageSlide(), pageFrom));
            pageTo = Math.min(pageCount, Math.max(pageFrom + 2 * self.PageSlide(), pageTo));

            var result = [];
            for (var i = pageFrom; i <= pageTo; i++) {
                result.push(i);
            }
            return result;
        });
    }

    ko.pager = function (totalItemCount) {
        var pager = new Pager(totalItemCount);
        return ko.observable(pager);
    };
}(ko));