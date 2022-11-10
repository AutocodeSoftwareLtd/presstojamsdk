const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');


const ASSET_PATH = '/dist/';

let entries = {};

entries["ptj-controller"] = "./presstojam/src/components/ptj-controller.vue";
entries["presstojam"] = "./presstojam/src/js/container-plugin.js"


module.exports = (env) => {
 return {
   mode : 'production',
   entry : entries,
   optimization: {
    minimize: true,
    mergeDuplicateChunks : true
  },
   output : {
        filename: '[name].js',
        path: path.resolve("./dist"),
       // iife: true,
        publicPath: ASSET_PATH,
        library : {
          type : 'module'
        },
        chunkFilename: '[name].bundle.js'
   },
   experiments : {
    outputModule : true
   },                       
   module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          }
          /*,
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use : [
              {
              loader : 'url-loader',
                options : {
                        limit : 10000
                        //imimetype : 'application/font-woff',
                        //outputPath : 'dist/'
                 }
             }
            ]
          },
          {
                test:/\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use : [
                  {
                    loader: "file-loader", 
                    options : {
                      //outputPath : 'dist/'
                    }
                  }
                ]
          }*/

      ]
   },
   resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [new VueLoaderPlugin()],
  externals : [
    "PrimeVue", "primevue", "vue", "vue-router", "vue-il8n"
  ],
 // devtool : 'source-map'
}
}
