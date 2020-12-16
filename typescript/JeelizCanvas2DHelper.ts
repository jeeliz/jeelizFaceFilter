
/*
Usage: JeelizCanvas2DHelper(spec) where spec is the returned object of the initialization function (callbackReady)
Return an object width these properties:

 - canvas: the CANVAS element
 - ctx: the canvas drawing context
 - update_canvasTexture: function to launch each time the canvas has been updated (somethink has been drawn on it)
 - draw: draw the video with the canvas above
 - getCoordinates: transform the detectedState relative 2D viewport coords into canvas 2D pixel coordinates
 - resize: to call if the HTML canvas size has changed
*/

import { IJeelizFaceFilterDetectState, IJeelizFaceFilterInitResult as IJeelizFaceFilterInitResult } from "./JeelizFaceFilterInterfaces";

export class JeelizCanvas2DHelper {
  

  private GL : WebGL2RenderingContext | null = null;
  private CANVASTEXTURE : WebGLTexture | null= null;
  private CANVASTEXTURENEEDSUPDATE : boolean | null= null; 
  private SHADERCOPY : WebGLProgram | null | undefined= null; 
  private VIDEOTEXTURE : WebGLUniformLocation | null= null;
  private VIDEOTEXTURETRANSFORMMAT2 : number[] | null= null;
  private UUVTRANSFORM : WebGLUniformLocation | null= null;
  private spec:IJeelizFaceFilterInitResult;

  public CV : HTMLCanvasElement | null= null; 
  public CANVAS2D: HTMLCanvasElement | null = null; 
  public CTX : any | CanvasRenderingContext2D= null; 

  public COORDINATES = {
    x:0, y:0, s:0, w:0, h:0
  };

  constructor(spec:IJeelizFaceFilterInitResult){
      this.spec = spec;
        // affect some globalz:
      this.GL = spec.GL;
      this.CV = spec.canvasElement;
      this.VIDEOTEXTURE = spec.videoTexture;
      this.VIDEOTEXTURETRANSFORMMAT2 = spec.videoTransformMat2;
     
      // create and size the 2D canvas and its drawing context:
      this.CANVAS2D = document.createElement('canvas');
      
      if (this.CANVAS2D == null) return;
      this.CANVAS2D.width = this.CV.width;
      this.CANVAS2D.height = this.CV.height;
      this.CTX = this.CANVAS2D.getContext('2d');
        
      // create the Webthis.GL texture with the canvas:
      this.CANVASTEXTURE = this.GL.createTexture();
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.CANVASTEXTURE);
      this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, this.CANVAS2D);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.LINEAR);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
    
      // build the copy shader program:
      const copyVertexShaderSource = "attribute vec2 position;\n\
        uniform mat2 UVTransformMat2;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position = vec4(position, 0., 1.);\n\
          vUV = vec2(0.5,0.5) + UVTransformMat2 * position;\n\
        }";
    
      const copyFragmentShaderSource = "precision lowp float;\n\
        uniform sampler2D samplerImage;\n\
        varying vec2 vUV;\n\
        \n\
        void main(void){\n\
          gl_FragColor = texture2D(samplerImage, vUV);\n\
        }";
        this.SHADERCOPY = this.build_shaderProgram(copyVertexShaderSource, copyFragmentShaderSource, 'VIDEO');
        if (this.SHADERCOPY == null) return;
      const uSampler = this.GL.getUniformLocation(this.SHADERCOPY, 'samplerImage');
      this.UUVTRANSFORM = this.GL.getUniformLocation(this.SHADERCOPY, 'UVTransformMat2');
      this.GL.useProgram(this.SHADERCOPY);
      this.GL.uniform1i(uSampler, 0);
  }
  

  //BEGIN WEBthis.GL HELPERS
  // compile a shader:
  private compile_shader(source, glType, typeString) {
    if (this.GL == null) return;
    const glShader = this.GL.createShader(glType);
    if (glShader == null) return;
    this.GL.shaderSource(glShader, source);
    this.GL.compileShader(glShader);
    if (!this.GL.getShaderParameter(glShader, this.GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString +  " SHADER: " + this.GL.getShaderInfoLog(glShader));
      return null;
    }
    return glShader;
  }

  // helper function to build the shader program:
  private build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
      if (this.GL == null) return;
    // compile both shader separately:
    const glShaderVertex = this.compile_shader(shaderVertexSource, this.GL.VERTEX_SHADER, "VERTEX " + id);
    const glShaderFragment = this.compile_shader(shaderFragmentSource, this.GL.FRAGMENT_SHADER, "FRAGMENT " + id);

    const glShaderProgram = this.GL.createProgram();
    if (glShaderProgram == null || glShaderVertex == null || glShaderFragment == null) return;
    this.GL.attachShader(glShaderProgram, glShaderVertex);
    this.GL.attachShader(glShaderProgram, glShaderFragment);

    // start the linking stage:
    this.GL.linkProgram(glShaderProgram);
    return glShaderProgram;
  }
  //END WEBthis.GL HELPERS

  
  public update_canvasTexture() {
      this.CANVASTEXTURENEEDSUPDATE = true;
    }

    public draw (detectState: IJeelizFaceFilterDetectState) { // draw the video and the canvas above
      if (this.CV == null || this.GL == null || this.SHADERCOPY == null || this.VIDEOTEXTURETRANSFORMMAT2 == null || this.CANVAS2D == null) return;
      this.GL.viewport(0, 0, this.CV.width, this.CV.height);
      this.GL.useProgram(this.SHADERCOPY);

      // enable blending:
      this.GL.enable(this.GL.BLEND);
      this.GL.blendFunc(this.GL.SRC_ALPHA, this.GL.ONE_MINUS_SRC_ALPHA);

      // draw the video first:
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.VIDEOTEXTURE);
      this.GL.uniformMatrix2fv(this.UUVTRANSFORM, false, this.VIDEOTEXTURETRANSFORMMAT2);
      this.GL.drawElements(this.GL.TRIANGLES, 3, this.GL.UNSIGNED_SHORT, 0);

      // then draw the canvas:
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.CANVASTEXTURE);
      this.GL.uniformMatrix2fv(this.UUVTRANSFORM, false, [0.5, 0, 0, 0.5]);
      if (this.CANVASTEXTURENEEDSUPDATE) {
        this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, this.CANVAS2D);
      }
      this.GL.drawElements(this.GL.TRIANGLES, 3, this.GL.UNSIGNED_SHORT, 0);
      
      this.GL.disable(this.GL.BLEND);      
    }

    public getCoordinates(detectedState: IJeelizFaceFilterDetectState) {
      if (this.CV == null) return this.COORDINATES;
      this.COORDINATES.x = Math.round((0.5+0.5*detectedState.x-0.5*detectedState.s)*this.CV.width);
      this.COORDINATES.y = Math.round((0.5+0.5*detectedState.y-0.5*detectedState.s)*this.CV.height);
      this.COORDINATES.w = Math.round(detectedState.s*this.CV.width);
      this.COORDINATES.h = this.COORDINATES.w;
      return this.COORDINATES;   
    }

   public resize() {
      if (this.CANVAS2D == null ||this.CV == null) return;
      this.CANVAS2D.width = this.CV.width;
      this.CANVAS2D.height = this.CV.height;
    }
} 


  