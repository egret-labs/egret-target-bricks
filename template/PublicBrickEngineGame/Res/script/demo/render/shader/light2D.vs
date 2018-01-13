
attribute vec3 Position;
attribute vec2 TexCoordIn;
attribute vec4 SourceColor;

uniform mat4 ModelView;
uniform mat4 Projection;

varying vec4 DestColor;
varying vec2 TexCoordOut;

void main()
{
    mat4 gWVP = Projection * ModelView;
    gl_Position = gWVP * vec4(Position, 1);
    DestColor = SourceColor;
    TexCoordOut = TexCoordIn;
}
