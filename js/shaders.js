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
}
`;

const vertex = `
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
    float sizeDist = length(vec2(u_viewSize)) /2.;
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

    float eff = clamp(effect-0.5,0.,1.);
    float eff2 = clamp(-effect+0.5,0.,1.);


    // The mix cancel out at 0.5
    // When effect hits 1. the effects cancel out.
    float inMix = mix(inside,outside, clamp(effect-0.5,0.,1.) );
    // Not sure out works because it hits 0, maning it does not calcel out
    float outMix = mix(outside,inside,  clamp(effect-0.5,0.,1.) );
    zChange = mix(inMix,outMix, dir);
    // zChange = inMix;

    // zChange = mix(inside,outside, u_progress-0.5 );
    // zChange = -1.+normalized ;
    // zChange += -normalized ;

    // pos.z +=  distance;
    // pos.z -=  1.- distance;
    // pos.z =  pos.z - (u_viewSize - distance) ;
    // pos.z += 1.- distance;


    // Alright, the in animation looks great.
    // But the out animation is lacking because it doesn't really seems like
    // its getting close from the center
    // That happens because when going out, the progress is closing to 0
    // And makes the effect go away when getting closer to the screen
    // The idea would be to separate the progress of the effect and the progress
    // of the z-movement. And make the effect last a bit longer


    pos.z += zChange * pp *  9.;

    
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
