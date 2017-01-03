(function(){
  ko.bindingHandlers.dropzone = {
    init: function (el, opts) {
      opts = opts() || {};

      var removeImage = function (imageUrl) {
        return $.ajax({
          url: imageUrl,
          type: 'DELETE'
        })
        .error(function () {
          console.error('dropzone@err:', err);
        })
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

      var dropzoneOptions = extend(opts, {
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        init: dropzoneInit
      });

      //$(el).dropzone(dropzoneOptions);
      new Dropzone(el, dropzoneOptions);
    }
  }

}());
