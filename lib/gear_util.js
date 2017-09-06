//工具
module.exports={

    /**
     * @returns {Array} 如果arr中的元素存在空字符串''，则去掉该空字符串
     */
    skipEmptyElementForArray:arr=>{
    let a = [];
    for (let i in arr){
        if('' !== arr[i]){
            a.push(arr[i]);
        }
    }
    return a;
}
};