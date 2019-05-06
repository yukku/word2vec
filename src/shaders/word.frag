uniform sampler2D wordTexture;
varying vec2 vUv;
varying vec3 vPosition;
uniform float fogNear;
uniform float fogFar;


void main() {
    vec4 texture = texture2D(wordTexture, vUv);
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep( fogNear, fogFar, depth);
    gl_FragColor.rgb = mix( texture.rgb, vec3(0.0, 0.0, 0.0), fogFactor );
    gl_FragColor.a = texture.a;
}
