const app = new Vue({
    el: '#app',
    data: {
        // 所有人员信息
        students: [],
        // 分页后的人员信息
        pageStudents: [],
        // 请求根地址
        baseURL: "http://192.168.0.115:8000/",
        // 查询变量
        inputStr: '',
        // 分页用变量
        total: 0,
        currentpage: 1,
        pagesize: 10,
    },
    mounted() {
        this.getStudents();
    },
    methods: {
        // 获取所有人员信息
        getStudents: function () {
            let that = this
            axios
                .get(this.baseURL + "students/")

                .then(function (res) {
                    if (res.data.code === 1) {
                        that.students = res.data.data;
                        that.total = res.data.data.length;
                        that.getPageStudents();
                        that.$message({
                            message: '数据加载成功！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })

                .catch(function (err) {
                    console.log(err);
                })
        },
        // 获取当前分页人员信息
        getPageStudents() {
            this.pageStudents = [];
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                this.pageStudents.push(this.students[i]);
                if (this.pageStudents.length === this.pagesize) break;
            }
        },
        // 查询人员信息
        queryStudents() {
            // 使用Ajax POST请求,传递inputStr
            let that = this

            axios
                // 开始Ajax请求
                .post(
                    that.baseURL + "students/query/",
                    {
                        inputstr: that.inputStr
                    }
                )
                // api接口成功
                .then(function (res) {
                    // 判断code状态码 1成功 0失败
                    if (res.data.code === 1) {
                        // 读取返回查询数据
                        that.students = res.data.data;
                        // 读取返回数据长度
                        that.total = res.data.data.length;
                        // 调用分页函数进行分页
                        that.getPageStudents();
                        // 弹出查询成功消息
                        that.$message({
                            message: "查询成功！",
                            type: 'success'
                        });
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })
                // api接口失败
                .catch(function (err) {
                    console.log(err);
                    that.$message.error("获取后端查询数据异常！");
                });
        },
        // 显示全部并清空搜索框
        getAllStudents(){
            this.inputStr ="";
            this.getStudents();
        },
        // 分页设置
        handleSizeChange(size) {
            this.pagesize = size;
            this.getPageStudents();
        },
        // 翻页
        handleCurrentChange(pageNumber) {
            this.currentpage = pageNumber;
            this.getPageStudents();
        },
    },
})

