const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);

    // Проверка поддержки WebXR
    if (!navigator.xr) {
        console.error("WebXR не поддерживается вашим браузером.");
        alert("Ваш браузер не поддерживает WebXR. Пожалуйста, используйте Chrome для Android или Safari для iOS.");
        return scene;
    }

    // Инициализация WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    });

    // Проверка успешности инициализации
    if (!xr || !xr.baseExperience) {
        console.error("Не удалось инициализировать WebXR.");
        return scene;
    }

    // Включение отслеживания изображений
    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(BABYLON.WebXRImageTracking, "latest", {
        images: [
            {
                src: "path/to/your/image.png",
                widthInMeters: 0.2,
            },
        ],
    });

    // Обработка обнаружения изображения
    imageTracking.onTrackableImageFoundObservable.add((image) => {
        console.log("Image found:", image);

        // Создание 3D-модели на найденном изображении
        BABYLON.SceneLoader.ImportMeshAsync("", "path/to/your/model/", "model.gltf", scene)
            .then((result) => {
                const model = result.meshes[0];
                model.position = image.transformation.position;
                model.scaling.scaleInPlace(0.1);
            })
            .catch((error) => {
                console.error("Ошибка загрузки модели:", error);
            });
    });

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});

window.addEventListener("resize", () => {
    engine.resize
