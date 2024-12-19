import Matrix4 from 'claygl/src/math/Matrix4.js';
import Vector3 from 'claygl/src/math/Vector3.js';
import Texture2D from 'claygl/src/Texture2D.js';
import Texture from 'claygl/src/Texture.js';
import Pass from 'claygl/src/compositor/Pass.js';
import Shader from 'claygl/src/Shader.js';
import FrameBuffer from 'claygl/src/FrameBuffer.js';

function EdgePass(opt) {
    opt = opt || {};

    this._edgePass = new Pass({
        fragment: Shader.source('ecgl.edge')
    });

    this._edgePass.setUniform('normalTexture', opt.normalTexture);
    this._edgePass.setUniform('depthTexture', opt.depthTexture);

    this._targetTexture = new Texture2D({
        type: Texture.HALF_FLOAT
    });

    this._frameBuffer = new FrameBuffer();
    this._frameBuffer.attach(this._targetTexture);
}

EdgePass.prototype.update = function (renderer, camera, sourceTexture, frame) {
    var width = renderer.getWidth();
    var height = renderer.getHeight();
    var texture = this._targetTexture;
    texture.width = width;
    texture.height = height;
    var frameBuffer = this._frameBuffer;

    frameBuffer.bind(renderer);
    this._edgePass.setUniform('projectionInv', camera.invProjectionMatrix.array);
    this._edgePass.setUniform('textureSize', [width, height]);
    this._edgePass.setUniform('texture', sourceTexture);
    this._edgePass.render(renderer);

    frameBuffer.unbind(renderer);
};

EdgePass.prototype.getTargetTexture = function () {
    return this._targetTexture;
};

EdgePass.prototype.setParameter = function (name, val) {
    this._edgePass.setUniform(name, val);
};

EdgePass.prototype.dispose = function (renderer) {
    this._targetTexture.dispose(renderer);
    this._frameBuffer.dispose(renderer);
};

export default EdgePass;
