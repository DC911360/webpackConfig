const path = require('path')
const os = require('os')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const thread = os.cpus().length

module.exports = {
    //入口文件
    entry: './src/main.js', //相对路径
    //输入文件
    output: {
        path: undefined, //绝对路径
        filename: 'static/js/main.js',
        // assetModuleFilename:'static/images/[hash][ext][query]',
        clean: true, //打包前，将 path 目录进行清空，再进行打包
    },
    //加载器 loader
    module: {
        rules: [
            {
                //每个文件只能被一个 loader 处理
                oneOf: [
                    //loader 配置
                    // {
                    //     test: /\.css$/i, //检测 .css 结尾的文件 使用 use Loader 规则解析
                    //     use: [ // 执行顺序从右到左，从下到上，  
                    //         'style-loader', //  将js 中的css 通过创建style 标  签  添加到 html中去生效
                    //         'css-loader'    //  将css源 编译成commonjs的模块到js中
                    //     ], 
                    // },
                    {
                        test: /\.css$/i, //检测 .css 结尾的文件 使用 use Loader 规则解析
                        use: [ // 执行顺序从右到左，从下到上，  
                            MiniCssExtractPlugin.loader, //  
                            'css-loader'    //  将css源 编译成commonjs的模块到js中
                        ],
                    },

                    {
                        test: /\.less$/, //检测 .css 结尾的文件 使用 use Loader 规则解析
                        use: [ // 执行顺序从右到左，从下到上，  
                            MiniCssExtractPlugin.loader,// 'style-loader', //  将js 中的css 通过创建style 标签添加到 html中去生效
                            'css-loader',    //  将css源 编译成commonjs的模块到js中
                            'less-loader'
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            // 'style-loader',
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader',
                        ]
                    },

                    {
                        test: /\.styl$/,
                        use: [
                            // 'style-loader',
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'stylus-loader',
                        ]
                    },
                    {
                        test: /\.(jpe?g|png|webp|svg)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/images/[hash][ext][query]'
                        }
                    },
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/fonts/[hash][ext][query]'
                        }
                    },
                    {
                        test: /\.(mp3|mp4)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/media/[hash][ext][query]'
                        }
                    },

                    {
                        test: /\.m?js$/,
                        // exclude include 只能用一种
                        //exclude: /node_modules/, //排除  node_moudle 中的js 文件
                        include: path.resolve(__dirname, "../src"), // 只处理src 下的文件，其他文件不处理
                        // use: {
                        //   loader: 'babel-loader',
                        //   options: {
                        //     // presets: ['@babel/preset-env'],
                        //     cacheDirectory:true, //开启babel 缓存
                        //     cacheCompression:false, //关闭缓存文件压缩
                        //   },
                        // },
                        use: [
                            {
                                loader: "thread-loader", //开启多进程
                                options: {
                                    workers: 2  //2 个进程
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets: ['@babel/preset-env'],
                                    cacheDirectory: true, //开启babel 缓存
                                    cacheCompression: false, //关闭缓存文件压缩
                                    plugins:['@babel/plugin-transform-runtime']
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
        //plugins 配置
        new ESLintPlugin({
            //context 检查那些文件
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_module',
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads: true,
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new MiniCssExtractPlugin(),
        // new TerserPlugin({
        //     parallel:thread
        // })

    ],
    optimization: {
        //压缩的操作
        // minimizer: [
        //     new MiniCssExtractPlugin(),
        //     new TerserPlugin({
        //         parallel: thread
        //     })
        // ],
        minimizer:[
            new CssMinimizerPlugin(), //css 压缩
            new TerserPlugin({ //多线程 压缩js
                parallel:thread
            })
        ]

        

    },
    // optimization:{
    //     //压缩的操作
    //     minimizer:[
    //         new CssMinimizerPlugin(), //css 压缩
    //         new TerserPlugin({ //多线程 压缩js
    //             parallel:thread
    //         })
    //     ]
    // },

    //开发服务器配置 , 开发模式下不会输出资源，在内存中编译打包

    devServer: {
        host: 'localhost',
        port: '3000',
        open: true,
        hot: true, //热更新 默认 true
    },
    //模式
    mode: 'development',
    devtool: "cheap-module-source-map",
}

/*

    配置文件： 入口，出口 ，module 加载器 loader加载器，插件 plugins， 模式


    开发模式：
    1.编译代码，使用浏览器能识别运行 ， 样式资源，字体图标，图片资源，html资源，webpack 默认情况下 webpack 处理不了，所以要加载配置来编译资源
    2.代码质量检查，树立代码规范

    处理样式资源 如何处理：Css、Less、Sass、Scss、Style

    npm install --save-dev css-loader


    执行命令：
    npx webpack  在当前文件跟目录进行 查找 webpack.config.js 配置文件 进行打包输出

    如果没有配置文件的话： npx webpack ./src/main.js --mode development

    

*/