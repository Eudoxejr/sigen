import * as yup from 'yup';

export const Rules = {
  validateName: async (value = "") => {
    try {
      const schema = yup
        .string()
        .max(100, "100 caractères au maximum")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        return 'Ce champ est requis';
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateNameWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .string()
        .max(100, "100 caractères au maximum")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateEmail: async (value = "") => {
    try {
      const schema = yup
        .string()
        .email("Adresse mail invalide")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        return 'Ce champ est requis';
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateEmailWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .string()
        .email("Adresse mail invalide")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateStringWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .string()
        .min(params?.min || 0, `Au moins ${params?.min} caractères`)
        .max(params?.max || 100, "100 caractères au maximum")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateNumberWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .number()
        .min(params?.min, `Doit être supérieur à ${params?.min}`)
        .max(params?.max, `Doit être inférieur à ${params?.max}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateNumberMinWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .number()
        .min(params?.min, `Doit être supérieur à ${params?.min}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateNumberMaxWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .number()
        .max(params?.max, `Doit être inférieur à ${params?.max}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateDateWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .date()
        .min(params?.min?.toDate(), `Doit être au plus tôt le ${params?.min?.format("DD/MM/YYYY")}`)
        .max(params?.max?.toDate(), `Doit être au plus tard le ${params?.max?.format("DD/MM/YYYY")}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateDateMinWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .date()
        .min(params?.min?.toDate(), `Doit être au plus tôt le ${params?.min?.format("DD/MM/YYYY")}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateDateMaxWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .number()
        .max(params?.max?.toDate(), `Doit être au plus tard le ${params?.max?.format("DD/MM/YYYY")}`)
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validatePhone: async (value = "") => {
    try {
      const schema = yup
        .string()
        .min(8, "Numéro de téléphone invalide")
        .max(20, "Numéro de téléphone invalide")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        return 'Ce champ est requis';
      }
    } catch (error) {
      return error?.message;
    }
  },
  validatePhoneWithParams: async (params = null, value = "") => {
    try {
      const schema = yup
        .string()
        .min(8, "Numéro de téléphone invalide")
        .max(20, "Numéro de téléphone invalide")
        .required()

      if (!!value) {
        await schema.validate(value);
        return true;
      } else {
        if (params?.isNullable) {
          return true;
        } else {
          return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
        }
      }
    } catch (error) {
      return error?.message;
    }
  },
  validateValueInArray: (params = null, value = "") => {
    const listOfData = params?.values ?? [];

    if (!!value) {
      if (Array.isArray(listOfData) && listOfData?.includes(value)) {
        return true;
      } else {
        return `${params?.name ?? 'Cet champ'} peut contenir une des valeurs: ${listOfData?.join(' - ')}`;
      }
    } else {
      if (params?.isNullable) {
        return true;
      } else {
        return !!params?.name ? `${params?.name} est requis` : 'Ce champ est requis';
      }
    }
  },
};