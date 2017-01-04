(function(){
  // shuts off dropzone autoDiscover
  // this is so we can apply the dropzone object programmatically
  Dropzone.autoDiscover = false;

  ko.bindingHandlers.dropzone = {
    init: function (el, opts) {
      opts = opts() || {};

      var removeImage = function (imageUrl) {
        ajax({
          url: imageUrl,
          type: 'DELETE',
          error: function(err){
            console.error('dropzone@err:', err)
          }
        });
      };

      var dropzoneInit = function () {
        this.on('success', function (file, resp) {
          if (Array.isArray(opts.value())) // check observableArray
            opts.value.push(resp.url);
          else
            opts.value(resp.url);
        });

        this.on('error', function (file, err) {
          console.error('dropzone@err:', err);
        });

        this.on('removedfile', function (file) {
          if (Array.isArray(opts.value())) { // check observableArray
            var imageUrl = JSON.parse(file.xhr.response).url;
            removeImage(imageUrl)
            .done(function (resp) {
              opts.value.remove(imageUrl);
            })
          } else {
            var imageUrl = JSON.parse(file.xhr.response).url;
            removeImage(imageUrl)
            .done(function (resp) {
              opts.value('');
            })
          }
        })
      };

      function extend(a, b){
          for(var key in b)
              if(b.hasOwnProperty(key))
                  a[key] = b[key];
          return a;
      }

      function ajax(options){
        var request = new XMLHttpRequest();
        request.open(options.type, options.url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            if (typeof options.success == "function"){
              var resp = request.responseText;
              options.success(resp);
            }
          } else {
            if (typeof options.error == "function"){
              options.error(request);
            }
          }
        };

        if (typeof options.error == "function"){
          request.onerror = options.error;
        }

        request.send();
      }

      var dropzoneOptions = extend(opts, {
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        init: dropzoneInit
      });

      new Dropzone(el, dropzoneOptions);
    }
  }

}());
