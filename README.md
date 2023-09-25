# foundry-vtt-breadcrumbs

![Foundry VTT Breadcrumbs](artwork/module/breadcrumbs-cover.png)

## Summary
Foundry VTT Breadcrumbs adds configurable tile-based trails to the tokens of any actor that the GM desires. Breadcrumb images can be unique to scenes, actors, or individual tokens. Trails can be configured for length, style, and other properties both globally and per-scene.

# Configuration Options
## <a name="world-options"></a>World Options
`Breadcrumbs Enabled` Enabled Breadcrumb usage across any configured scenes.

`Default Image` The image used for Crumbs unless overridden by scene or actor settings.

`Default Tint` The tint image used for Crumbs unless overridden by scene or actor settings.

`Default Scale` The scale used for Crumbs unless overridden by scene or actor settings.

`Max Trail Length` The maximum number of Crumbs in a given trail. Can be overriden at the scene level.

## <a name="scene-options"></a>Scene Options
#### To set these options, use the included `breadcrumbsSceneConfig` macro to apply settings to the currently-viewed scene.

`Enable Breadcrumbs` Enables the use of Breadcrumbs on the scene.

`Override Actors` Prefer the scene's default Breadcrumbs settings over any available actor settings. Note that this does _not_ override individual token settings, which may be set explicitly. See 

`Breadcrumbs Image` The default image for Crumbs in the scene.

`Tint` The default tint for Crumbs in the scene.

`Scale` The default scale for Crumbs in the scene.

`Trail Length` A scene-specific override for the maxmimum trail length specified in [World Options](#world-options).

`Alternate Sides` Mirror every-other Crumb so that two grid spaces completes a stride. Useful for giants, galloping horses, etc.

## <a name="actor-options"></a>Actor Options
#### To set these options, use the included `breadcrumbsActorConfig` macro with a token or multiple tokens selected.

`Enable Breadcrumbs` Enable Breadcrumbs for this actor or token.

`Apply to Actor` If left unchecked, the configuration options will be set on the token or tokens directly, bypassing any scene-specific configurations. If checked, the settings will propogate to the actor, becoming the default for all of that actor's newly-placed tokens and being subject to the `Override Actors` setting in [Scene Options](#scene-options).

`Image` The token or actor's default Breadcrumbs image.

`Tint` The token or actor's default Breadcrumbs tint.

`Scale` The token or actor's default Breadcrumbs scale.

`Alternate Sides` Mirror every-other Crumb so that two grid spaces completes a stride. Useful for giants, galloping horses, etc.

# Media
![Hex Crawls](artwork/module/breadcrumbs-hex.gif)