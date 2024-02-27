
export const handleBackendErrors = (response, defaultError) => {
    if (response && response.errors && response.errors.length > 0) {

        // Récupérer le premier message d'erreur (vous pouvez itérer si nécessaire)
        const errorMessage = response.errors[0].message;
        // Traiter l'erreur en conséquence (exemple : afficher un message à l'utilisateur)
        // alert(`Erreur du serveur : ${errorMessage}`);
        return errorMessage;

    } else {
      return defaultError
    }
  }