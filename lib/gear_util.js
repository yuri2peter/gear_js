//工具
module.exports = {

    /**
     * @returns {Array} 如果arr中的元素存在空字符串''，则去掉该空字符串
     */
    skipEmptyElementForArray: arr => {
        let a = [];
        for (let i in arr) {
            if ('' !== arr[i]) {
                a.push(arr[i]);
            }
        }
        return a;
    },

    /** 删除缓存的加载模块 */
    requireWithoutCache(require_path){
        delete require.cache[require.resolve(require_path)];
        return require(require_path);
    }
};