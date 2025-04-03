async function extractAndMergeVariables(templateData, values) {
    return new Promise((resolve) => {
      let result = {};
  
      // Parcourir les groupes dans "group"
      templateData.group.forEach(group => {
        if (group.variables) {
          group.variables.forEach(variable => {
            const variableId = variable.id.toString(); // Convertir l'ID en string pour correspondre aux clés de values
            if (values[variableId] !== undefined) {
              result[variable.name] = values[variableId];
            }
          });
        }
      });
  
      resolve(result);
    });
  }
  
  // Export de la fonction
  export default extractAndMergeVariables;