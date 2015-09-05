# knockout-dropzone
Dropzone.js knockout binding.

```js
var main = {
  image: ko.observable(''); // One image.
  images: ko.observableArray([]); // Multiple images.
}
```

You can add dropzone options in first argument's object.
`value` option must contain observable.
`url` option must contain your API path for image sending.

```html
<div class="dropzone" data-bind="dropzone: { value: image, url: '/img/upload' }"></div>
<div class="dropzone" data-bind="dropzone: { value: images, url: '/img/upload' }"></div>
```
