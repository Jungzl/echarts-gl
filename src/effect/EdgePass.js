import {Matrix4} from 'claygl';
import {Vector3} from 'claygl';
import {Texture2D} from 'claygl';
import {Texture} from 'claygl';
import {compositor} from 'claygl';
import {Shader} from 'claygl';
import {FrameBuffer} from 'claygl';

function EdgePass(opt) {
    opt = opt || {};

    this._edgePass = new compositor.Pass({
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
