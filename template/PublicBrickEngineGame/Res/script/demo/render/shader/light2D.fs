uniform sampler2D uSampler;
uniform sampler2D nSampler;

uniform lowp vec3 lightPos;
uniform lowp vec3 adjustAtt;
uniform lowp vec4 lightColor;
uniform lowp vec4 ambientColor;
varying lowp vec4 DestColor;
varying lowp vec2 TexCoordOut;

void main()
{
    lowp vec3 lightDir = vec3(lightPos.x - gl_FragCoord.x, lightPos.y - gl_FragCoord.y, lightPos.z);
    lowp float D = length(lightDir);
    lowp float Attenuation = 1.0/(adjustAtt.x + adjustAtt.y * D + adjustAtt.z * D * D);
    
    
    lowp vec3 normalMap = texture2D(nSampler, TexCoordOut).rgb;
    
    lowp vec3 N = normalize(normalMap * 2.0 - 1.0);
    lowp vec3 L = normalize(lightDir);
    
    lowp float diffuse = max(dot(L, N), 0.0);
    gl_FragColor = texture2D(uSampler, TexCoordOut) * (ambientColor + lightColor * diffuse * Attenuation);
}
