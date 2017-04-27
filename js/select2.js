(function ($, Drupal) {
  Drupal.behaviors.select2_widget = {
    attach: function(context, drupalSettings) {

      if(typeof drupalSettings.select2 != 'undefined'){

        $.each(drupalSettings.select2, function(id, options) {
          var ajax_url = $(options.selector).attr('data-autocomplete-path');

          $(options.selector).css('width', '100%').select2({
            tags: true,
            multiple: true,
            ajax: {
              url: ajax_url,
              dataType: 'json',
              delay: 250,
              data: function(params){
                return {
                  q: params.term
                };
              },
              processResults: function (data) {
                var ret = {results: []};
                var me = this;

                $.each(data, function(id, item){
                  if($.inArray(""+item.id, me.$element.val()) < 0){
                    ret.results.push(item);
                  }
                });

                return ret;
              },
              cache: false
            },
            language: 'de',
            minimumInputLength: 1,
            escapeMarkup: function (markup) {
              return markup;
            },
            templateResult: function(item){
              return item.text;
            },
            templateSelection: function(item, callee) {
              var text = item.text;
              if(typeof options.items[item.id] != 'undefined'){
                $.extend(item, options.items[item.id]);
              }

              if(item.id == item.text) {
                text = '*' + text;
                item.status = '0';
              }

              if(item.status === '0'){
                $(callee[0]).addClass('status-unpublished');//.css('background-color', '#e62600');
                return $('<span>' + text + '</span>');//.addClass('status-unpublished');
              }
              else {
                $(callee[0]).addClass('status-published');//.css('background-color', '#77b259');
              }

              return item.text;
            }
          });

        });

      }
    }
  };
}(jQuery, Drupal));