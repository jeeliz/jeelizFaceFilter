/*
 * gify v1.2
 * https://github.com/rfrench/gify
 *
 * Copyright 2015, Ryan French
 *
 */

/*global console, jDataView, ArrayBuffer */

var gify = (function() { 'use strict';
  var defaultDelay = 100;

  function getPaletteSize(palette) {
    return (3 * Math.pow(2, 1 + bitToInt(palette.slice(5, 8))));
  }
  function getBitArray(num) {
    var bits = [];
    for (var i = 7; i >= 0; i--) {
      bits.push(!!(num & (1 << i)) ? 1 : 0);
    }
    return bits;
  }
  function getDuration(duration) {
    return ((duration / 100) * 1000);
  }
  function bitToInt(bitArray) {
    return bitArray.reduce(function(s, n) { return s * 2 + n; }, 0);
  }
  function readSubBlock(view, pos, read) {
    var subBlock = {
      data: '',
      size: 0
    };

    while (true) {
      var size = view.getUint8(pos + subBlock.size, true);
      if (size === 0) {
        subBlock.size++;
        break;
      }
      
      if (read) {
        subBlock.data += view.getString(size, pos + subBlock.size + 1);
      }
      subBlock.size += size + 1;
    }

    return subBlock;
  }
  function getNewImage() {
    return {
        identifier: '0',
        localPalette: false,
        localPaletteSize: 0,
        interlace: false,
        comments: [],
        text: '',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        delay: 0,
        disposal: 0
    };
  }
  function getInfo(sourceArrayBuffer, quickPass) {
    var pos = 0, size = 0, paletteSize = 0, index = 0;

    var info = {
      valid: false,
      globalPalette: false,
      globalPaletteSize: 0,
      globalPaletteColorsRGB:[],
      loopCount: 0,
      height: 0,
      width: 0,
      animated: false,
      images: [],
      isBrowserDuration: false,
      duration: 0,
      durationIE: 0,
      durationSafari: 0,
      durationFirefox: 0,
      durationChrome: 0,
      durationOpera: 0
    };

    var view = new jDataView(sourceArrayBuffer);

    //needs to be at least 10 bytes long
    if(sourceArrayBuffer.byteLength < 10) { return info; }

    //GIF8
    if ((view.getUint16(0) != 0x4749) || (view.getUint16(2) != 0x4638)) {
      return info;
    }

    //get width / height
    info.width = view.getUint16(6, true);
    info.height = view.getUint16(8, true);
    
    //not that safe to assume, but good enough by this point
    info.valid = true;

    //parse global palette
    var unpackedField = getBitArray(view.getUint8(10, true));
    if (unpackedField[0]) {
      var globalPaletteSize = getPaletteSize(unpackedField);
      info.globalPalette = true;
      info.globalPaletteSize = (globalPaletteSize / 3);
      pos += globalPaletteSize;
      for (var i = 0; i < info.globalPaletteSize; i++)
      {
        var palettePos = 13 + i * 3;
        var r = view.getUint8(palettePos, true); //red
        var g = view.getUint8(palettePos + 1, true); //green
        var b = view.getUint8(palettePos + 2, true); //blue
        info.globalPaletteColorsRGB.push({ r: r, g: g, b: b });
      }
    }
    pos += 13;

    var image = getNewImage();
    while (true) {
      try {
        var block = view.getUint8(pos, true);

        switch(block)
        {
          case 0x21: //EXTENSION BLOCK
            var type = view.getUint8(pos + 1, true);
            
            if (type === 0xF9) { //GRAPHICS CONTROL EXTENSION
                var length = view.getUint8(pos + 2);
                if (length === 4) {

                  var delay = getDuration(view.getUint16(pos + 4, true));
                  
                  if (delay < 60 && !info.isBrowserDuration) {
                    info.isBrowserDuration = true;
                  }

                  //http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility (out of date)
                  image.delay = delay;
                  info.duration += delay;
                  info.durationIE += (delay < 60) ? defaultDelay : delay;
                  info.durationSafari += (delay < 20) ? defaultDelay : delay;
                  info.durationChrome += (delay < 20) ? defaultDelay : delay;
                  info.durationFirefox += (delay < 20) ? defaultDelay : delay;
                  info.durationOpera += (delay < 20) ? defaultDelay : delay;
                  
                  //set disposal method
                  var unpackedField = getBitArray(view.getUint8(pos + 3));
                  var disposal = unpackedField.slice(3, 6).join('');
                  image.disposal = parseInt(disposal, 2);

                  pos += 8;
                }
                else {
                  pos++;
                }
            }
            else {
              pos += 2;
              var subBlock = readSubBlock(view, pos, true);
              switch (type)
              {
                case 0xFF: //APPLICATION EXTENSION
                  /* since multiple application extension blocks can
                     occur, we need to make sure we're only setting
                     the loop count when the identifer is NETSCAPE */
                  var identifier = view.getString(8, pos + 1);
                  if (identifier === 'NETSCAPE') {
                    info.loopCount = view.getUint8(pos + 14, true);
                  }
                  break;
                case 0xCE: //NAME
                  /* the only reference to this extension I could find was in
                     gifsicle. I'm not sure if this is something gifsicle just
                     made up or if this actually exists outside of this app */
                  image.identifier = subBlock.data;
                  break;
                case 0xFE: //COMMENT EXTENSION
                  image.comments.push(subBlock.data);
                  break;
                case 0x01: //PLAIN TEXT EXTENSION
                  image.text = subBlock.data;
                  break;
              }

              pos += subBlock.size;
            }
            break;
          case 0x2C: //IMAGE DESCRIPTOR
            image.left = view.getUint16(pos + 1, true);
            image.top = view.getUint16(pos + 3, true);
            image.width = view.getUint16(pos + 5, true);
            image.height = view.getUint16(pos + 7, true);

            var unpackedField = getBitArray(view.getUint8(pos + 9, true));
            if (unpackedField[0]) {
              //local palette?
              var localPaletteSize = getPaletteSize(unpackedField);
              image.localPalette = true;
              image.localPaletteSize = (localPaletteSize / 3);
              
              pos += localPaletteSize;
            }
            if (unpackedField[1]) {
              //interlaced?
              image.interlace = true;
            }

            //add image & reset object
            info.images.push(image);
            index++;

            //create new image
            image = getNewImage();
            image.identifier = index.toString();

            //set animated flag
            if (info.images.length > 1 && !info.animated) {
              info.animated = true;

              //quickly bail if the gif has more than one image
              if (quickPass) {
                return info;
              }
            }

            pos += 11;
            var subBlock = readSubBlock(view, pos, false);
            pos += subBlock.size;
            break;
          case 0x3B: //TRAILER BLOCK (THE END)
            return info;
          default: //UNKNOWN BLOCK (bad)
            pos++;
            break;
        }
      }
      catch(e) {
        info.valid = false;
        return info;
      }
      
      //this shouldn't happen, but if the trailer block is missing, we should bail at EOF
      if ((pos) >= sourceArrayBuffer.byteLength) {
        return info;
      }
    }

    return info;
  }
  return {
    isAnimated: function(sourceArrayBuffer) {
      var info = getInfo(sourceArrayBuffer, true);
      return info.animated;
    },
    getInfo: function(sourceArrayBuffer) {
      return getInfo(sourceArrayBuffer, false);
    }
  };
})();
