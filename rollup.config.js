import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import vue from 'rollup-plugin-vue';
import cjs from '@rollup/plugin-commonjs'
import postcss from "rollup-plugin-postcss";
import node from "@rollup/plugin-node-resolve";

import packageInfo from './package.json'
import { text } from './build/banner.json'

import fs from 'fs'
import path from 'path'

const baseFolderPath = './presstojam/src/components/';
const banner = text.replace('${version}', packageInfo.version)

const components = fs
.readdirSync(baseFolderPath)
.filter((f) =>
  fs.statSync(path.join(baseFolderPath, f)).isDirectory()
);

const babelOptions = {
  babelHelpers: 'bundled'
}


const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const vuePluginConfig = {
  template: {
      isProduction: true,
      compilerOptions: {
          whitespace: 'condense'
      }
  }
}



//give components their own folder and the following js:

/*

https://www.thisdot.co/blog/how-to-create-and-deploy-a-vue-component-library-to-npm

*/

/*
const entries = {
  'index': './presstojam/src/index.js',
  ...components.reduce((obj, name) => {
      obj[name] = (baseFolderPath + name)
      return obj
  }, {})
}
*/



export default () => {
  let config = [
  /*  {
      input: entries,
      external: ['vue'],
      output: {
          format: 'esm',
          dir: `dist/esm`,
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name]-[hash].mjs',
      },
      plugins: [
          node({
              extensions: ['.vue']
          }),
          vue(vuePluginConfig),
          babel(babelOptions),
          cjs(),
          postcss({
            extract : false,
            modules : true
          }),
          nodeResolve()
      ]
    },*/
    {
      input: './presstojam/src/index.js',
      external: ['vue'],
      output: {
          format: 'esm',
          file: 'dist/presstojam.mjs',
          banner: banner,
          inlineDynamicImports : true
      },
      plugins: [
          node({
              extensions: ['.vue', '.ts']
          }),
          vue(vuePluginConfig),
          babel(babelOptions),
          cjs(),
          postcss({
            extract : false,
            modules : true
          }),
          nodeResolve()
      ]
  }

  ];

  if (process.env.MINIFY === 'true') {
      config = config.filter((c) => !!c.output.file)
      config.forEach((c) => {
          c.output.file = c.output.file.replace(/\.m?js/g, r => `.min${r}`)
          c.plugins.push(terser({
              output: {
                  comments: '/^!/'
              }
          }))
      })
  }
  return config
}


/*

export default [
{
    // UMD
    input: "./presstojam/src/js/container-plugin.js",
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
      postcss({
        extract : false,
        modules : true
      })
    ],
    output: [
     {
       // file : 'dist/ptj.esm.js',
        format : "esm",
        dir : 'dist',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name]-[hash].mjs',
    }
    ],
    external : [
        'vue'
    ]
  },
]

*/