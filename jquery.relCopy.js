/**
 * jQuery plugin to dynamically add duplicate elements by cloning given element
 * Based on relCopy by Andres Vidal <http://www.andresvidal.com/labs/relcopy.html>
 * 
 * @author: Sujeet Kumar <sujeetkv90@gmail.com>
 * @link https://github.com/sujeet-kumar/jquery-relcopy
 * 
 * Example:
 * $('a.add-more').relCopy({limit: 5}); // <a href="example.com" class="add-more" rel=".phone">Copy Phone</a>
 * 
 * Instructions:
 * Call $(selector).relCopy(options) on an element with a jQuery type selector defined in the attribute "rel" of element.
 * This defines the DOM element to copy.
 * 
 * @param: string	excludeSelector - A jQuery selector used to exclude an element and its children
 * @param: string	emptySelector - A jQuery selector used to empty an element
 * @param: string	copyClass - A class to attach to each copy
 * @param: integer	limit - The number of allowed copies. Default: 0 is unlimited
 * @param: string	append - Extra HTML to append at the end of each copy.
 * @param: string	appendTo - A jQuery selector of inner element of each copy to which extra HTML will be appended.
 * @param: boolean	clearInputs - Option to clear text input fields or textarea of each copy (default true)
 * @param: boolean	withDataAndEvents - Option to copy with events and data of element (default true)
 * @param: function	onLimitExceeded - callback to call when copy limit exceeds
 * @param: function	onCopy - callback to call after each copy having copied element as argument
 */

(function ($) {

    $.fn.relCopy = function (options) {
        var settings = jQuery.extend({
            excludeSelector: ".exclude",
            emptySelector: ".empty",
            copyClass: "copy",
            limit: 0, // 0 = unlimited
            append: '',
            appendTo: '',
            clearInputs: true,
            withDataAndEvents: true,
            onLimitExceeded: null,
            onCopy: null,
        }, options);

        settings.limit = parseInt(settings.limit);

        // loop each element
        this.each(function () {

            // set click action
            $(this).click(function () {
                var that = this;
                var rel = $(that).attr('rel'); // rel in jquery selector format				
                var counter = $(rel).length;

                // stop limit
                if (settings.limit != 0 && counter >= settings.limit) {
                    if (typeof settings.onLimitExceeded === 'function') {
                        settings.onLimitExceeded.call(that);
                    }
                    return false;
                };

                var master = $(rel + ':first');
                var parent = $(master).parent();
                var clone = $(master).clone(settings.withDataAndEvents).addClass(settings.copyClass + counter);

                //Remove Elements with excludeSelector
                if (settings.excludeSelector) {
                    $(clone).find(settings.excludeSelector).remove();
                };

                // Add axtra append
                if (settings.appendTo && $(clone).find(settings.appendTo).length) {
                    $(clone).find(settings.appendTo).append(settings.append);
                } else {
                    $(clone).append(settings.append);
                }

                //Empty Elements with emptySelector
                if (settings.emptySelector) {
                    $(clone).find(settings.emptySelector).empty();
                };

                // Increment Clone IDs
                if ($(clone).attr('id')) {
                    var newid = $(clone).attr('id').replace(/\d+$/, '') + (counter + 1);
                    $(clone).attr('id', newid);
                };

                // Increment Clone Children IDs
                $(clone).find('[id]').each(function () {
                    var newid = $(this).attr('id').replace(/\d+$/, '') + (counter + 1);
                    $(this).attr('id', newid);
                });

                //Clear Inputs/Textarea
                if (settings.clearInputs) {
                    $(clone).find(':input').each(function () {
                        var type = $(this).attr('type');
                        switch (type) {
                            case "button":
                                break;
                            case "reset":
                                break;
                            case "submit":
                                break;
                            case "checkbox":
                                $(this).prop('checked', false);
                                break;
                            default:
                                $(this).val('');
                        }
                    });
                };

                $(parent).find(rel + ':last').after(clone);

                if (typeof settings.onCopy === 'function') {
                    settings.onCopy.call(that, clone);
                }

                return false;

            });

        });

        return this; // return to jQuery
    };

})(jQuery);
