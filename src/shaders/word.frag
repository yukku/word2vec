uniform sampler2D wordTexture;
varying vec2 vUv;
varying vec3 vPosition;
uniform float fogNear;
uniform float fogFar;
uniform float highlightIntensity;


void main() {
    vec3 highlightColour = vec3(2.0, 232.0, 190.0)/255.0;

    vec4 texture = texture2D(wordTexture, vUv);
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep( fogNear, fogFar, depth);
    gl_FragColor.rgb = mix( mix(texture.rgb, highlightColour, highlightIntensity), vec3(0.0, 0.0, 0.0), fogFactor );
    gl_FragColor.a = texture.a;
}
