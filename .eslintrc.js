module.exports={
    //继承 eslint 规则
    extends:["eslint:recommended"],
    env:{
        node:true, //启用 node 中全局变量
        browser:true //启用 浏览器中 全局变量
    },
    parserOptions:{
        ecmaVersion:6, //es6 版本
        sourceType:"module" //esm
    },

    rules:{
        "no-var":2 ,//不能使用 var 声明变量
    }
} 