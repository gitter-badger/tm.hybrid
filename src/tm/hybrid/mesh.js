/*
 * mesh.js
 */

(function() {
    // var tm = require("../../../libs/tmlib");
    // var THREE = require("../../../libs/three");
    // require("./delegateutil");
    // require("./threeelement");

    tm.define("tm.hybrid.Mesh", {
        superClass: "tm.hybrid.ThreeElement",

        /**
         * @constructor tm.hybrid.Mesh
         * @param {THREE.Mesh} mesh
         * @extends {tm.hybrid.ThreeElement}
         * @mixes THREE.Mesh
         */
        init: function(mesh) {
            if (typeof(mesh) === "string") {
                var threeJSON = tm.asset.Manager.get(mesh);
                if (threeJSON) {
                    this.superInit(threeJSON.mesh.clone());
                } else {
                    console.error("アセット'{0}'がないよ".format(mesh));
                }
            } else if (mesh instanceof THREE.Mesh) {
                this.superInit(mesh);
            } else if (mesh instanceof THREE.Geometry) {
                if (arguments.length >= 2) {
                    this.superInit(new THREE.Mesh(meth, arguments[1]));
                } else {
                    this.superInit(new THREE.Mesh(mesh));
                }
            } else {
                this.superInit(new THREE.Mesh());
            }
        },
    });

    var delegater = tm.hybrid.DelegateUtil(tm.hybrid.Mesh);

    /**
     * @method
     * @memberOf tm.hybrid.Mesh.prototype
     * @param {THREE.Geometry} geometry
     * @returns this
     */
    function setGeometry() {}
    delegater.property("geometry");

    /**
     * @method
     * @memberOf tm.hybrid.Mesh.prototype
     * @param {THREE.Material} material
     * @returns this
     */
    function setMaterial() {}
    delegater.property("material");

    delegater.method("getMorphTargetIndexByName", true);
    delegater.method("updateMorphTargets", true);

})();
