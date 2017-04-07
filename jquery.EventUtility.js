/*!
* Plugin per funzioni fondamentali
*
* Autore: 					Clementi Marco
* Data Creazione:			27/01/2012 23:25
* Data Ultima Modifica:		31/08/2012 13:45
*
* Contenuti:	
*	-	CMReady:				$(document).CMReady(hendler) 							-> 		$(document).CMReady(function () { //funzione })
*	-	CMAjaxStart:			$(document).CMAjaxStart(hendler) 						-> 		$(document).CMAjaxStart(function () { //funzione })
*	-	CMAjaxEnd:				$(document).CMAjaxEnd(hendler)							-> 		$(document).CMAjaxEnd(function () { //funzione })
*	-	CMAjaxInitialiaze:		$(document).CMAjaxInitialiaze(hendler) 					-> 		$(document).CMAjaxInitialiaze(function () { //funzione })
*	-	CMPageLoaded:			$(document).CMPageLoaded(hendler) 						-> 		$(document).CMPageLoaded(function () { //funzione })
*	-	CMPageLoading:			$(document).CMPageLoading(hendler) 						-> 		$(document).CMPageLoading(function () { //funzione })
*	-	CMPostBackFull:			$(document).CMPostBackFull('eventName', 'eventArgs')
*   -	CMPostBackAsync:		$(document).CMPostBackAsync('eventName, 'eventArgs'), 
*								$(document).CMPostBackAsync('eventName, 'eventArgs', 'updateprogressID', isClientID) 		*isClientID as boolean
*   -	CMOnLoad:				$(document).CMOnLoad(hendler) 							-> 		$(document).CMOnLoad(function () { //funzione })
* Ordine eventi:
*
*	------- Primo caricamento pagina
*	1) CMPageLoading					{ non percepibile visto che avviene prima del caricamento del dom stesso, utile se necessario valorizzare variabili & co }
*	2) CMReady	& CMPageLoaded			{ alla fine del caricamento del DOM }
*
*	------- Evento runat server in ajax
*
*	1) CMAjaxInitialiaze
*	2) CMAjaxStart
*	3) CMPageLoading
*	-> esecuzione evento runat server
*	4) CMReady & CMPageLoaded
*	5) CMAjaxEnd
*
*
*/

(function ($) {
    $.fn.extend({
        CMReady: function (fn) {
            if (jQuery.isFunction(fn)) {
                $(document).ready(fn);
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(fn);
                }
                return;
            }
        },
        CMAjaxStart: function (fn) {
            if (jQuery.isFunction(fn)) {
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(fn);
                }
                return;
            }
        },
        CMAjaxEnd: function (fn) {
            if (jQuery.isFunction(fn)) {
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(fn);
                }
                return;
            }
        },
        CMAjaxInitialiaze: function (fn) {
            if (jQuery.isFunction(fn)) {
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_initializeRequest(fn);
                }
                return;
            }
        },
        CMPageLoaded: function (fn) {
            if (jQuery.isFunction(fn)) {
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(fn);
                }
                return;
            }
        },
        CMPageLoading: function (fn) {
            if (jQuery.isFunction(fn)) {
                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_pageLoading(fn);
                }
                return;
            }
        },
        CMPostBackFull: function (eventName, eventArgs) {
            if (eventName != undefined && eventName != '') {
                __doPostBack(eventName, eventArgs);
            }
            return;
        },
        CMPostBackAsync: function (eventName, eventArgs) {
            if (eventName != undefined && eventName != '') {

                var prm = Sys.WebForms.PageRequestManager.getInstance();

                if (!Array.contains(prm._asyncPostBackControlIDs, eventName)) {
                    prm._asyncPostBackControlIDs.push(eventName);
                }

                if (!Array.contains(prm._asyncPostBackControlClientIDs, eventName)) {
                    prm._asyncPostBackControlClientIDs.push(eventName);
                }

                __doPostBack(eventName, eventArgs);
            }
            return;
        },
        CMPostBackAsync: function (eventName, eventArgs, progressPanelID, isClientID) {
            if (eventName != undefined && eventName != '') {

                var selectorId = '';

                if (isClientID) {
                    selectorId = '#' + progressPanelID;
                }
                else {
                    selectorId = '[id$=_' + progressPanelID + ']';
                }

                var prm = Sys.WebForms.PageRequestManager.getInstance();

                if (!Array.contains(prm._asyncPostBackControlIDs, eventName)) {
                    prm._asyncPostBackControlIDs.push(eventName);
                }

                if (!Array.contains(prm._asyncPostBackControlClientIDs, eventName)) {
                    prm._asyncPostBackControlClientIDs.push(eventName);
                }

                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(function(){
                        $(selectorId).css('display','block');
                    });
                }

                __doPostBack(eventName, eventArgs);

                if (typeof Sys != 'undefined') {
                    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function(){
                        $(selectorId).css('display','none');
                    });
                }
            }
            return;
        },
        CMOnLoad: function (eventName, eventArgs) {
            if (jQuery.isFunction(fn)) {
                jQuery(window).bind("load", fn);
                return;
            }
        }
    });
})(jQuery);