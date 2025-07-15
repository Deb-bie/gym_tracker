import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000', // or production URL
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllEquipmentsByUser = async (token: any) => {
  try {
    const response = await api.get("/api/v1/equipments", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.status == 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data.message || 'Fetching equipments failed')
  }

}

export const addNewEquipment = async (token: any, data: any) => {
  try {
    const response = await api.post("/api/v1/equipments", 
      {
        body: data
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.status == 201) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data.message || 'Adding equipment failed')
  }
}

export const deleteUserEquipment = async (token:any, id: number) => {
  try {
    const response = await api.delete(`/api/v1/equipments/${id}`,  
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    if (response.status == 200) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data.message || 'Adding equipment failed')
  }
}

export const addNewWorkoutSession = async (token: any, data: any) => {
  try {
    const response = await api.post("/api/v1/workouts", 
      {
        body: data
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.status == 201) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data.message || 'Adding equipment failed')
  }
}

export const getWorkoutSessionById = async (token: any, id: number) => {
  try {
    const response = await api.get(`/api/v1/workouts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status == 200) {
      return response.data.data
    }
  } catch (error) {
    console.error("error fetching session by id: ", error);
    throw new Error(error?.response?.data.message || 'Fetching equipments failed')
  }

}

export const addNewExercise = async (token: any, data: any) => {
  try {
    const response = await api.post("/api/v1/workout/exercises", 
      {
        body: data
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.status == 201) {
      return response.data.data
    }
  } catch (error) {
    throw new Error(error?.response?.data.message || 'Adding exercise failed')
  }
}
