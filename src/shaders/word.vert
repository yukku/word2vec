varying vec2 vUv;
// varying vec3 vPosition;

// varying vec3 vNormal;,
// varying vec3 vWorldPosition;,

 

void main() {
    vUv = uv;
    // vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);;
}
