export default function count(...args){
    return args.reduce((p,c)=> p+c ,0)
}