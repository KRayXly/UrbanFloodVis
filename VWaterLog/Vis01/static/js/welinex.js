//展示页面动态背景
$(document).ready(function () {

    "use strict";

    var starfield = $('#starfield');

    if (starfield.length) {
      starfield.starfield();
    }
});

! function($, window, document, undefined) {
    var isPlaying, animId, that, Starfield = function(el, options) {
            this.el = el, this.$el = $(el), this.options = options, that = this
        },
        isInited = !1,
        canCanvas = !1;
    ! function() {
        for (var lastTime = 0, vendors = ["ms", "moz", "webkit", "o"], x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(callback) {
            var currTime = (new Date).getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall)
                }, timeToCall);
            return lastTime = currTime + timeToCall, id
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        })
    }(), Starfield.prototype = {
        defaults: {
            starColor: "rgba(255,255,255,1)",
            bgColor: "rgba(31,31,31,1)",
            mouseMove: !0,
            mouseColor: "rgba(0,0,0,1)",
            mouseSpeed: 20,
            fps: 20,
            speed: 2,
            quantity: 512,
            ratio: 256,
            divclass: "starfield"
        },
        resizer: function() {
            var oldStar = this.star,
                initW = this.context.canvas.width,
                initH = this.context.canvas.height;
            this.w = this.$el.width(), this.h = this.$el.height(), this.x = Math.round(this.w / 2), this.y = Math.round(this.h / 2), this.portrait = this.w < this.h;
            var ratX = this.w / initW,
                ratY = this.h / initH;
            this.context.canvas.width = this.w, this.context.canvas.height = this.h;
            for (var i = 0; i < this.n; i++) this.star[i][0] = oldStar[i][0] * ratX, this.star[i][1] = oldStar[i][1] * ratY, this.star[i][3] = this.x + this.star[i][0] / this.star[i][2] * this.star_ratio, this.star[i][4] = this.y + this.star[i][1] / this.star[i][2] * this.star_ratio;
            that.context.fillStyle = that.settings.bgColor, this.context.strokeStyle = this.settings.starColor
        },
        init: function() {
            this.settings = $.extend({}, this.defaults, this.options);
            var url = document.location.href;
            this.n = parseInt(-1 != url.indexOf("n=") ? url.substring(url.indexOf("n=") + 2, -1 != url.substring(url.indexOf("n=") + 2, url.length).indexOf("&") ? url.indexOf("n=") + 2 + url.substring(url.indexOf("n=") + 2, url.length).indexOf("&") : url.length) : this.settings.quantity), this.flag = !0, this.test = !0, this.w = 0, this.h = 0, this.x = 0, this.y = 0, this.z = 0, this.star_color_ratio = 0, this.star_x_save = 0, this.star_y_save = 0, this.star_ratio = this.settings.ratio, this.star_speed = this.settings.speed, this.star_speed_save = 0, this.star = new Array(this.n), this.color = this.settings.starColor, this.opacity = .1, this.cursor_x = 0, this.cursor_y = 0, this.mouse_x = 0, this.mouse_y = 0, this.canvas_x = 0, this.canvas_y = 0, this.canvas_w = 0, this.canvas_h = 0, this.fps = this.settings.fps, this.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|IEMobile)/), this.orientationSupport = window.DeviceOrientationEvent !== undefined, this.portrait = null;
            var canvasInit = function() {
                that.w = that.$el.width(), that.h = that.$el.height(), that.initW = that.w, that.initH = that.h, that.portrait = that.w < that.h, that.wrapper = $("<canvas />").addClass(that.settings.divclass), that.wrapper.appendTo(that.el), that.starz = $("canvas", that.el), that.starz[0].getContext && (that.context = that.starz[0].getContext("2d"), canCanvas = !0), that.context.canvas.width = that.w, that.context.canvas.height = that.h
            };
            canvasInit();
            var starInit = function() {
                if (canCanvas) {
                    that.x = Math.round(that.w / 2), that.y = Math.round(that.h / 2), that.z = (that.w + that.h) / 2, that.star_color_ratio = 1 / that.z, that.cursor_x = that.x, that.cursor_y = that.y;
                    for (var i = 0; i < that.n; i++) that.star[i] = new Array(5), that.star[i][0] = 2 * Math.random() * that.w - 2 * that.x, that.star[i][1] = 2 * Math.random() * that.h - 2 * that.y, that.star[i][2] = Math.round(Math.random() * that.z), that.star[i][3] = 0, that.star[i][4] = 0;
                    that.context.fillStyle = that.settings.bgColor, that.context.strokeStyle = that.settings.starColor
                }
            };
            starInit(), isInited = !0
        },
        anim: function() {
            this.mouse_x = this.cursor_x - this.x, this.mouse_y = this.cursor_y - this.y, this.context.fillRect(0, 0, this.w, this.h);
            for (var i = 0; i < this.n; i++) this.test = !0, this.star_x_save = this.star[i][3], this.star_y_save = this.star[i][4], this.star[i][0] += this.mouse_x >> 4, this.star[i][0] > this.x << 1 && (this.star[i][0] -= this.w << 1, this.test = !1), this.star[i][0] < -this.x << 1 && (this.star[i][0] += this.w << 1, this.test = !1), this.star[i][1] += this.mouse_y >> 4, this.star[i][1] > this.y << 1 && (this.star[i][1] -= this.h << 1, this.test = !1), this.star[i][1] < -this.y << 1 && (this.star[i][1] += this.h << 1, this.test = !1), this.star[i][2] -= this.star_speed, this.star[i][2] > this.z && (this.star[i][2] -= this.z, this.test = !1), this.star[i][2] < 0 && (this.star[i][2] += this.z, this.test = !1), this.star[i][3] = this.x + this.star[i][0] / this.star[i][2] * this.star_ratio, this.star[i][4] = this.y + this.star[i][1] / this.star[i][2] * this.star_ratio, this.star_x_save > 0 && this.star_x_save < this.w && this.star_y_save > 0 && this.star_y_save < this.h && this.test && (this.context.lineWidth = 2 * (1 - this.star_color_ratio * this.star[i][2]), this.context.beginPath(), this.context.moveTo(this.star_x_save, this.star_y_save), this.context.lineTo(this.star[i][3], this.star[i][4]), this.context.stroke(), this.context.closePath())
        },
        loop: function() {
            this.anim(), animId = window.requestAnimationFrame(function() {
                that.loop()
            })
        },
        move: function() {
            var doc = document.documentElement;

            var handleOrientation = (event) => {
                if (null !== event.beta && null !== event.gamma) {
                    var x = event.gamma,
                        y = event.beta;
                    if (!this.portrait) {
                        x = -1 * event.beta;
                        y = event.gamma;
                    }
                    // 使用Math.min和Math.max来限制速度
                    this.cursor_x = this.w / 2 + Math.min(Math.max(5 * x, -100), 150);
                    this.cursor_y = this.h / 2 + Math.min(Math.max(5 * y, -100), 150);
                }
            };

            var handleMousemove = (event) => {
                var mouseX = event.pageX || event.clientX + doc.scrollLeft - doc.clientLeft;
                var mouseY = event.pageY || event.clientY + doc.scrollTop - doc.clientTop;
                // 计算与中心点的差值
                var dx = mouseX - this.w / 2;
                var dy = mouseY - this.h / 2;
                // 计算差值的长度
                var length = Math.sqrt(dx * dx + dy * dy);
                // 如果长度超过100，则进行限制
                if (length > 100) {
                    dx *= 100 / length;
                    dy *= 100 / length;
                }
                this.cursor_x = this.w / 2 + dx;
                this.cursor_y = this.h / 2 + dy;
            };

            if (this.orientationSupport && !this.desktop) {
                window.addEventListener("deviceorientation", handleOrientation, false);
            } else {
                window.addEventListener("mousemove", handleMousemove, false);
            }
        },
        stop: function() {
            window.cancelAnimationFrame(animId), isPlaying = !1
        },
        start: function() {
            return isInited || (isInited = !0, this.init()), isPlaying || (isPlaying = !0, this.loop()), window.addEventListener("resize", function() {
                that.resizer()
            }, !1), window.addEventListener("orientationchange", function() {
                that.resizer()
            }, !1), this.settings.mouseMove && this.move(), this
        }
    }, Starfield.defaults = Starfield.prototype.defaults, $.fn.starfield = function(options) {
        return this.each(function() {
            new Starfield(this, options).start()
        })
    }, window.Starfield = Starfield
}(jQuery, window, document);
setTimeout(del, 10000);

for (i=0; i<10; i++){
  function del() {
    jQuery('#layer-current').css('display','block');
    setTimeout(interval, 30500);
  };
 
function interval() {
  jQuery('#layer-current').css('display','none');
  setTimeout(del, 6000);
}
}