import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "container": {
        "marginTop": "auto",
        "marginRight": "auto",
        "marginBottom": "auto",
        "marginLeft": "auto",
        "width": 200,
        "textAlign": "center"
    },
    "file-preview:empty + clear-button": {
        "display": "none"
    },
    "file-preview:empty::after": {
        "display": "none"
    },
    "file-preview::after": {
        "textAlign": "center",
        "content": "Click on GIF to animate favicon"
    },
    "clear-button": {
        "position": "absolute",
        "top": 45,
        "marginLeft": 190,
        "width": 20,
        "height": 20,
        "borderRadius": 10,
        "backgroundColor": "#ccc"
    },
    "clear-button::after": {
        "color": "#fff",
        "content": " x "
    },
    "file-preview": {
        "backgroundColor": "#eee",
        "width": 200,
        "height": 200
    },
    "gificon": {
        "display": "none"
    }
});