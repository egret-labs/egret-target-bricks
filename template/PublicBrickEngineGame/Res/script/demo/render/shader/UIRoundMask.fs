

varying lowp vec4 DestinationColor;                                     
varying lowp vec2 TexCoordOut;
                                                    
uniform sampler2D Texture;
uniform lowp float Progress;

highp float PI = 3.1415926;
//lowp float ZERO = 0.00000001;


void main(void)
{
    lowp vec4 tc = texture2D(Texture, TexCoordOut);
    gl_FragColor = DestinationColor * tc;

    lowp float xd = TexCoordOut.x - 0.5;
    lowp float yd = TexCoordOut.y - 0.5;
    lowp float x2 = xd * xd;
    lowp float y2 = yd * yd;
    if (x2 + y2 < 0.25)
    {
        lowp float angle = Progress * PI * 2.0;
        if (angle < PI * 0.5)
        {
            if (TexCoordOut.x >= 0.5 && 
                TexCoordOut.y <= 0.5)
            {
                if (xd != 0.0)
                {
                    lowp float k = -yd / xd;
                    lowp float ca = atan(k);
                    if (PI * 0.5 - ca < angle)
                    {
                        gl_FragColor.a = 0.0;
                    }
                }
            }
        }
        else if (angle < PI)
        {
            if (TexCoordOut.x >= 0.5 && 
                TexCoordOut.y <= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else if (TexCoordOut.x >= 0.5 && 
                     TexCoordOut.y >= 0.5)
            {
                if (xd != 0.0)
                {
                    lowp float k = yd / xd;
                    lowp float ca = atan(k);
                    if (PI * 0.5 + ca < angle)
                    {
                        gl_FragColor.a = 0.0;
                    }
                }
            }
        }
        else if (angle < PI * 1.5)
        {
            if (TexCoordOut.x >= 0.5 && 
                TexCoordOut.y <= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else if (TexCoordOut.x >= 0.5 && 
                     TexCoordOut.y >= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else if (TexCoordOut.x <= 0.5 && 
                     TexCoordOut.y >= 0.5)
            {
                if (xd != 0.0)
                {
                    lowp float k = yd / -xd;
                    lowp float ca = atan(k);
                    if (PI * 1.5 - ca < angle)
                    {
                        gl_FragColor.a = 0.0;
                    }
                }
            }
        }
        else
        {
             if (TexCoordOut.x >= 0.5 && 
                TexCoordOut.y <= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else if (TexCoordOut.x >= 0.5 && 
                     TexCoordOut.y >= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else if (TexCoordOut.x <= 0.5 && 
                     TexCoordOut.y >= 0.5)
            {
                gl_FragColor.a = 0.0;
            }
            else
            {
                if (xd != 0.0)
                {
                    lowp float k = yd / xd;
                    lowp float ca = atan(k);
                    if (PI * 1.5 + ca < angle)
                    {
                        gl_FragColor.a = 0.0;
                    }
                }
            }
        }
    }
    else
    {
        gl_FragColor.a = 0.0;
    }    
}

