precision highp float;

uniform float u_time;
uniform vec2 u_size;
uniform float u_lines;
uniform float u_offset;

float dist(vec2 uv, float time, float offset) {
    vec2 off = vec2(0.0, 0.2);
    uv += off;
    time += offset;
    return abs(uv.y - sin(uv.x * cos(uv.x + time) * cos(uv.x + time) + time));
}

void main(void) {
    vec2 uv = vec2(gl_FragCoord.x / u_size.x, gl_FragCoord.y / u_size.y) * 2.0 - 1.0;

    float a = 3.0;
    float b = 2.01;
    float p1 = 1.3;
    float p2 = 1.7;

    float n = 5.0;
    float col = 0.0;

    for(float i = u_time; i <= u_time + n; i += 0.02) {
        float x = sin(a * i + p1) * pow(2.0, cos(i)) / 5.0;
        float y = cos(b * i + p2) * pow(2.0, sin(i)) / 5.0;
        vec2 di = vec2(x, y);
        float dis = length(uv - di);
        col += clamp(1.0 - dis * 40.0, 0.0, 1.0);
    }

    gl_FragColor = vec4(col, log(col), sqrt(col), 1.0);
}