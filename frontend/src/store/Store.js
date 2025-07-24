import { configureStore } from "@reduxjs/toolkit";
import { setProjects } from "./projectSlice.js";
import projectSlice from './projectSlice.js'

const store = configureStore({
    reducer: {
        projects: projectSlice
    }
})

export default store