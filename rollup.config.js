import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import vue from 'rollup-plugin-vue';
import postcss from "rollup-plugin-postcss";
import replace from 'rollup-plugin-replace';
import node from "@rollup/plugin-node-resolve";

//const input = ["src/index.js"];
export default [
{
    // UMD
    input: "./import.js",
    plugins : [
      nodeResolve(),
      node({ browser : true}),
      babel({
        babelHelpers: "bundled", exclude: "node_modules/**"
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      terser(),
      vue(),
      postcss()
    ],
    output: [
      {
      file: "dist/ptj.min.js",
      format: "umd",
      name: "ptj",
      esModule: false,
      //exports: "named",
      sourcemap: true,
      globals : {
        vue : 'Vue'
      }
     },
     { 
         file: 'dist/ptj.cjs.js',
         format : "cjs",
         exports : "named",
         sourcemap : true,
         globals : {
             vue : 'Vue'
         }
     },
     { 
        file : 'dist/ptj.esm.js',
        format : "esm",
        exports : "named",
        sourcemap : true,
        globals : {
            vue : 'Vue'
        }
    }
    ],
    external : [
        'vue'
    ]
  },
]