Hooks.once("init", function () {

    game.settings.register("breadcrumbs", "breadcrumbs-enabled", {
        name: "Enable Breadcrumbs",
        hint: "Enable the use of Breadcrumbs",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register("breadcrumbs", "breadcrumbs-default-image", {
        name: "Default Image",
        hint: "Per-scene images can be configured using the scene configuration macro",
        scope: "world",
        config: true,
        filePicker: true,
        default: 'modules/breadcrumbs/artwork/shoeprints.webp',
        type: String
    });

    new window.Ardittristan.ColorSetting("breadcrumbs", "breadcrumbs-default-tint", {
        name: "Default Tint",
        hint: "A default tint for crumbs",
        label: "Color Picker",
        restricted: false,
        defaultColor: null,
        scope: "world",
        //onChange: (value) => {}
    });

    game.settings.register("breadcrumbs", "breadcrumbs-default-scale", {
        name: "Default Image Scale",
        hint: "Scale of Breadcrumbs images",
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        range: {
            min: 0.1,
            max: 1,
            step: .1
        }
    });

    game.settings.register("breadcrumbs", "breadcrumbs-default-trail-length", {
        name: "Max Trail Length",
        hint: "The maximum number of Breadcrumbs allowed in a trail",
        scope: "world",
        config: true,
        default: 50,
        type: Number,
        range: {
            min: 5,
            max: 99,
            step: 1
        }
    });

});
