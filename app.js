// Babylon.js доступен глобально через объект BABYLON

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);

    // Создание XR-опыта (дополненная реальность)
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar", // Режим дополненной реальности
        },
    });

    // Включение отслеживания изображений
    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(BABYLON.WebXRImageTracking, "latest", {
        images: [
            {
                src: "t-34-85-srednii-tank-c-orudiem-kalibra-85-mm-razvaliny-osnov.jpg", // Путь к изображению для отслеживания
                widthInMeters: 0.2, // Ширина изображения в метрах
            },
        ],
    });

    // Обработка события обнаружения изображения
    imageTracking.onTrackableImageFoundObservable.add((image) => {
        console.log("Image found:", image);

        // Создание 3D-модели на найденном изображении
        BABYLON.SceneLoader.ImportMeshAsync(
            "", // Путь к модели
            "./", // Директория с моделью
            "russian_tank_kv-1s (1).glb", // Имя файла модели
            scene
        ).then((result) => {
            const model = result.meshes[0];
            model.position = image.transformation.position; // Позиция модели на изображении
            model.scaling.scaleInPlace(0.1); // Масштабирование модели
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
    engine.resize();
});