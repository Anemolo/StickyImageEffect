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

    float ratio = clamp(1.0 - dist * 10., 0., 1.);


    vec4 tex1 = vec4(1.);
    vec4 tex2 = vec4(1.);

    vec2 uv = vUv;

    uv.x -= sin(uv.y) * ratio / 100. * (vel.x + vel.y) / 10.;
    uv.y -= sin(uv.x) * ratio / 100. * (vel.x + vel.y) / 10.;

    tex1.r = texture2D(u_texture, centeredAspectRatio(uv, u_textureFactor )).r;
    tex2.r = texture2D(u_texture2, centeredAspectRatio(uv, u_textureFactor )).r;

    
    uv.x -= sin(uv.y) * ratio / 150. * (vel.x + vel.y) / 10.;
    uv.y -= sin(uv.x) * ratio / 150. * (vel.x + vel.y) / 10.;

    tex1.g = texture2D(u_texture, centeredAspectRatio(uv, u_textureFactor )).g;
    tex2.g = texture2D(u_texture2, centeredAspectRatio(uv, u_textureFactor )).g;
    
    uv.x -= sin(uv.y) * ratio / 300. * (vel.x + vel.y) / 10.;
    uv.y -= sin(uv.x) * ratio / 300. * (vel.x + vel.y) / 10.;

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
    float zChange = 0.;

    float distance = length(position.xy );
    float sizeDist = length(vec2((u_viewSize * 1.5) / 1.6, u_viewSize / 1.6));
    float normalized = distance/sizeDist;

    float stickyness = 0.5;

    float inside = -1.+normalized;
    float outside = -normalized;

    float pp = 0.;
    float dir = 1.;
    float effect = 0.;

    pp = u_progress;
    dir = u_direction;
    effect = u_effect;



    // The mix cancel out at 0.5
    // When effect hits 1. the effects cancel out.
    float inMix = mix(inside,outside, clamp(effect-0.5,0.,1.) );
    // Not sure out works because it hits 0, maning it does not calcel out
    // 
    // goes from 1 to 0;
    // on 0 it should nullify
    // This works because inside and outside are swapped
    float outMix = mix(inside,outside,  clamp(effect+0.5,0.,1.) );
    
    float outEffect = sin((1.-effect) * PI - PI/2.) *0.5 + 0.5;
    float inEffect = sin(effect * PI - PI/2.) *0.5 + 0.5;


    zChange = mix(inMix,outMix, dir);


    float eff = mix(u_progress, 1.-u_progress, dir);

    pos.z += (-(sin(zChange * PI - PI/2.))) * 4. - u_progress * 8.;

    // out. eff = 0, pro = 0; dir = 1;
    // in. eff = 1, pro= 1, dir  = 0;
    
    pos.z += sin(distance * 2. - u_time * 2.)  * u_waveIntensity;

    gl_Position =   
        projectionMatrix * 
        modelViewMatrix * 
         vec4(pos, 1.0);

    zz = zChange;
    vUv = uv;
}
`;

export { fragment, vertex };
