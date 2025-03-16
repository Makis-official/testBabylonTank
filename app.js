const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);

    // Инициализация WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    });

    // Включение отслеживания изображений
    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(BABYLON.WebXRImageTracking, "latest", {
        images: [
            {
                src: "t-34-85-srednii-tank-c-orudiem-kalibra-85-mm-razvaliny-osnov.jpg",
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
