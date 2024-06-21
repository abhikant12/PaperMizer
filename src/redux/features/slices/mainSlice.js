import { createSlice } from "@reduxjs/toolkit";
import { A3, A4, PaperSize } from "../../../data/paperSizes";

// const defaultContainer = {
//     w: 595 * 2,
//     h: 842 * 2,
//     scaleFactor: 0.3,
//     margin: { top: 0, right: 0, bottom: 0, left: 0 },
//     padding: 5,
// };

const defaultContainer = {
    w: 595 * 2,
    h: 842 * 2,
    scaleFactor: 0.3,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: 5,
    paperSize: A4,
};

const initialState = {
    container: defaultContainer,
    isPacking: false,
    inResizeMode: true,
    isResizingAgain: false,
    imagesLoaded: false,
    filesUpdatedFlag: false,
    startingMaxWidthFactor: 0.4,
    showBorder: false,
};

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setImagesLoaded: (state, action) => {
            state.imagesLoaded = action.payload;
        },

        setIsPacking: (state, action) => {
            state.isPacking = action.payload;
        },
        setIsResizingAgain: (state, action) => {
            state.isResizingAgain = action.payload;
        },
        setInResizeMode: (state, action) => {
            state.inResizeMode = action.payload;
        },

        setContainer: (state, action) => {
            state.container = action.payload;
        },

        setStartingMaxWidthFactor: (state, action) => {
            state.startingMaxWidthFactor = action.payload;
        },

        filesUpdated: (state) => {
            state.filesUpdatedFlag = !state.filesUpdatedFlag;
        },

        setShowBorder: (state, action) => {
            state.showBorder = action.payload;
        },
        resetState: () => initialState,
    },
});

export const {
    setContainer,
    resetState,
    setIsPacking,
    setInResizeMode,
    setStartingMaxWidthFactor,
    setIsResizingAgain,
    filesUpdated,
    setImagesLoaded,
    setShowBorder,
} = mainSlice.actions;
export default mainSlice.reducer;
