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
        },
        setloading(state) {
            state.loading = true
        },
        clearloading(state) {
            state.loading = false
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

export const { setProjects, setloading, clearloading } = productslice.actions
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
