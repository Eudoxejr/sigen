
export const handleBackendErrors = (response, defaultError) => {

  if (response && response.errors && response.errors.length > 0) {

    let errorMessage = ""

      const firstError = response?.errors?.[0]

      if( ["required"].includes(firstError.rule) ) {
        errorMessage = `Le champ ${firstError.field} doit être défini`
      }
      else if( ["maxLength", "minLength"].includes(firstError.rule) ) {
        errorMessage = `Le champ ${firstError.field} ${firstError.rule = "maxLength" ? "ne doit pas" : "doit"} dépasser ${firstError.meta[firstError.rule = "maxLength" ? "max": "min"]} caractère(s)`
      }
      else if( ["email"].includes(firstError.rule) ) {
        errorMessage = `Le champ ${firstError.field} doit être un email valide`
      }
      else if( ["mobile"].includes(firstError.rule) ) {
        errorMessage = `Le champ ${firstError.field} doit être un numéro de téléphone valide`
      }
      else if( ["database.exists", "exists"].includes(firstError.rule) ) {
        errorMessage = `Le champ ${firstError.field} n'existe pas.`
      }
      else if( ["database.unique", "unique"].includes(firstError.rule) ) {
        errorMessage = `${firstError.field} a déja été utilisé.`
      }
      else {
        errorMessage = firstError.message;
      }
  
    return errorMessage;

  }else if(response && response?.message){
    return response.message
  }
  else {
    return defaultError
  }
}