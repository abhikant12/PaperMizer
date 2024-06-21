import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import mainSlice from "./features/slices/mainSlice";

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
    reducer: {
        main: mainSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const getRootState = store.getState;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export const dispatch = store.dispatch;
