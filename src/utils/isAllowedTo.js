import React from 'react';
import useAuth from '@/hooks/useAuth';

export const isAllowedTo = (permission) => {
  const { auth } = useAuth();

  if (auth) {
    if (auth?.role === "SUPERADMIN") {
      return true;
    } else {
      const userPermissions = Array.isArray(auth?.userRole?.permissions) ? auth?.userRole?.permissions : [];
      return userPermissions?.some(el => el?.name === permission);
    }
  } else {
    return false;
  }
};

export const isAllowedWith = (auth,permission) => {

  if (auth) {
    if (auth?.role === "SUPERADMIN") {
      return true;
    } else {
      const userPermissions = Array.isArray(auth?.userRole?.permissions) ? auth?.userRole?.permissions : [];
      return userPermissions?.some(el => el?.name === permission);
    }
  } else {
    return false;
  }
};