import API from './api'

export const getDesigns       = async ()           => (await API.get('/designs/')).data
export const getMyDesigns     = async ()           => (await API.get('/designs/my/')).data
export const getDesign        = async (id)         => (await API.get(`/designs/${id}/`)).data
export const createDesign     = async (formData)   => (await API.post('/designs/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data
export const updateDesign     = async (id, data)   => (await API.put(`/designs/${id}/`, data)).data
export const deleteDesign     = async (id)         => (await API.delete(`/designs/${id}/`)).data
export const getMaterials     = async ()           => (await API.get('/designs/materials/')).data
export const generateAIDesign = async (prompt)     => (await API.post('/ai/generate/',   { prompt })).data
export const generateVariations = async (prompt, n) => (await API.post('/ai/variations/', { prompt, variations: n })).data
