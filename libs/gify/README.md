# gify
JavaScript API for decoding/parsing information from animated GIFs using ArrayBuffers.

## Why?
Once I saw [vinepeek](http://www.vpeeker.com/), I immediately wanted to build a similar site for animated GIFs. The only problem was, there was no way to quickly determine the duration of an animated GIF, which varies in different browsers. Thus, gify was born over a weekend.

## Requirements
gify requires [jDataView](https://github.com/vjeux/jDataView) for reading binary files. Please pull the latest from their repository.

## Methods
* **isAnimated**(sourceArrayBuffer) (bool)
* **getInfo**(sourceArrayBuffer) (gifInfo)

## info Properties
* **valid** (bool) - Determines if the GIF is valid.
* **animated** (bool) - Determines if the GIF is animated.
* **globalPalette** (bool) - Determines if the GIF has a global color palette.
* **globalPaletteSize** (int) - Size of the global color palette.
* **globalPaletteColorsRGB** ([r,g,b]) - An array of objects containing the R, G, B values of the color palette. ([Beppe](https://github.com/Beppe))
* **height** (int) - Canvas height.
* **width** (int) - Canvas width.
* **loopCount** (int) - Total number of times the GIF will loop. 0 represents infitine.
* **images** ([images]) - Array of images contained in the GIF.
* **isBrowserDuration** (bool) - If any of the delay times are lower than the [minimum value](http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility), this value will be set to true.
* **duration** (int) - Actual duration calculated from the delay time for each image. If isBrowserDuration is false, you should use this value.
* **durationIE** (int) - Duration for Internet Explorer (16fps)
* **durationSafari** (int) - Duration for Safari in milliseconds (50fps)
* **durationFirefox** (int) - Duration for Firefox in milliseconds (50fps)
* **durationChrome** (int) - Duration for Chrome in milliseconds (50fps)
* **durationOpera** (int) - Duration for Opera in milliseconds (50fps)

## image Properties
* **identifier** (string) - Image identifier (frame number or embeded string).
* **top** (int) - Image top position (Y).
* **left** (int) - Image left position (X).
* **height** (int) - Image height.
* **width** (int) - Image width.
* **localPalette** (bool) - Image has a local color palette.
* **localPaletteSize** (int) - Size of the local color palette.
* **interlace** (bool) - Image is/is not interlaced.
* **delay** (int) - Delay time in milliseconds.
* **text** (string) - frame text. aka Plain Text Extension.
* **comments** ([comments]) - Array of comment strings.
* **disposal** (int) - Disposal method. (0-7). See [this](http://www.w3.org/Graphics/GIF/spec-gif89a.txt) for more details.

### Example
``` json
{
  "valid": true,
  "globalPalette": true,
  "globalPaletteSize": 256,
  "globalPaletteColorsRGB": [
    {
      "r": 50,
      "g": 82,
      "b": 120
    },
    {
      "r": 89,
      "g": 105,
      "b": 119
    },
    {
      "r": 4,
      "g": 33,
      "b": 71
    }
  ],
  "loopCount": 0,
  "height": 1610,
  "width": 899,
  "animated": true,
  "images": [
    {
      "identifier": "0",
      "localPalette": false,
      "localPaletteSize": 0,
      "interlace": false,
      "comments": [],
      "text": "",
      "left": 0,
      "top": 0,
      "width": 1610,
      "height": 899,
      "delay": 350,
      "disposal": 0
    },
    {
      "identifier": "1",
      "localPalette": true,
      "localPaletteSize": 256,
      "interlace": false,
      "comments": [],
      "text": "",
      "left": 0,
      "top": 0,
      "width": 1610,
      "height": 899,
      "delay": 350,
      "disposal": 0
    },
    {
      "identifier": "2",
      "localPalette": true,
      "localPaletteSize": 256,
      "interlace": false,
      "comments": [],
      "text": "",
      "left": 0,
      "top": 0,
      "width": 1610,
      "height": 899,
      "delay": 350,
      "disposal": 0
    },
    {
      "identifier": "3",
      "localPalette": true,
      "localPaletteSize": 256,
      "interlace": false,
      "comments": [],
      "text": "",
      "left": 0,
      "top": 0,
      "width": 1610,
      "height": 899,
      "delay": 350,
      "disposal": 0
    }
  ],
  "isBrowserDuration": false,
  "duration": 2800,
  "durationIE": 2800,
  "durationSafari": 2800,
  "durationFirefox": 2800,
  "durationChrome": 2800,
  "durationOpera": 2800
}
```

## Resources
* [What's In A GIF - Bit by Byte](http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp) - Hands down the best write up on GIFs I've found.
* [GIF98](http://www.w3.org/Graphics/GIF/spec-gif89a.txt) - GIF98 RFC.
* [Animated GIF Frame Rate by Browser](http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility) - An awesome breakdown of how each browser renders animated GIFs. Thanks to Jeremiah Johnson for doing the hard work.
* [GIF Format](http://www.onicos.com/staff/iz/formats/gif.html) - GIF blocks.
* [Hexfiend](http://ridiculousfish.com/hexfiend/) - Awesome open source HEX editor (OSX)
