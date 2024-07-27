# webpackConfig

a webpackConfig record

### run
```
$ git clone https://github.com/DC911360/webpackConfig.git
$ npm install 
$ npm start/ npm run dev
$ npm run build
```


### webpackConfig project-tree
```
webpackConfig
├─ .eslintignore          //使用 vscode 插件:eslint ,忽略检查文件配置
├─ .eslintrc.js           //webpack plugin: eslint 配置
├─ .gitignore
├─ README.md
├─ babel.config.js
├─ config
│  ├─ webpack.dev.js      // npm run dev 配置文件
│  └─ webpack.prod.js     // npm run build 配置文件
├─ dist  //打包后的文件目录
│  ├─ index.html
│  └─ static
│     ├─ css
│     │  ├─ main.css
│     │  └─ main.css.map
│     ├─ fonts
│     │  ├─ 7ee89d8c9e2a15c19066.ttf
│     │  ├─ 96760264d2cf75bcb8f7.woff
│     │  └─ eb6c80f289c5d2f786d8.woff2
│     ├─ images
│     │  └─ bd451ead02c925d6d275.jpg
│     └─ js
│        ├─ main.js
│        └─ main.js.map
├─ package-lock.json
├─ package.json
├─ public
│  └─ index.html
└─ src
   ├─ css
   │  ├─ iconfont.css
   │  └─ index.css
   ├─ fonts
   │  ├─ iconfont.ttf
   │  ├─ iconfont.woff
   │  └─ iconfont.woff2
   ├─ images
   │  └─ bg.jpg
   ├─ js
   │  ├─ add.js
   │  └─ count.js
   ├─ less
   │  └─ index.less
   ├─ main.js
   ├─ scss
   │  └─ index.scss
   └─ stylus
      └─ index.styl

```

### webpack.config.dev/prod.js

##### 用到的 webpack 字段：

- entry //入口文件
- output //输入文件
- module //处理 js,css,resource 等 加载器 loader
- plugins // 插件
- optimization // 优化压缩选项
- devServer // 开发服务器配置
- mode //模式 development,production
- devtool //sourceMap



### 代码引用

```
const path = require('path')
const os = require('os')
const ESLintPlugin = require('eslint-webpack-plugin');  //eslint plugin
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html template
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 生成link 外部css文件plugin
const TerserPlugin = require("terser-webpack-plugin"); // 压缩js plugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 压缩css plugin

const isProduction = process.env.NODE_ENV;

// 处理loader 执行顺序 从下到上 ，从右到左  
function getStyleLoader(pre) {
    return [
       isProduction? MiniCssExtractPlugin.loader: "style-loader",
        'css-loader', 
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env", "autoprefixer"]
                }
            },
        },
        pre
    ].filter(Boolean)
}

module.exports = {
    //入口文件
    entry: "./src/main.js", //相对路径
    //输入文件
    output: {
        path:isProduction?path.resolve(__dirname,"../dist") undefined, //绝对路径
        filename: "static/js/main.js",
        //assetModuleFilename:"static/images/[hash][ext][query]",
        clean: true, //打包前，将 path 目录进行清空，再进行打包
    },
    //加载器 loader
    module: {
        rules: [
            {
                //每个文件只能被一个 loader 处理
                oneOf: [
                    //loader 配置
                    {
                        test: /\.css$/i, //检测 .css 结尾的文件 使用 use Loader 规则解析
                        use: getStyleLoader()
                       
                    },
                    {
                        test: /\.less$/, //检测 .css 结尾的文件 使用 use Loader 规则解析
                        use: getStyleLoader("less-loader") 
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use:  getStyleLoader("sass-loader")
                    },

                    {
                        test: /\.styl$/,
                        use:  getStyleLoader("stylus-loader") 
                    },
                    {
                        test: /\.(jpe?g|png|webp|svg)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/images/[hash][ext][query]"
                        }
                    },
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: "asset/resource',
                        generator: {
                            filename: "static/fonts/[hash][ext][query]"
                        }
                    },
                    {
                        test: /\.(mp3|mp4)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/media/[hash][ext][query]"
                        }
                    },

                    {
                        test: /\.m?js$/,
                        // exclude include 只能用一种
                        //exclude: /node_modules/, //排除  node_moudle 中的js 文件
                        include: path.resolve(__dirname, "../src"), // 只处理src 下的文件，其他文件不处理
                        use: [
                            {
                                loader: "thread-loader", //开启多进程
                                options: {
                                    workers: 2  //2 个进程
                                }
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, //开启babel 缓存
                                    cacheCompression: false, //关闭缓存文件压缩
                                    plugins:["@babel/plugin-transform-runtime"]
                                },

                            }
                        ]
                    },
                ]
            }
        ],
    },
    //插件
    plugins: [
        new ESLintPlugin({
            //context 检查那些文件
            context: path.resolve(__dirname, "../src"),
            exclude: 'node_module',
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads: true,
        }),
       
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        new MiniCssExtractPlugin(),
        // new TerserPlugin({
        //     parallel:thread
        // })

    ],
    optimization: {
        //压缩的操作
        minimizer:[
            new CssMinimizerPlugin(), //css 压缩
            new TerserPlugin({ //多线程 压缩js
                parallel:thread
            })
        ]
    },

    //开发服务器配置 , 开发模式下不会输出资源，在内存中编译打包

    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true, //热更新 默认 true
    },
    //模式
    mode: isProduction?"production":"development",
    devtool: isProduction?"sourcmap": "cheap-module-source-map",
}

```

#### 使用的 npm 依赖

babel js 相关的

```
  @babel/core
  @babel/plugin-transform-runtime
  @babel/preset-env
  babel-loader
```

webpack 相关的

```
webpack
webpack-dev-server
webpack-cli
```

eslint js 相关的

```
eslint
eslint-webpack-plugin
```

css 相关的

```
mini-css-extract-plugin
style-loader
css-loader
postcss
postcss-loader
postcss-preset-env
less
less-loader
sass
sass-loader
stylus
stylus-loader
```

多线程 打包

```
thread-loader
```
