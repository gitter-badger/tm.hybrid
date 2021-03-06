/** @namespace */
var tm = tm || {};
/** @namespace */
tm.hybrid = tm.hybrid || {};

/*
 * hybridapp.js
 */

(function() {
    // var tm = require("../../../libs/tmlib");
    // var THREE = require("../../../libs/three");
    // require("./scene");
    
    tm.define("tm.hybrid.Application", {
        superClass: "tm.display.CanvasApp",

        threeRenderer: null,
        threeCanvas: null,

        /**
         * @constructor tm.hybrid.Application
         * @param {HTMLCanvasElement|String} canvas2d canvas element or id for draw 2d graphics
         * @param {HTMLCanvasElement|String} canvas3d canvas element or id for draw 3d graphics
         * @extends {tm.display.CanvasApp}
         *
         * @property {THREE.WebGLRenderer} threeRenderer
         * @property {HTMLCanvasElement} threeCanvas
         */
        init: function(canvas2d, canvas3d) {
            this.superInit(canvas2d);
            this.setupThree(canvas3d);
            this.background = "transparent";

            this.replaceScene(tm.hybrid.Scene())
        },

        /**
         * @memberOf tm.hybrid.Application.prototype
         * @private
         */
        setupThree: function(canvas3d) {
            var param = {
                antialias: true,
            };
            if (canvas3d) {
                if (canvas3d instanceof HTMLCanvasElement) {
                    param.canvas = canvas3d;
                } else if (typeof canvas3d === "string") {
                    param.canvas = document.querySelector(canvas3d);
                }
            }
            this.threeRenderer = new THREE.WebGLRenderer(param);
            this.threeRenderer.setClearColor("0x000000");

            // if (this.element.parentNode) {
            //     this.element.parentNode.insertBefore(this.threeRenderer.domElement, this.element);
            // } else {
            //     window.document.body.appendChild(this.threeRenderer.domElement);
            // }

            this.threeCanvas = this.threeRenderer.domElement;
        },

        fitWindow: function(everFlag) {
            var _fitFunc = function() {
                everFlag = everFlag === undefined ? true : everFlag;
                var e = this.threeCanvas;
                var s = e.style;

                s.position = "absolute";
                s.margin = "auto";
                s.left = "0px";
                s.top = "0px";
                s.bottom = "0px";
                s.right = "0px";

                var rateWidth = e.width / window.innerWidth;
                var rateHeight = e.height / window.innerHeight;
                var rate = e.height / e.width;

                if (rateWidth > rateHeight) {
                    s.width = innerWidth + "px";
                    s.height = innerWidth * rate + "px";
                } else {
                    s.width = innerHeight / rate + "px";
                    s.height = innerHeight + "px";
                }
            }.bind(this);

            // 一度実行しておく
            _fitFunc();
            // リサイズ時のリスナとして登録しておく
            if (everFlag) {
                window.addEventListener("resize", _fitFunc, false);
            }

            return tm.display.CanvasApp.prototype.fitWindow.call(this, everFlag);
        },

        _update: function() {
            tm.app.CanvasApp.prototype._update.call(this);
            var scene = this.currentScene;
            if (this.awake && scene instanceof tm.hybrid.Scene) {
                this.updater.update(scene.three.camera);
                this.updater.update(scene.three);
            }
        },

        _draw: function() {
            tm.display.CanvasApp.prototype._draw.call(this);
            var scene = this.currentScene;
            if (scene instanceof tm.hybrid.Scene) {
                scene.render(this.threeRenderer);
            }
        },

        resize: function(w, h) {
            this.threeRenderer.setSize(w, h);
            var scene = this.currentScene;
            if (scene instanceof tm.hybrid.Scene) {
                scene.three.camera.aspect = w / h;
            }
            return tm.display.CanvasApp.prototype.resize.call(this, w, h);
        }
    });
})();
