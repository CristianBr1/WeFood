import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const UserService = {
  // Retorna todos os usuários
  getUsers: async () => {
    const res = await fetchData("/users");
    return res.users || [];
  },

  // Remove um usuário pelo ID
  deleteUser: (id) => deleteData(`/users/${id}`),

  // Cria um novo usuário
  createUser: (name, email, password, avatar) =>
    uploadFormData({
      endpoint: "/users",
      fields: { name, email, password },
      file: avatar,
      fileKey: "avatar",
      method: "POST",
    }),

  // Atualiza um usuário existente
  updateUser: (id, name, email, password, avatar) =>
    uploadFormData({
      endpoint: `/users/${id}`,
      fields: { name, email, password },
      file: avatar,
      fileKey: "avatar",
      method: "PUT",
    }),
};
