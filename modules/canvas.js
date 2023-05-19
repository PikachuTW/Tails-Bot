/* eslint-disable no-param-reassign */
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Canvas = require('@napi-rs/canvas');

const fonts = [
    { path: `${__dirname}/../fonts/gg_sans_Semibold.ttf`, name: 'SEMIBOLD' },
    { path: `${__dirname}/../fonts/NotoColorEmoji-Regular.ttf`, name: 'NOTO_COLOR_EMOJI' },
    { path: `${__dirname}/../fonts/NotoSansTC-Regular.otf`, name: 'NOTO_SANS_TC' },
    { path: `${__dirname}/../fonts/gg_sans_Medium.ttf`, name: 'GG_SANS_MEDIUM' },
    { path: `${__dirname}/../fonts/arial-unicode-ms.ttf`, name: 'ARIAL' },
];

fonts.forEach((font) => {
    Canvas.GlobalFonts.registerFromPath(font.path, font.name);
});

const chartCallback = (chartJs) => {
    chartJs.defaults.font.family = 'SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
};
const chartJs = new ChartJSNodeCanvas({
    width: 500,
    height: 300,
    backgroundColour: 'white',
    chartCallback,
});

fonts.forEach((font) => {
    chartJs.registerFont(font.path, { family: font.name });
});

module.exports = {
    chartJs, Canvas,
};
