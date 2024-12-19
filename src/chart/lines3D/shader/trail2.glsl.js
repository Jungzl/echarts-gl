export default "// Inspired by https://github.com/uber/deck.gl/tree/master/examples/trips/trips-layer\r\n@export ecgl.trail2.vertex\r\nattribute vec3 position: POSITION;\r\nattribute vec3 positionPrev;\r\nattribute vec3 positionNext;\r\nattribute float offset;\r\n// Distance to first point.\r\nattribute float dist;\r\nattribute float distAll;\r\n// Start distance/time\r\nattribute float start;\r\n\r\nattribute vec4 a_Color : COLOR;\r\n\r\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\r\nuniform vec4 viewport : VIEWPORT;\r\nuniform float near : NEAR;\r\n\r\nuniform float speed : 0;\r\nuniform float trailLength: 0.3;\r\nuniform float time;\r\nuniform float period: 1000;\r\n\r\nuniform float spotSize: 1;\r\n\r\nvarying vec4 v_Color;\r\nvarying float v_Percent;\r\nvarying float v_SpotPercent;\r\n\r\n@import ecgl.common.wireframe.vertexHeader\r\n\r\n@import ecgl.lines3D.clipNear\r\n\r\nvoid main()\r\n{\r\n @import ecgl.lines3D.expandLine\r\n\r\n gl_Position = currProj;\r\n\r\n v_Color = a_Color;\r\n\r\n @import ecgl.common.wireframe.vertexMain\r\n\r\n#ifdef CONSTANT_SPEED\r\n float t = mod((speed * time + start) / distAll, 1. + trailLength) - trailLength;\r\n#else\r\n float t = mod((time + start) / period, 1. + trailLength) - trailLength;\r\n#endif\r\n\r\n float trailLen = distAll * trailLength;\r\n\r\n v_Percent = (dist - t * distAll) / trailLen;\r\n\r\n v_SpotPercent = spotSize / distAll;\r\n\r\n // if (t > 1.0 - trailLength) {\r\n // float t2 = t - 1.0;\r\n // v_Percent = max(v_Percent, (dist - t2 * distAll) / trailLen);\r\n // }\r\n}\r\n@end\r\n\r\n\r\n@export ecgl.trail2.fragment\r\n\r\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\r\nuniform float spotIntensity: 5;\r\n\r\nvarying vec4 v_Color;\r\nvarying float v_Percent;\r\nvarying float v_SpotPercent;\r\n\r\n@import ecgl.common.wireframe.fragmentHeader\r\n\r\n@import clay.util.srgb\r\n\r\nvoid main()\r\n{\r\n if (v_Percent > 1.0 || v_Percent < 0.0) {\r\n discard;\r\n }\r\n\r\n float fade = v_Percent;\r\n\r\n#ifdef SRGB_DECODE\r\n gl_FragColor = sRGBToLinear(color * v_Color);\r\n#else\r\n gl_FragColor = color * v_Color;\r\n#endif\r\n\r\n @import ecgl.common.wireframe.fragmentMain\r\n\r\n // Spot part\r\n // PENDING\r\n if (v_Percent > (1.0 - v_SpotPercent)) {\r\n gl_FragColor.rgb *= spotIntensity;\r\n // gl_FragColor.rgb *= (10.0 * (v_Percent - 1.0 + v_SpotPercent) / v_SpotPercent + 1.0);\r\n }\r\n\r\n gl_FragColor.a *= fade;\r\n}\r\n\r\n@end";
