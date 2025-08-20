import { createSlice } from '@reduxjs/toolkit'
import axios from '../libs/api'
import { useContext } from 'react'

const initialState = {
    projects: [],
    bookmark: [],
    buyedProject:[],
    loading: false, 
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
            state.buyedProject = state.buyedProject.filter((project) => {
                if (project.project_id == action.payload) {
                    project.bookedmarked = true
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
                return project

            })
            state.buyedProject.filter((project) => {
                if (project.project_id == action.payload) {
                    project.bookedmarked = false
                }
                return project

            })
            

        },
        updateStatus(state, action) {
            state.projects = state.projects.filter((project) => {
                if (project.project_id == action.payload) {
                    project.status = 'sold'
                }
                return project
            })
        },
        addBuyedProject(state,action){
            state.buyedProject=action.payload
        }
    }
})

export const { setProjects, setloading, clearloading, updateStatus, removebookmarked, addbookmark,addBuyedProject } = productslice.actions
export default productslice.reducer




export function getProjects() {
    return async function getProjectThunks(dispatch, getstate) {
        const idtoken = localStorage.getItem('idtoken')
        try {
            dispatch(setloading())
            const response = await axios.get('/api/projects/getproject', {
                headers: {
                    'Authorization': `Bearer ${idtoken}`
                }
            })
    
            dispatch(setProjects(response.data.data))
            dispatch(clearloading())
        } catch (error) {
            console.log("error in fetching the project");
            dispatch(clearloading())
            
            
        }
    }
}


export function UpdateProjectStatus(projectId) {
    const idtoken = localStorage.getItem('idtoken')
    return async function UpdateProjectStatusThunk(dispatch, getstate) {
        try {
            const response = await axios.put(`/api/projects/${projectId}/mark-sold`, {}, {
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
        } catch (error) {
            console.log("error in updating the project");
            // dispatch(clearloading())
            
            
        }

    }
}
export function getBuyedproject() {
    return async function getBuyedprojectStatusThunk(dispatch, getstate) {
        const idtoken = localStorage.getItem('idtoken')
        dispatch(setloading())
        try {
                const response = await axios.get('/api/projects/buyed-project', {
                    headers: {
                        'Authorization': `Bearer ${idtoken}`
                    }
                })
            if (response.status == 200) {
                dispatch(addBuyedProject(response.data.data))
            }
            else {
                console.log('failed to update the state');
    
            }
        } catch (error) {
            console.log("error in fetching the buying project");
            dispatch(clearloading())
            
            
        }

    }
}


