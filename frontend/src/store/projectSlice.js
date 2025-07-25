import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { useContext } from 'react'

const initialState = {
    projects: [],
    bookmark: [],
    loading: false
}

const productslice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjects(state, action) {
            console.log(action.payload);
            state.projects = action.payload
            state.bookmark = action.payload.filter(project => project.bookedmarked == true)
        },
        setloading(state) {
            state.loading = true
        },
        clearloading(state) {
            state.loading = false
        },
        addbookmark(state, action) {
            state.projects = state.projects.filter((project) => {
                if (project.project_id == action.payload) {
                    project.bookedmarked = true
                    state.bookmark = [...state.bookmark, project]
                }
                return project
            })

        },
        removebookmarked(state, action) {
            state.projects.filter((project) => {
                if (project.project_id == action.payload) {
                    project.bookedmarked = false
                    state.bookmark = state.bookmark.filter(project => project.project_id != action.payload)
                }

            })

        },
        updateStatus(state, action) {
            state.projects = state.projects.filter((project) => {
                if (project.project_id == action.payload) {
                    project.status = 'sold'
                }
                return project
            })
        }
    }
})

export const { setProjects, setloading, clearloading, updateStatus, removebookmarked, addbookmark } = productslice.actions
export default productslice.reducer


const idtoken = localStorage.getItem('idtoken')

export function getProjects() {
    return async function getProjectThunks(dispatch, getstate) {
        dispatch(setloading())
        const response = await axios.get('http://127.0.0.1:5000/api/projects/getproject', {
            headers: {
                'Authorization': `Bearer ${idtoken}`
            }
        })

        dispatch(setProjects(response.data.data))
        dispatch(clearloading())
    }
}


export function UpdateProjectStatus(projectId) {
    return async function UpdateProjectStatusThunk(dispatch, getstate) {
        const response = await axios.put(`http://127.0.0.1:5000/api/projects/${projectId}/mark-sold`, {}, {
            headers: {
                'Authorization': `Bearer ${idtoken}`
            }
        });
        if (response.status == 200) {
            dispatch(updateStatus(projectId))
        }
        else {
            console.log('failed to update the state');

        }

    }
}


