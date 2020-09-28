import * as React from "react";

function SvgQmark(props) {
  return (
    <svg width="1em" height="1em" {...props}>
      <defs>
        <filter colorInterpolationFilters="sRGB" id="qmark_svg__a">
          <feGaussianBlur in="SourceAlpha" stdDeviation={23} result="result1" />
          <feDiffuseLighting
            in="result1"
            diffuseConstant={0.8}
            surfaceScale={23}
            lightingColor="#00f"
            kernelUnitLength={1}
            result="result2"
          >
            <feDistantLight azimuth={225} elevation={32} />
          </feDiffuseLighting>
          <feComposite
            in="result2"
            in2="SourceGraphic"
            operator="arithmetic"
            k2={1}
            k3={1}
            result="result3"
          />
          <feComposite
            operator="in"
            in="result3"
            in2="SourceGraphic"
            result="result4"
          />
          <feGaussianBlur in="result4" stdDeviation={3} result="result5" />
          <feComposite operator="in" in="result5" in2="SourceGraphic" />
        </filter>
      </defs>
      <path
        d="M396 200a196 196 0 01-392 0 196 196 0 11392 0z"
        fill="#003"
        filter="url(#qmark_svg__a)"
      />
      <path
        d="M396 200a196 196 0 01-392 0 196 196 0 11392 0z"
        fill="none"
        stroke="#000"
        strokeWidth={8}
      />
      <path
        d="M200.359 248.139h-15.83c-.304-17.841.02-36.684 9.862-52.273 12.996-20.584 27.808-42.38 27.534-67.872-.172-15.916-7.836-34.381-24.777-37.852-11.085-2.271-26.247-2.553-32.87 7.45-5.556 8.39 12.302 13.667 14.995 22.741 12.398 41.781-43.045 52.087-54.456 18.518-6.287-18.494 2.757-38.816 18.071-49.77 42.75-30.582 128.118-21.395 133.827 29.573 5.39 48.125-35.068 67.694-62.625 92.092-11.713 10.37-14.21 24.24-13.731 37.393zm-8.08 16.699c19.855-.27 35.873 20.275 30.915 39.632-4.668 18.22-25.824 28.958-43.117 21.667-17.145-7.23-24.986-29.88-15.054-45.756 5.832-9.323 16.135-15.392 27.256-15.543z"
        fill="#fff"
      />
    </svg>
  );
}

export default SvgQmark;
