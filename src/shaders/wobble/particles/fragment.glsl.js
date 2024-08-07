export default /*glsl */`
varying vec3 vColor;
void main()
{
    float distanceToCenter = length(gl_PointCoord - 0.5);
  // if(distanceToCenter > 0.5)
     //   discard;
     vec2 uv = gl_PointCoord;
     float alpha = 0.05/distanceToCenter - 0.1;
    gl_FragColor = vec4(0,1.0,1.0,alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}` 