import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development"
  ? (import.meta.env.VITE_API_URL || "http://localhost:3000")
  : "";

export const useStudentStore = create((set, get) => ({
  // students state
  students: [],
  loading: false,
  error: null,
  isNavigating: false,
  // form state
  formData: {
    name: "",
    description: "",
    image: "",
    image_data: "",
  },
  currentStudent: null,
  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", description: "", image: "", image_data: "" } }),
  clearCurrentStudent: () => set({ currentStudent: null, formData: { name: "", description: "", image: "", image_data: "" } }),
  setNavigating: (isNavigating) => set({ isNavigating }),

  addStudent: async (e, file = null) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const {formData} = get();
      let studentData = { ...formData };

      // If a file is provided, convert it to base64
      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const base64String = await base64Promise;
        studentData.image_data = base64String;
        studentData.image = ''; // Clear the URL field when using file upload
      }

      await axios.post(`${BASE_URL}/api/students`, studentData);
      await get().fetchStudents();
      get().resetForm();
      toast.success("Student added successfully.");
      document.getElementById('add_student_modal').close();
    } catch(error) {
      console.log('Error in add student function: ', error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong.");
    } finally {
      set({ loading: false });
    }
  },
  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/students`);
      set({ students: response.data.data, error: null });
    } catch(error) {
      if(error.status == 429) set({ error: "Rate limit exceeded. Too many requests.", students: [] });
      else set({ error: error?.message || "Something went wrong.", students: [] }); 
    } finally {
      set({ loading: false });
    }
  },
  deleteStudent: async (id) => {
    set({loading: true});
    try {
      await axios.delete(`${BASE_URL}/api/students/${id}`);
      set({ students: get().students.filter((student) => student.id !== id) });
      toast.success("Student deleted successfully.");
    } catch(error) {
      console.log('Error in delete student function: ', error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong.");
    } finally {
      set({ loading: false });
    }
  },

  fetchStudent: async (id) => {
    set({loading: true, currentStudent: null, formData: { name: "", description: "", image: "", image_data: "" }});
    try {
      const response = await axios.get(`${BASE_URL}/api/students/${id}`);
      const studentData = response.data.data;
      // Ensure all formData fields have defined values to prevent uncontrolled input warnings
      const normalizedFormData = {
        name: studentData.name || "",
        description: studentData.description || "",
        image: studentData.image || "",
        image_data: studentData.image_data || "",
      };
      set({
        currentStudent: studentData,
        formData: normalizedFormData,
        error: null,
       });
    } catch(error) {
      console.log('Error in fetch student function: ', error);
      set({ error: error?.response?.data?.message || error?.message || "Something went wrong.", currentStudent: null });
    } finally {
      set({ loading: false });
    }
  },
  updateStudent: async (id, file = null) => {
    set({loading: true});
    try {
      const {formData} = get();
      let studentData = { ...formData };

      // If a file is provided, convert it to base64
      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const base64String = await base64Promise;
        studentData.image_data = base64String;
        studentData.image = ''; // Clear the URL field when using file upload
      }

      const response = await axios.put(`${BASE_URL}/api/students/${id}`, studentData);
      set({ currentStudent: response.data.data, error: null });
      toast.success("Student updated successfully.");
    } catch(error) {
      console.log('Error in update student function: ', error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong.");
    } finally {
      set({loading: false});
    }
  },
}))