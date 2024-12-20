import * as echarts from 'echarts/lib/echarts';
import ZRTextureAtlasSurface from '../../util/ZRTextureAtlasSurface.js';
import LabelsMesh from '../../util/mesh/LabelsMesh.js';
import retrieve from '../../util/retrieve.js';
import { getItemVisualColor, getItemVisualOpacity } from '../../util/visual.js';

import {createTextStyle} from 'echarts/lib/label/labelStyle.js';

var LABEL_NORMAL_SHOW_BIT = 1;
var LABEL_EMPHASIS_SHOW_BIT = 2;

function LabelsBuilder(width, height, api) {

    this._labelsMesh = new LabelsMesh();

    this._labelTextureSurface = new ZRTextureAtlasSurface({
        width: 512,
        height: 512,
        devicePixelRatio: api.getDevicePixelRatio(),
        onupdate: function () {
            api.getZr().refresh();
        }
    });
    this._api = api;

    this._labelsMesh.material.set('textureAtlas', this._labelTextureSurface.getTexture());
}

LabelsBuilder.prototype.getLabelPosition = function (dataIndex, positionDesc, distance) {
    return [0, 0, 0];
};

LabelsBuilder.prototype.getLabelDistance = function (dataIndex, positionDesc, distance) {
    return 0;
};

LabelsBuilder.prototype.getMesh = function () {
    return this._labelsMesh;
};

LabelsBuilder.prototype.updateData = function (data, start, end) {
    if (start == null) {
        start = 0;
    }
    if (end == null) {
        end = data.count();
    }

    if (!this._labelsVisibilitiesBits || this._labelsVisibilitiesBits.length !== (end - start)) {
        this._labelsVisibilitiesBits = new Uint8Array(end - start);
    }
    var normalLabelVisibilityQuery = ['label', 'show'];
    var emphasisLabelVisibilityQuery = ['emphasis', 'label', 'show'];

    for (var idx = start; idx < end; idx++) {
        var itemModel = data.getItemModel(idx);
        var normalVisibility = itemModel.get(normalLabelVisibilityQuery);
        var emphasisVisibility = itemModel.get(emphasisLabelVisibilityQuery);
        if (emphasisVisibility == null) {
            emphasisVisibility = normalVisibility;
        }
        var bit = (normalVisibility ? LABEL_NORMAL_SHOW_BIT : 0)
            | (emphasisVisibility ? LABEL_EMPHASIS_SHOW_BIT : 0);
        this._labelsVisibilitiesBits[idx - start] = bit;
    }

    this._start = start;
    this._end = end;

    this._data = data;
};

LabelsBuilder.prototype.updateLabels = function (highlightDataIndices) {

    if (!this._data) {
        return;
    }

    highlightDataIndices = highlightDataIndices || [];

    var hasHighlightData = highlightDataIndices.length > 0;
    var highlightDataIndicesMap = {};
    for (var i = 0; i < highlightDataIndices.length; i++) {
        highlightDataIndicesMap[highlightDataIndices[i]] = true;
    }

    this._labelsMesh.geometry.convertToDynamicArray(true);
    this._labelTextureSurface.clear();

    var normalLabelQuery = ['label'];
    var emphasisLabelQuery = ['emphasis', 'label'];
    var seriesModel = this._data.hostModel;
    var data = this._data;

    var seriesLabelModel = seriesModel.getModel(normalLabelQuery);
    var seriesLabelEmphasisModel = seriesModel.getModel(emphasisLabelQuery, seriesLabelModel);

    var textAlignMap = {
        left: 'right',
        right: 'left',
        top: 'center',
        bottom: 'center'
    };
    var textVerticalAlignMap = {
        left: 'middle',
        right: 'middle',
        top: 'bottom',
        bottom: 'top'
    };

    for (var dataIndex = this._start; dataIndex < this._end; dataIndex++) {
        var isEmphasis = false;
        if (hasHighlightData && highlightDataIndicesMap[dataIndex]) {
            isEmphasis = true;
        }
        var ifShow = this._labelsVisibilitiesBits[dataIndex - this._start]
            & (isEmphasis ? LABEL_EMPHASIS_SHOW_BIT : LABEL_NORMAL_SHOW_BIT);
        if (!ifShow) {
            continue;
        }

        var itemModel = data.getItemModel(dataIndex);
        var labelModel = itemModel.getModel(
            isEmphasis ? emphasisLabelQuery : normalLabelQuery,
            isEmphasis ? seriesLabelEmphasisModel : seriesLabelModel
        );
        var distance = labelModel.get('distance') || 0;
        var position = labelModel.get('position');

        var dpr = this._api.getDevicePixelRatio();
        var text = seriesModel.getFormattedLabel(dataIndex, isEmphasis ? 'emphasis' : 'normal');
        if (text == null || text === '') {
            return;
        }

        // TODO Background.
        var textEl = new echarts.graphic.Text({
            style: createTextStyle(labelModel, {
                text: text,
                fill: labelModel.get('color') || getItemVisualColor(data, dataIndex) || '#000',
                align: 'left',
                verticalAlign: 'top',
                opacity: retrieve.firstNotNull(labelModel.get('opacity'), getItemVisualOpacity(data, dataIndex), 1)
            })
        });

        var rect = textEl.getBoundingRect();
        var lineHeight = 1.2;
        rect.height *= lineHeight;

        var coords = this._labelTextureSurface.add(textEl);

        var textAlign = textAlignMap[position] || 'center';
        var textVerticalAlign = textVerticalAlignMap[position] || 'bottom';

        this._labelsMesh.geometry.addSprite(
            this.getLabelPosition(dataIndex, position, distance),
            [rect.width * dpr, rect.height * dpr], coords,
            textAlign, textVerticalAlign,
            this.getLabelDistance(dataIndex, position, distance) * dpr
        );
    }

    this._labelsMesh.material.set('uvScale', this._labelTextureSurface.getCoordsScale());

    // var canvas = this._labelTextureSurface.getTexture().image;
    // document.body.appendChild(canvas);
    // canvas.style.cssText = 'position:absolute;z-index: 1000';

    // Update image.
    this._labelTextureSurface.getZr().refreshImmediately();
    this._labelsMesh.geometry.convertToTypedArray();
    this._labelsMesh.geometry.dirty();
};

LabelsBuilder.prototype.dispose = function () {
    this._labelTextureSurface.dispose();
}

export default LabelsBuilder;
