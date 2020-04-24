"use strict";

/*
Usage: JEEFACEFILTERAPI.Canvas2DDisplay(spec) where spec is the returned object of the initialization function (callbackReady)
Return an object width these properties:

 - canvas: the CANVAS element
 - ctx: the canvas drawing context
 - update_canvasTexture: function to launch each time the canvas has been updated (somethink has been drawn on it)
 - draw: draw the video with the canvas above
 - getCoordinates: transform the detectedState relative 2D viewport coords into canvas 2D pixel coordinates
 - resize: to call if the HTML canvas size has changed
*/

JEEFACEFILTERAPI.Canvas2DDisplay = function(spec){

  // some globalz:
  let CV = null, CANVAS2D = null, CTX = null, GL = null, CANVASTEXTURE = null, CANVASTEXTURENEEDSUPDATE = null, SHADERCOPY = null, VIDEOTEXTURE = null;
  const COORDINATES = {
    x:0, y:0, s:0
  };

  //BEGIN WEBGL HELPERS
  // compile a shader:
  function compile_shader(source, type, typeString) {
    const shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString +  " SHADER: " + GL.getShaderInfoLog(shader));
    }
    return shader;
  };

  // helper function to build the shader program:
  function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
    // compile both shader separately:
    const shaderVertex = compile_shader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX " + id);
    const shaderFragment = compile_shader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT " + id);

    const shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, shaderVertex);
    GL.attachShader(shaderProgram, shaderFragment);

    // start the linking stage:
    GL.linkProgram(shaderProgram);
    return shaderProgram;
  }
  //END WEBGL HELPERS


  // affect some globalz:
  GL = spec.GL;
  CV = spec.canvasElement;
  VIDEOTEXTURE = spec.videoTexture;

  // create and size the 2D canvas and its drawing context:
  CANVAS2D = document.createElement('canvas');
  CANVAS2D.width = CV.width;
  CANVAS2D.height = CV.height;
  CTX = CANVAS2D.getContext('2d');
    
  // create the WebGL texture with the canvas:
  CANVASTEXTURE = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, CANVASTEXTURE);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, CANVAS2D);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

  // build the copy shader program:
  const copyVertexShaderSource = "attribute vec2 position;\n\
     varying vec2 vUV;\n\
     void main(void){\n\
      gl_Position = vec4(position, 0., 1.);\n\
      vUV = vec2(0.5,0.5) + 0.5*position;\n\
     }";

  const copyFragmentShaderSource = "precision lowp float;\n\
     uniform sampler2D samplerImage;\n\
     varying vec2 vUV;\n\
     \n\
     void main(void){\n\
      gl_FragColor = texture2D(samplerImage, vUV);\n\
     }";
  SHADERCOPY = build_shaderProgram(copyVertexShaderSource, copyFragmentShaderSource, 'VIDEO');
  const uSampler = GL.getUniformLocation(SHADERCOPY, 'samplerImage');
  GL.useProgram(SHADERCOPY);
  GL.uniform1i(uSampler, 0);
  
  return {
    canvas: CANVAS2D,
    ctx: CTX,

    update_canvasTexture: function(){
      CANVASTEXTURENEEDSUPDATE = true;
    },

    draw: function(){ // draw the video and the canvas above
      GL.viewport(0,0,CV.width, CV.height);
      GL.useProgram(SHADERCOPY);

      // enable blending:
      GL.enable(GL.BLEND);
      GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

      // draw the video first:
      GL.bindTexture(GL.TEXTURE_2D, VIDEOTEXTURE);
      GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

      // then draw the canvas:
      GL.bindTexture(GL.TEXTURE_2D, CANVASTEXTURE);
      if (CANVASTEXTURENEEDSUPDATE) {
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, CANVAS2D);
      }
      GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

      GL.disable(GL.BLEND);      
    },

    getCoordinates: function(detectedState){
      COORDINATES.x = Math.round((0.5+0.5*detectedState.x-0.5*detectedState.s)*CV.width);
      COORDINATES.y = Math.round((0.5+0.5*detectedState.y-0.5*detectedState.s)*CV.height);
      COORDINATES.w = Math.round(detectedState.s*CV.width);
      COORDINATES.h = COORDINATES.w;
      return COORDINATES;   
    },

    resize: function(){
      CANVAS2D.width = CV.width;
      CANVAS2D.height = CV.height;
    }
  }; //end Canvas2DDisplay return value
} //end JEEFACEFILTERAPI.Canvas2DDisplay()