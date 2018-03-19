

attribute vec3 Position;
attribute vec4 SourceColor;
attribute vec2 TexCoordIn;

varying vec2 TexCoordOut;
varying vec4 DestinationColor;
                                       
uniform mat4 Projection;
uniform mat4 ModelView;

                                                
void main(void)
{
    DestinationColor = SourceColor;
    gl_Position = Projection * ModelView * vec4(Position, 1.0);
    TexCoordOut = TexCoordIn;
}
