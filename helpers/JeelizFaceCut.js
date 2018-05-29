"use strict";

/*
This helper is usefull to cut faces (in 2D)
It is used for example in the faceSwap demo
It can :
- handle basic vanilla WebGL helpers like compiling shaders
- handle search display
- handle face cut

It does not handle the 3D aspect (no matrix stories)

*/

var JeelizFaceCut=(function(){
	//private variables
	var GL, _canvas, _glVideoTexture, _shps={};
	var _fboDrawTarget, _fbo;


	//private functions

	//BEGIN VANILLA WEBGL HELPERS
	//compile a shader
	function compile_shader(source, type, typeString) {
	    var shader = GL.createShader(type);
	    GL.shaderSource(shader, source);
	    GL.compileShader(shader);
	    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
	        alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
	        console.log('Buggy shader source : \n', source);
	        return false;
	    }
	    return shader;
	};

	//build the shader program :
	function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
	    //compile both shader separately
	    var shaderVertex=compile_shader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX "+id);
	    var shaderFragment=compile_shader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT "+id);

	    var shaderProgram=GL.createProgram();
	    GL.attachShader(shaderProgram, shaderVertex);
	    GL.attachShader(shaderProgram, shaderFragment);

	    //start the linking stage :
	    GL.linkProgram(shaderProgram);
	    var aPos = GL.getAttribLocation(shaderProgram, "position");
	  	GL.enableVertexAttribArray(aPos);

	    return {
	    	program: shaderProgram,
	    	uniforms:{}
	    };
	} //end build_shaderProgram()
	//END VANILLA WEBGL HELPERS

	//builds shader programs :
	function build_shps(){
		var copyVertexShaderSource="attribute vec2 position;\n\
	         varying vec2 vUV;\n\
	         void main(void){\n\
	            gl_Position=vec4(position, 0., 1.);\n\
	            vUV=0.5+0.5*position;\n\
	         }";

	    var copyFragmentShaderSource="precision lowp float;\n\
	         uniform sampler2D samplerImage;\n\
	         varying vec2 vUV;\n\
	         \n\
	         void main(void){\n\
	         	gl_FragColor=texture2D(samplerImage, vUV);\n\
	         }";

	    //Copy shader program : simply copy a texture
	    _shps.copy=build_shaderProgram(copyVertexShaderSource, copyFragmentShaderSource, 'COPY');
	    _shps.copy.uniforms.samplerImage=GL.getUniformLocation(_shps.copy.program, 'samplerImage');
	    GL.useProgram(_shps.copy.program);
	    GL.uniform1i(_shps.copy.uniforms.samplerImage, 0.);

	    //search shp : display a search square on the head
	    //we play on the viewport position to positionnate it
	    var searchFragmentShaderSource="precision lowp float;\n\
	         uniform float detected;\n\
	         varying vec2 vUV;\n\
	         \n\
	         void main(void){\n\
	         	vec3 color=mix(vec3(1.,0.,0.), vec3(0.,1.,0.), detected);\n\
	         	vec2 blendCenterFactor=2.*abs(vUV-vec2(0.5,0.5));\n\
	         	float alpha=pow(max(blendCenterFactor.x, blendCenterFactor.y), 3.);\n\
	         	gl_FragColor=vec4(color, alpha);\n\
	         }";
	    _shps.search=build_shaderProgram(copyVertexShaderSource, searchFragmentShaderSource, 'COPY');
	    _shps.search.uniforms.detected=GL.getUniformLocation(_shps.search.program, 'detected');
	} //end build_shps()


	function build_VBOs(){

	} //end build_VBOs()

	function build_FBO(){ //we need to create a FBO to do render to texture for color corrections
		_fbo=GL.createFramebuffer();
	    _fboDrawTarget=(GL.DRAW_FRAMEBUFFER)?GL.DRAW_FRAMEBUFFER:GL.FRAMEBUFFER; //depending on WebGL1 or WebGL2
	}

	//public static methods :
	var superThat={
		init: function(spec){
			GL=spec.GL;
			_canvas=spec.canvasElement;
			_glVideoTexture=spec.videoTexture;

			build_shps();
			build_VBOs();
			build_FBO();
		},

		draw_video: function(){ //draw the video texture as background
			GL.useProgram(_shps.copy.program);
			GL.bindTexture(GL.TEXTURE_2D, _glVideoTexture);
			GL.viewport(0,0,_canvas.width, _canvas.height);
			GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); //FILL VIEWPORT
		},

		draw_search: function(detectStates){
			that.draw_video();

			GL.enable(GL.BLEND);
			GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
			GL.useProgram(_shps.search.program);
			detectStates.forEach(function(detectState){
				GL.uniform1f(_shps.search.uniforms.detected, detectState.detected);
				var xPx=((detectState.x+1)*0.5*_canvas.width),
					yPx=((detectState.y+1)*0.5*_canvas.height),
					wPx=Math.round(detectState.s*_canvas.width);
				GL.viewport(Math.round(xPx-wPx/2), Math.round(yPx-wPx/2), wPx, wPx);
				console.log(Math.round(xPx-wPx/2), Math.round(yPx-wPx/2), wPx, wPx);
				GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); //FILL VIEWPORT
			});
		},

		instance: function(specFaceCut){
			//Initialize a facecut object

			//create a POT texture which will be used to compute the hue Texture

			//create the hue Texture which will be used for color correction


			//public dynamic methods :
			var that={
				cut: function(detectState){

				},

				render: function(detectStatePos){ //render this faceCut on detectStatePos place

				}

			}; //end that;
			return that;
		} //end instance()
	}; //end superThat
	return superThat;
})();
