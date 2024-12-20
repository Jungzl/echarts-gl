import * as echarts from 'echarts/lib/echarts';
import axisDefault from './axis3DDefault.js';

import OrdinalMeta from 'echarts/lib/data/OrdinalMeta.js';

var AXIS_TYPES = ['value', 'category', 'time', 'log'];
/**
 * Generate sub axis model class
 * @param {} registers
 * @param {string} dim 'x' 'y' 'radius' 'angle' 'parallel'
 * @param {module:echarts/model/Component} BaseAxisModelClass
 * @param {Function} axisTypeDefaulter
 * @param {Object} [extraDefaultOption]
 */
export default function (registers, dim, BaseAxisModelClass, axisTypeDefaulter, extraDefaultOption) {

    AXIS_TYPES.forEach(function (axisType) {

        var AxisModel = BaseAxisModelClass.extend({

            type: dim + 'Axis3D.' + axisType,

            /**
             * @type readOnly
             */
            __ordinalMeta: null,

            mergeDefaultAndTheme: function (option, ecModel) {

                var themeModel = ecModel.getTheme();
                echarts.util.merge(option, themeModel.get(axisType + 'Axis3D'));
                echarts.util.merge(option, this.getDefaultOption());

                option.type = axisTypeDefaulter(dim, option);
            },

            /**
             * @override
             */
            optionUpdated: function () {
                var thisOption = this.option;

                if (thisOption.type === 'category') {
                    this.__ordinalMeta = OrdinalMeta.createByAxisModel(this);
                }
            },

            getCategories: function () {
                if (this.option.type === 'category') {
                    return this.__ordinalMeta.categories;
                }
            },

            getOrdinalMeta: function () {
                return this.__ordinalMeta;
            },

            defaultOption: echarts.util.merge(
                echarts.util.clone(axisDefault[axisType + 'Axis3D']),
                extraDefaultOption || {},
                true
            )
        });

        registers.registerComponentModel(AxisModel);
    });

    // TODO
    registers.registerSubTypeDefaulter(
        dim + 'Axis3D',
        echarts.util.curry(axisTypeDefaulter, dim)
    );
};
