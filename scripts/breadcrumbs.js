Hooks.on("createToken", function(tokenDocument, options, userId) {
    if((tokenDocument.actor.flags?.breadcrumbs?.enabled == true) || (tokenDocument.flags?.breadcrumbs?.enabled == true)) {
        console.info("Found Breadcrumbs token")
        tokenDocument.update({
            flags: {
                breadcrumbs: {
                    trail: {
                        id: tokenDocument.parent.id + "-" + tokenDocument.id
                    },
                    position: {
                        last_x: tokenDocument.x, 
                        last_y: tokenDocument.y
                    }
                }
            }
        });
    };
    Hooks.off("createToken");
});

function getRotationAngle(oldX, oldY, newX, newY) {
  let dx = newX - oldX;
  let dy = newY - oldY;

  if (dx === 0 && dy > 0) {
    return 0;  // South
  } else if (dx > 0 && dy < 0) {
    return 225;  // North-East
  } else if (dx < 0 && dy > 0) {
    return 45;  // South-West
  } else if (dx > 0 && dy === 0) {
    return 270;  // West
  } else if (dx < 0 && dy < 0) {
    return 135;  // North-West
  } else if (dx === 0 && dy < 0) {
    return 180;  // North
  } else if (dx < 0 && dy === 0) {
    return 90;  // East
  } else if (dx > 0 && dy > 0) {
    return 315;  // South-East
  } else {
    return null;  // Token didn't move or moved in an unexpected way
  }
};

Hooks.on("updateToken", async function(tokenDocument, updateData, _, _) {
    let movementDirection = undefined
    const hasBreadcrumbsEnabled = tokenDocument.parent.flags?.breadcrumbs?.enabled;
    const hasPositionUpdate = updateData.y || updateData.x;
    
    if (hasBreadcrumbsEnabled && hasPositionUpdate) {
        movementDirection = getRotationAngle(tokenDocument.flags.breadcrumbs.position.last_x, tokenDocument.flags.breadcrumbs.position.last_y, tokenDocument.x, tokenDocument.y);
        tokenDocument.update({
            flags: {
                breadcrumbs: {
                    position: {
                        last_x: tokenDocument.x, 
                        last_y: tokenDocument.y
                    }
                }
            }
        });
    } else { return; };
    console.debug("Breadcrumbs token moved at angle " + movementDirection);

    function getMergedBreadcrumbsSettings(actorDocument, sceneDocument) {
      // Default settings, can be extended if there are other defaults
      const defaultSettings = {
          src: null,
          scale: undefined,
          tint: undefined,
      };
  
      const actorSettings = actorDocument?.flags?.breadcrumbs || defaultSettings;
      const sceneActorSettings = sceneDocument?.flags?.breadcrumbs?.actors?.[actorDocument._id] || {};
      const sceneDefaultSettings = sceneDocument?.flags?.breadcrumbs?.actors?.default || {};
  
      let mergedSettings = { ...defaultSettings, ...actorSettings };  // Start with actor settings
  
      // If override is enabled, use scene's settings
      if (sceneDocument?.flags?.breadcrumbs?.override_actors) {
          mergedSettings = { ...mergedSettings, ...sceneDefaultSettings, ...sceneActorSettings };
      }
  
      return mergedSettings;
  };  

    const actorSettings = getMergedBreadcrumbsSettings(tokenDocument.actor, tokenDocument.parent);
    breadcrumbsTileDefinition = {
        flags: {
            breadcrumbs: {
                trail: {
                    id: tokenDocument.parent.id + "-" + tokenDocument.id,
                    timestamp: Date.now()
                },
            }
        },
        texture: {
            src: actorSettings.src || game.settings.get("breadcrumbs", "breadcrumbs-default-image"),
            rotation: 0
        },
        x: tokenDocument.x,
        y: tokenDocument.y,
        width: 100,
        height: 100,
        scaleX: actorSettings.scale || game.settings.get("breadcrumbs", "breadcrumbs-default-scale"),
        scaleY: actorSettings.scale || game.settings.get("breadcrumbs", "breadcrumbs-default-scale"),
        rotation: movementDirection
    };

    await tokenDocument.parent.createEmbeddedDocuments("Tile", [breadcrumbsTileDefinition]);

    // Check the trail length for user-defined limits
    let maxTrailLength = tokenDocument.parent.flags.breadcrumbs?.trails?.length?.max || game.settings.get("breadcrumbs", "breadcrumbs-default-trail-length");
    let existingBreadcrumbs = tokenDocument.parent.tiles.filter(tile => tile.flags?.breadcrumbs?.trail?.id == tokenDocument.parent.id + "-" + tokenDocument.id);
    existingBreadcrumbs.sort((a, b) => a.flags.breadcrumbs.trail.timestamp - b.flags.breadcrumbs.trail.timestamp);

    while (existingBreadcrumbs.length > maxTrailLength) {
        let oldestTile = existingBreadcrumbs.shift();  // Removes the first (oldest) tile from the array
        oldestTile.delete();
    };

    Hooks.off("updateToken");
});