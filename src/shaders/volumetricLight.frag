varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 lightPosition;
uniform float exposure;
uniform float decay;
uniform float density;
uniform float weight;
uniform int samples;
const int MAX_SAMPLES = 100;
void main(){
  vec2 texCoord = vUv;
  vec2 deltaTextCoord = texCoord - lightPosition;
  deltaTextCoord *= 1.0 / float(samples) * density;
  vec4 color = texture2D(tDiffuse, texCoord);
  float illuminationDecay = 1.0;
  for(int i=0; i < MAX_SAMPLES; i++)
  {
    if(i == samples){
      break;
    }
    texCoord += deltaTextCoord;
    vec4 sample = texture2D(tDiffuse, texCoord);
    sample *= illuminationDecay * weight;
    color += sample;
    illuminationDecay *= decay;
  }
  gl_FragColor = color * exposure;
  // gl_FragColor = texture2D(tDiffuse, vUv);
  // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
}
