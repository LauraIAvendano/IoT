document.addEventListener("DOMContentLoaded", () => {
    const foodLevelElement = document.getElementById("food-level");
    const notificationsList = document.getElementById("notifications-list");
    const checkFoodButton = document.getElementById("check-food");

    // Función para obtener el nivel de comida desde el backend
    const fetchFoodLevel = async () => {
        try {
            console.log("Enviando solicitud para obtener el nivel de comida...");
            const response = await fetch("http://localhost:3000/getFoodLevel");
            const data = await response.json();
            console.log("Datos recibidos del backend:", data);

            if (data && data.level !== undefined) {
                foodLevelElement.textContent = `Nivel de comida: ${data.level}%`;

                if (data.level < 20) {
                    addNotification("El nivel de comida es bajo. Por favor, llena el tazón.");
                } else {
                    addNotification(data.message);
                }
            } else {
                foodLevelElement.textContent = "Error al obtener el nivel de comida.";
            }
        } catch (error) {
            console.error("Error de conexión con el servidor:", error);
            foodLevelElement.textContent = "Error de conexión con el servidor.";
        }
    };

    // Función para agregar una notificación a la lista
    const addNotification = (message) => {
        const listItem = document.createElement("li");
        listItem.textContent = message;
        notificationsList.appendChild(listItem);
    };

    // Evento para el botón de verificar nivel de comida
    checkFoodButton.addEventListener("click", fetchFoodLevel);

    // Llamada inicial para cargar el nivel de comida
    fetchFoodLevel();
});
