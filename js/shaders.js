const fragment = `
uniform vec2 u_resolution;

uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform vec2 u_textureFactor;
uniform vec2 u_texture2Factor;
uniform float u_textureProgress;

// RGB
uniform vec2 u_rgbPosition;
uniform vec2 u_rgbVelocity;

varying float zz;
varying vec2 vUv;
vec2 centeredAspectRatio(vec2 uvs, vec2 factor){
    return uvs * factor - factor /2. + 0.5;
}
void main(){
    // On THREE 102 The image is has Y backwards
    // vec2 flipedUV = vec2(vUv.x,1.-vUv.y);

    vec2 normalizedRgbPos = u_rgbPosition / u_resolution;
    normalizedRgbPos.y = 1. - normalizedRgbPos.y; 

    
    vec2 vel = u_rgbVelocity;
    float dist = distance(normalizedRgbPos + vel / u_resolution, vUv.xy);

    float ratio = clamp(1.0 - dist * 5., 0., 1.);


    vec4 tex1 = vec4(1.);
    vec4 tex2 = vec4(1.);

    vec2 uv = vUv;

    uv.x -= sin(uv.y) * ratio / 100. * (vel.x + vel.y) / 7.;
    uv.y -= sin(uv.x) * ratio / 100. * (vel.x + vel.y) / 7.;

    tex1.r = texture2D(u_texture, centeredAspectRatio(uv, u_textureFactor )).r;
    tex2.r = texture2D(u_texture2, centeredAspectRatio(uv, u_textureFactor )).r;

    
    uv.x -= sin(uv.y) * ratio / 150. * (vel.x + vel.y) / 7.;
    uv.y -= sin(uv.x) * ratio / 150. * (vel.x + vel.y) / 7.;

    tex1.g = texture2D(u_texture, centeredAspectRatio(uv, u_textureFactor )).g;
    tex2.g = texture2D(u_texture2, centeredAspectRatio(uv, u_textureFactor )).g;
    
    uv.x -= sin(uv.y) * ratio / 300. * (vel.x + vel.y) / 7.;
    uv.y -= sin(uv.x) * ratio / 300. * (vel.x + vel.y) / 7.;

    tex1.b = texture2D(u_texture, centeredAspectRatio(uv, u_textureFactor )).b;
    tex2.b = texture2D(u_texture2, centeredAspectRatio(uv, u_textureFactor )).b;
     
    


    vec4 fulltex1 = texture2D(u_texture, centeredAspectRatio(vUv, u_textureFactor) );
    vec4 fulltex2 = texture2D(u_texture2, centeredAspectRatio(vUv, u_texture2Factor));
    
    vec4 mixedTextures =  mix(tex1,tex2,u_textureProgress);

    gl_FragColor = mixedTextures;
    // gl_FragColor = vec4(
    //     normalizedRgbPos.x,
    //     vel.y / u_resolution.x,
    //     0.,
    //     1.);

    // gl_FragColor = vec4(vec3(zz),1.);
}
`;

const vertex = `
#define PI 3.14159265359
uniform float u_viewSize;
uniform float u_progress;
uniform float u_direction;
uniform float u_time;
uniform float u_effect;
uniform float u_waveIntensity;
varying vec2 vUv;
varying float zz;
void main(){
    vec3 pos = position.xyz;

    float distance = length(uv.xy - 0.5 );
    float sizeDist = length(vec2(0.5,0.5));
    float normalized = distance/sizeDist ;

    // normalized = smoothstep(0.1,1.,normalized);
    float stickOutEffect = normalized ;
    float stickInEffect = -normalized ;

    
    float stickEffect = mix(stickOutEffect,stickInEffect, u_direction);

    float stick = 0.5;
    // Backwards V wave.

    float stickInInfluence = u_progress*(1. / stick); 

    float stickOutInfluence =  -( u_progress - 1.) * (1./(1.-stick) );

    // Not clamped so it is allowed to bounce 
    float stickProgress = min(stickInInfluence, stickOutInfluence);

    float offset = 12.;

    // We can re-use stick Influcse because this oen starts at the same position
    float offsetInProgress = clamp(stickInInfluence,0.,1.);

    // here, we need to invert stickout to get the slope moving upwards to the right
    // and move it left by 1
    float offsetOutProgress = clamp(1.-stickOutInfluence,0.,1.);

    float offsetProgress = mix(offsetInProgress,offsetOutProgress,u_direction);


    float stickOffset = offset;
    pos.z += stickEffect * stickOffset * stickProgress  - offset * offsetProgress;

    // out. eff = 0, pro = 0; dir = 1;
    // in. eff = 1, pro= 1, dir  = 0;
    
    pos.z += sin(distance * 10. - u_time * 2. )  * u_waveIntensity;

    gl_Position =   
        projectionMatrix * 
        modelViewMatrix * 
         vec4(pos, 1.0);

    zz = normalized;
    vUv = uv;
}
`;

export { fragment, vertex };
