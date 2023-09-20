Hooks.once("init", function () {  // Due to some of the calls we make to populate lists, this can't register at init time

game.settings.register("breadcrumbs", "breadcrumbs-enabled", {
    name: "Enable Breadcrumbs",
    hint: "Enable the use of Breadcrumbs",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
});

game.settings.register("breadcrumbs", "breadcrumbs-default-image", {
    name: "Breadcrumbs Default Image",
    hint: "Per-scene images can be configured using the scene configuration macro",
    scope: "world",
    config: true,
    default: 'assets/breadcrumbs/breadcrumbs-arrow.webp',
    type: String
});

game.settings.register("breadcrumbs", "breadcrumbs-max-count", {
    name: "Max Count",
    hint: "The maximum number of Breadcrumbs allowed in a trail",
    scope: "world",
    config: true,
    default: 50,
    type: Number
});

});
