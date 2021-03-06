    function game() {
        this.map = document.querySelector('.map')
        this.span = document.querySelector('body>p>span')
        this.span1 = document.querySelector('.end span')
        this.start = document.querySelector('.start')
        this.end = document.querySelector('.end')
        this.ok = document.querySelector('.ok')
        var that = this
            //地图的宽高
        this.mpcw = this.map.clientWidth
        this.mpch = this.map.clientHeight
            //点击方向键改变方向
        document.onkeydown = function(e) {
                var cod = e.keyCode
                    //w:87 a:65 s:83 d:68    ↑:38 ←:37 ↓:40 →:39
                if (cod == 87 || cod == 38) {
                    if (that.fx != 'down') {
                        that.fx = 'up'
                    }
                } else if (cod == 65 || cod == 37) {
                    if (that.fx != 'right') {
                        that.fx = 'left'
                    }
                } else if (cod == 83 || cod == 40) {
                    if (that.fx != 'up') {
                        that.fx = 'down'
                    }
                } else if (cod == 68 || cod == 39) {
                    if (that.fx != 'left') {
                        that.fx = 'right'
                    }
                }
            }
            //开始游戏
        this.sta()
            //游戏结束
        this.ok.onclick = function() {
            that.en()
        }
    }
    //开始游戏
    game.prototype.sta = function() {
            //初始化蛇
            this.reset()
            this.bd = []
            var that = this
            this.start.style.display = 'block'
            this.start.onclick = function() {
                that.start.style.display = 'none'
                    //创建食物
                that.food()
                    //创建蛇
                that.snake()
                    //蛇的移动
                that.timer = setInterval(() => {
                    that.fun()
                }, 70)
            }
        }
        //初始化
    game.prototype.reset = function() {
            this.arr = [
                { x: this.mpcw / 2, y: this.mpch / 2 },
                { x: this.mpcw / 2, y: this.mpch / 2 + 10 },
                { x: this.mpcw / 2, y: this.mpch / 2 + 20 },
            ]
            this.fx = 'up'
            this.timer = null
                //分数
            this.sp = 0
            this.span.innerText = this.sp
        }
        //设置样式
    game.prototype.setStyle = function(elm, obj) {
            for (var attr in obj) {
                elm.style[attr] = obj[attr];
            }
        }
        //获取随机数
    game.prototype.getRandom = function(a, b) {
            var max = Math.max(a, b)
            var min = Math.min(a, b)
            return Math.round(Math.random() * (max - min) + min)
        }
        //创建食物
    game.prototype.food = function() {
            this.l = Math.round(this.getRandom(0, this.mpcw - 10) / 10) * 10
            this.t = Math.round(this.getRandom(0, this.mpch - 10) / 10) * 10
            this.fd = document.createElement('div')
            this.setStyle(this.fd, {
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'green',
                position: 'absolute',
                left: this.l + 'px',
                top: this.t + 'px',
            })
            this.map.appendChild(this.fd)
        }
        //创建蛇
    game.prototype.snake = function() {
            if (this.bd.length != 0) {
                for (var i = 0; i < this.bd.length; i++) {
                    this.map.removeChild(this.bd[i])
                }
                this.bd = []
            }
            for (var i = 0; i < this.arr.length; i++) {
                var div = document.createElement('div')
                this.setStyle(div, {
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'black',
                    position: 'absolute',
                    left: this.arr[i].x + 'px',
                    top: this.arr[i].y + 'px',
                })
                if (i == 0) {
                    div.style.background = 'red'
                }
                this.map.appendChild(div)
                this.bd.push(div)
            }
        }
        //蛇的移动
    game.prototype.fun = function() {
            for (var i = this.arr.length - 1; i > 0; i--) {
                this.arr[i].x = this.arr[i - 1].x
                this.arr[i].y = this.arr[i - 1].y
            }
            switch (this.fx) {
                case 'up':
                    this.arr[0].y -= 10;
                    break;
                case 'down':
                    this.arr[0].y += 10;
                    break;
                case 'left':
                    this.arr[0].x -= 10;
                    break;
                case 'right':
                    this.arr[0].x += 10;
                    break;
            }
            //位置变后重新创建蛇
            this.snake()
                //吃到食物
            this.eat()
                //死亡判断
            this.die()
        }
        //吃到食物
    game.prototype.eat = function() {
            if (this.arr[0].x == this.l && this.arr[0].y == this.t) {
                this.map.removeChild(this.fd)
                this.food()
                this.sp += 1
                this.span.innerText = this.sp
                this.arr.push({ x: this.arr[this.arr.length - 1].x, y: this.arr[this.arr.length - 1].y })
            }
        }
        //死亡判断
    game.prototype.die = function() {
            //撞墙
            if (this.arr[0].x < 0 || this.arr[0].x > this.mpcw - this.fd.offsetWidth || this.arr[0].y < 0 || this.arr[0].y > this.mpch - this.fd.offsetHeight) {
                this.died()
            }
            //撞身体
            for (var i = 1; i < this.arr.length; i++) {
                if (this.arr[0].x == this.arr[i].x && this.arr[0].y == this.arr[i].y) {
                    this.died()
                }
            }
        }
        //死亡函数
    game.prototype.died = function() {
            clearInterval(this.timer)
            this.end.style.display = 'block'
            this.span1.innerText = this.sp
            this.span1.style.color = 'red'
        }
        //游戏结束
    game.prototype.en = function() {
        this.end.style.display = 'none'
        this.reset()
        this.map.removeChild(this.fd)
        this.start.style.display = 'block'
        for (var i = 0; i < this.bd.length; i++) {
            this.map.removeChild(this.bd[i])
        }
        this.bd = []
    }
    var a = new game()