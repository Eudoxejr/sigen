import { idID } from "@mui/material/locale";
import { axiosInstance, axiosPrivate } from "./axios";
import { useUserStore } from "@/store/user.store";

const API_URL = `${import.meta.env.VITE_APP_ROOT_API}`;

axiosPrivate.interceptors.request.use(
  async (config) => {
    const tokens = await useUserStore.getState().user.token.token;
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${tokens}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    const VITE_APP_ROOT_URL = `${import.meta.env.VITE_APP_ROOT_URL}`;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      // prevRequest.sent = true;
      // const newAccessToken = await refresh();
      // prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      // return axiosPrivate(prevRequest);
      // localStorage.setItem('tokens', null)
      // localStorage.setItem('user', null)
      window.location.href = window.location.origin + "/auth/login";
    }
    return Promise.reject(error);
  }
);

export const AuthApi = {
  async login(data) {
    // console.log(API_URL);
    // console.log(data);
    const response = await axiosInstance.request({
      method: "post",
      url: API_URL + "/auth/login/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        ...data,
      }),
    });
    return response.data;
  },

  async forgetPsw(data) {
    const response = await axiosInstance.request({
      method: "post",
      url: API_URL + "/auth/password-forgot/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        ...data,
      }),
    });
    return response.data;
  },

  async resetPsw(data) {
    const response = await axiosInstance.request({
      method: "post",
      url: API_URL + "/auth/reset-password/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        ...data,
      }),
    });
    return response.data;
  },
};

export const CategorieGroupeApi = {
  async getCategorieGroups(page, perPage, q) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/categories-groups/",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
      },
    });

    return response.data;
  },

  async createCategorieGroups(data) {
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/categories-groups/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });

    return response.data;
  },

  async updateCategorieGroups(id, data) {
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/categories-groups/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });

    return response.data;
  },

  async deleteCategorieGroups(id) {
    const response = await axiosPrivate.request({
      method: "delete",
      url: API_URL + "/categories-groups/" + id,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};

export const CategoriesApi = {
  async getCategories(page, perPage, q, groupeCat) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/categories",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
        groupCat: JSON.stringify(groupeCat),
      },
    });
    return response.data;
  },

  async createCategorie(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/categories",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCategorie(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/categories/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },
};

export const FoldersApi = {
  async getFolders(page, perPage, q, categories, collaborateurId, userId) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/folders",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
        categories: JSON.stringify(categories),
        collaborateur: collaborateurId,
        userId: userId,
      },
    });
    return response.data;
  },

  async getFolderTree(id) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/folders/tree/" + id,
    });
    return response.data;
  },

  async getFolder(id) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/folders/" + id,
    });
    return response.data;
  },

  async createFolders(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/folders",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async createSubFolders(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/folders/subfolders/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async addFolders(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/folders/file/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },
};

export const TemplateApi = {
  async getTemplate(page, perPage, q, categories) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/templates",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
        categories: JSON.stringify(categories),
      },
    });
    return response.data;
  },

  async getTemplateVariable(templateId) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/templates/" + templateId,
    });
    return response.data;
  },

  async createTemplate(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/templates",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async updateTemplate(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/templates/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },
};

export const CollaboApi = {
  async getCollabo(page, perPage, q, role, exclude) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/users",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
        role: JSON.stringify(role),
        exclude: exclude,
      },
    });
    return response.data;
  },

  async getSpecificCollabo(id) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/users/" + id,
    });
    return response.data;
  },

  async createCollabo(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/users",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCollabo(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/users/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async suspendUser(id, data) {
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/users/suspend/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });

    return response.data;
  },

  async updateMe(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/users",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async updatePassword(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/users/password",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteUser(id) {
    const response = await axiosPrivate.request({
      method: "delete",
      url: API_URL + "/users/" + id,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};

export const ClientApi = {
  async getClient(page, perPage, q) {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/clients",
      params: {
        page: page,
        perPage: perPage,
        keyword: q,
        // role: JSON.stringify(role),
      },
    });
    return response.data;
  },

  async createClient(data) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "post",
      url: API_URL + "/clients",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async updateClient(data, id) {
    // console.log(data);
    const response = await axiosPrivate.request({
      method: "put",
      url: API_URL + "/clients/" + id,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteClient(id) {
    const response = await axiosPrivate.request({
      method: "delete",
      url: API_URL + "/clients/" + id,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};

export const RolesApi = {
  async getRole(page, perPage, q, countPermission) {
    // console.log(countPermission);
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/roles",
      params: {
        page: page,
        perPage: perPage,
        // role: JSON.stringify(role),
        keyword: q,
        countPermission: countPermission,
      },
    });
    return response.data;
  },
};

export const OtherApi = {
  async getGlobalKpi() {
    const response = await axiosPrivate.request({
      method: "get",
      url: API_URL + "/other/kpis",
      // params: {
      // 	page: page,
      // 	per_page: perPage,
      // 	q: q,
      // 	transportMoyen: JSON.stringify(moyen)
      // }
    });

    return response.data;
  },
};

export const AdminsApi = {
  async fetchAdminByID(id) {
    const response = axiosPrivate.get(`${API_URL}/admin/get-account/${id}`);
    return response.data;
  },
  async fetchAllAdmins(page = 1, perPage = 25, keywords = "") {
    const response = await axiosPrivate.get(
      `${API_URL}/admin/all-admin?q=${keywords}&page=${page}&per_page=${perPage}`
    );
    return response.data;
  },
  async postAdmin(data) {
    return axiosPrivate.post(`${API_URL}/admin/create-admin`, data);
  },
  async updateAdmin(data) {
    return axiosPrivate.put(`${API_URL}/admin/update-admin`, data);
  },
};
