"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

export interface InkCanvasHandle {
  prewarm: () => boolean;
  playLeave: (
    originX: number,
    originY: number,
    onCoverReady: () => void,
    onComplete: () => void
  ) => void;
  playEnter: (
    onPageVisible90: () => void,
    onComplete: () => void
  ) => void;
  reset: () => void;
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_origin;
uniform float u_progress;
uniform float u_reveal;
uniform vec3 u_color;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p *= 2.02;
  f += 0.2500 * snoise(p); p *= 2.03;
  f += 0.1250 * snoise(p);
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 origin = vec2(u_origin.x * aspect, u_origin.y);
  
  // Calculate maximum distance to screen corners for uniform expansion
  float d0 = distance(origin, vec2(0.0, 0.0));
  float d1 = distance(origin, vec2(aspect, 0.0));
  float d2 = distance(origin, vec2(0.0, 1.0));
  float d3 = distance(origin, vec2(aspect, 1.0));
  float maxDist = max(max(d0, d1), max(d2, d3));
  float dist = distance(p, origin) / max(maxDist, 0.001);
  
  // Organic capillary noise boundary
  float noise = fbm(p * 3.4 + vec2(u_reveal * 4.3, u_reveal * 2.1));
  float field = dist + noise * 0.24;
  
  float alpha = 0.0;
  if (u_reveal < 0.5) {
    // COVERING: ink blot grows outward
    float threshold = mix(-0.12, 1.28, u_progress);
    alpha = smoothstep(threshold + 0.025, threshold - 0.025, field);
  } else {
    // REVEALING: organic aperture opens outward
    float holeThreshold = mix(1.28, -0.12, u_progress);
    alpha = smoothstep(holeThreshold - 0.025, holeThreshold + 0.025, field);
  }
  
  if (alpha <= 0.001) {
    discard;
  }
  
  gl_FragColor = vec4(u_color, alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const InkCanvas = forwardRef<InkCanvasHandle, { className?: string }>(function InkCanvas(
  { className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<{
    resolution?: WebGLUniformLocation | null;
    origin?: WebGLUniformLocation | null;
    progress?: WebGLUniformLocation | null;
    reveal?: WebGLUniformLocation | null;
    color?: WebGLUniformLocation | null;
  }>({});

  const stateRef = useRef({
    origin: { x: 0.5, y: 0.5 },
    progress: 0.0,
    reveal: 0.0,
    animating: false,
    visible: false,
  });

  const animFrameIdRef = useRef<number | null>(null);

  // Lazy WebGL initialization helper
  const initGL = useCallback(() => {
    if (glRef.current && programRef.current) return true;
    const canvas = canvasRef.current;
    if (!canvas) return false;

    let gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    }

    if (!gl) {
      console.warn("WebGL not supported for InkCanvas transition, falling back to basic transitions.");
      return false;
    }

    glRef.current = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

    if (!vs || !fs) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;

    // Full screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    uniformsRef.current = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      origin: gl.getUniformLocation(program, "u_origin"),
      progress: gl.getUniformLocation(program, "u_progress"),
      reveal: gl.getUniformLocation(program, "u_reveal"),
      color: gl.getUniformLocation(program, "u_color"),
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    return true;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const gl = glRef.current;
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);

    // Pre-warm WebGL during idle time so navigation is instantaneous
    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        idleId = (window as any).requestIdleCallback(() => initGL(), { timeout: 2000 });
      } else {
        timerId = setTimeout(() => initGL(), 1000);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (idleId && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timerId) clearTimeout(timerId);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [initGL]);

  const renderFrame = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    gl.useProgram(program);

    const { resolution, origin, progress, reveal, color } = uniformsRef.current;
    const { origin: orig, progress: prog, reveal: rev } = stateRef.current;

    gl.uniform2f(resolution!, canvas.width, canvas.height);
    gl.uniform2f(origin!, orig.x, orig.y);
    gl.uniform1f(progress!, prog);
    gl.uniform1f(reveal!, rev);
    // Deep Charcoal Ink #111212
    gl.uniform3f(color!, 17.0 / 255.0, 18.0 / 255.0, 18.0 / 255.0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  useImperativeHandle(ref, () => ({
    prewarm: () => initGL(),
    playLeave: (
      originX: number,
      originY: number,
      onCoverReady: () => void,
      onComplete: () => void
    ) => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.display = "block";
        canvas.style.pointerEvents = "auto";
      }

      // Check reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !initGL()) {
        onCoverReady();
        onComplete();
        return;
      }

      // Origin in normalized WebGL coords (y flipped because WebGL 0 is bottom)
      stateRef.current.origin = {
        x: Math.max(0, Math.min(1, originX / window.innerWidth)),
        y: Math.max(0, Math.min(1, 1.0 - originY / window.innerHeight)),
      };
      stateRef.current.reveal = 0.0;
      stateRef.current.animating = true;
      stateRef.current.visible = true;

      const duration = 360; // 360ms cover (720ms total transition)
      const startTime = performance.now();
      let coverReadyCalled = false;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // easeInOutQuad
        const eased =
          rawProgress < 0.5
            ? 2 * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        stateRef.current.progress = eased;
        renderFrame();

        // Signal route change early when screen is visually engulfed (removes black screen pause)
        if (!coverReadyCalled && (rawProgress >= 0.80 || eased >= 0.80)) {
          coverReadyCalled = true;
          onCoverReady();
        }

        if (rawProgress < 1) {
          animFrameIdRef.current = requestAnimationFrame(animate);
        } else {
          stateRef.current.progress = 1.0;
          renderFrame();
          if (!coverReadyCalled) {
            coverReadyCalled = true;
            onCoverReady();
          }
          onComplete();
        }
      };

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(animate);
    },

    playEnter: (onPageVisible90: () => void, onComplete: () => void) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        onPageVisible90();
        onComplete();
        return;
      }

      // Check reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !initGL()) {
        canvas.style.display = "none";
        canvas.style.pointerEvents = "none";
        onPageVisible90();
        onComplete();
        return;
      }

      stateRef.current.reveal = 1.0;
      stateRef.current.animating = true;

      const duration = 360; // 360ms reveal (720ms total transition)
      const startTime = performance.now();
      let visible90Called = false;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // easeOutQuad from 1 down to 0
        const eased = 1 - (1 - (1 - rawProgress) * (1 - rawProgress));

        stateRef.current.progress = eased;
        renderFrame();

        // Trigger page entrance animations once page is 90% visible
        if (!visible90Called && (rawProgress >= 0.82 || eased <= 0.12)) {
          visible90Called = true;
          onPageVisible90();
        }

        if (rawProgress < 1) {
          animFrameIdRef.current = requestAnimationFrame(animate);
        } else {
          stateRef.current.progress = 0.0;
          renderFrame();
          stateRef.current.animating = false;
          stateRef.current.visible = false;
          if (canvas) {
            canvas.style.display = "none";
            canvas.style.pointerEvents = "none";
          }
          if (!visible90Called) {
            visible90Called = true;
            onPageVisible90();
          }
          onComplete();
        }
      };

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(animate);
    },

    reset: () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      stateRef.current.animating = false;
      stateRef.current.visible = false;
      stateRef.current.progress = 0.0;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.display = "none";
        canvas.style.pointerEvents = "none";
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "none" }}
      className={`fixed inset-0 z-[9999] pointer-events-none w-full h-full ${className}`}
    />
  );
});
