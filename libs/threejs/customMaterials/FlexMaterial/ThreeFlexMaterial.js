"use strict";

THREE.FlexMaterial=function(spec){
    var _worldMatrixDelayed=new THREE['Matrix4']();

    //same handy function
    function mix(a,b,t){
        a.set(
            b.x*t+a.x*(1-t),
            b.y*t+a.y*(1-t),
            b.z*t+a.z*(1-t)
        );
    }
    
    //tweak shaders helpers
    function tweak_shaderAdd(code, chunk, glslCode){
        return code.replace(chunk, chunk+"\n"+glslCode);
    }
    function tweak_shaderDel(code, chunk){
        return code.replace(chunk, '');
    }
    function tweak_shaderRepl(code, chunk, glslCode){
        return code.replace(chunk, glslCode);
    }

    //get PHONG shader and tweak it :
    var phongShader=THREE.ShaderLib.phong;
    var vertexShaderSource=phongShader.vertexShader;
    vertexShaderSource=tweak_shaderAdd(vertexShaderSource, '#include <common>',
        'uniform mat4 modelMatrixDelayed;\n'
        +'uniform sampler2D flexMap;\n'
        //+'uniform float flexRatio;\n' //MT223
    );
    vertexShaderSource=tweak_shaderDel(vertexShaderSource, '#include <worldpos_vertex>');
    vertexShaderSource=tweak_shaderRepl(vertexShaderSource, '#include <project_vertex>',
        "vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n\
        vec4 worldPositionDelayed = modelMatrixDelayed * vec4( transformed, 1.0 );\n\
        worldPosition = mix(worldPosition, worldPositionDelayed, texture2D(flexMap, uv).r);\n\
        vec4 mvPosition = viewMatrix* worldPosition;\n\
        gl_Position = projectionMatrix * mvPosition;");


    //MT223 : le flexRatio est chelou, tu l'appliquais comme un facteur d'échelle de la worlPosition, a savoir la position dans le ref WORLD :
    //worldPosition = mix(worldPosition, worldPositionDelayed, texture2D(flexMap, uv).r)*flexRatio;
    //l'origine du ref world étant le centre de la caméra dans ce cas, ca allait faire n'importe quoi
    //de plus flexRatio valait 0 car il est mal initialisé

    var uniforms0={
        'modelMatrixDelayed': {
            'value': _worldMatrixDelayed
        },
        'flexMap': {
            value: spec.flexMap
        },
        'opacity': {
            value: (typeof(spec.opacity)!=='undefined')?spec.opacity:1
        },
        // Add the flexRatio which defaults to 1 and is maxed at 1
        //MT223 : comment :
        //'flexRatio': (typeof(spec.flexRatio)!=='undefined' && spec.flexRatio < 1) ? spec.flexRatio : 1
        //MT223 - regarde comment sont les uniforms juste dessus, si tu avais voulu bien déclaré flexRatio tu aurais mis :
        //flexRatio: {value: ....}
    };
    var uniforms=Object.assign({}, phongShader.uniforms, uniforms0);
    
    var isMorphs=(spec.morphTargets)?true:false;
    var mat = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: phongShader.fragmentShader,
        uniforms: uniforms,
        transparent: (spec.transparent)?true:false,
        lights: true,
        morphTargets: isMorphs,
        morphNormals: isMorphs,

    });
    mat.flexMap=spec.flexMap;
    mat.opacity=mat.uniforms.opacity; //shortcut
    //mat.flexRatio=mat.uniforms.flexRatio; //shortcut //MT223

    if (typeof(spec.map)!=='undefined') {
        uniforms.map={value: spec.map};
        mat.map=spec.map;
    }
    if (typeof(spec.alphaMap)!=='undefined') {
        uniforms.alphaMap={value: spec.alphaMap};
        mat.transparent=true;
        mat.alphaMap=spec.alphaMap;
    }

    if (typeof(spec.bumpMap)!=='undefined') {
        uniforms.bumpMap={value: spec.bumpMap};
        mat.bumpMap=spec.bumpMap;
    }

    if (typeof(spec.bumpScale)!=='undefined') {
        uniforms.bumpScale={value: spec.bumpScale};
        mat.bumpScale=spec.bumpScale;
    }

    if (typeof(spec.shininess)!=='undefined') {
        uniforms.shininess={value: spec.shininess};
        mat.shininess=spec.shininess;
    }
/*
    if (typeof(spec.specular)!=='undefined') {
        uniforms.specular={value: spec.specular};
        mat.specular=spec.specular;
    }
*/
    var _positionDelayed=new THREE.Vector3();
    var _scaleDelayed=new THREE.Vector3();
    var _eulerDelayed=new THREE['Euler']();
    var _initialized=false;

    mat.set_amortized=function(positionTarget, scaleTarget, eulerTarget, parentMatrix, amortization){
        if (!_initialized){
            if (positionTarget){
                _positionDelayed.copy(positionTarget);
            }
            if (scaleTarget){
                _scaleDelayed.copy(scaleTarget);
            }
            if (eulerTarget){
                _eulerDelayed.copy(eulerTarget);
            }
            _initialized=true;
        }

        if (eulerTarget){
            mix( _eulerDelayed, eulerTarget, amortization );
            _worldMatrixDelayed['makeRotationFromEuler'](_eulerDelayed);
        }
        
        if (positionTarget){
            mix( _positionDelayed, positionTarget, amortization );
            _worldMatrixDelayed['setPosition'](_positionDelayed);
        }

        if (scaleTarget){
            mix(_scaleDelayed, scaleTarget, amortization );
            _worldMatrixDelayed['scale'](_scaleDelayed);
        }

        if (parentMatrix){
            _worldMatrixDelayed.multiplyMatrices(parentMatrix, _worldMatrixDelayed);
        }
    }

    return mat;
};
