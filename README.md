jquery.repartee.js
==================

**Note: this is a prototype, not used in a production environment yet.**  
jquery.repartee.js is a simplistic responsive image jquery plugin.


Description
-----------

The goal is to easily change the source of images in a page, if needs be, meaning if the source width is too far from the displayed width.  
This library does not contain any form of url logic, it only handles the transparent loading and displaying from the new source of the image.

But why ?
- i want a simple solution.
- i want a solution that is not tied to how or where i host my images.
- my responsive strategy is not definitive and i want to be able to easily switch/test things around.
- i am not really a fan of the html data-src solutions and i'm not aware of any css solution.


Usage
-----

`$('img').repartee(url_pattern_callback, [optional_comparaison_function]);`

The url_pattern_callback function accepts 3 arguments:  
the image element itself, the width of the source image, and the width of the displayed image.  
And returns the new source url for the image. It is your responsability to implement your responsive logic in this function.

The optional_comparaison_function is .. optional, and accepts 2 arguments:  
the width of the source image and the width of the displayed image.  
And returns true if the image source should be changed for this device.  
by default, it returns true if the displayed width of the image is at least 20% larger than the source image.


Example
-------

```javascript
$('img.responsive').repartee(function(img, source_width, display_width) { 
      var new_size = display_width - display_width % A_REASONABLE_GRID_SIZE || A_REASONABLE_GRID_SIZE; 
      return img.attr('src').replace(/width=(\d+)/, 'width='+new_size); 
});```

First of all, i only select images with the 'responsive' class, this might be important if you have a very complex responsive logic and want to have different callbacks for different types of images.  
The second line may be a bit cryptic, but its a good example of a responsive image logic, it returns the closest multiplier of A_REASONABLE_GRID_SIZE to display_width(always rounded down) and being non zero.  
then the anonymous function returns the new url with the width changed accordingly. 
 
The lib will then proceed to load the new image asynchronously and display it when it's ready.


Drawbacks
---------

It violates the dry principle.  
Because your urls logic will be splitted, if you change your images urls, you will need to change your pattern_callback function as well. 

The name is lame. i choose it because it's a quick and smart 'response', and finding names is too hard.

Todo
----

* add 2 custom events to trigger and catch manually the source/width checking
* handle the resize event ? (in case the user flips his device)
* add an example for a custom comparaison function
* add an example with a bit more complex logic ?