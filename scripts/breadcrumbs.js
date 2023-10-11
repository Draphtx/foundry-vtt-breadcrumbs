Hooks.on("createToken", function(tokenDocument, options, userId) {
    if((tokenDocument.actor.flags?.breadcrumbs?.enabled == true) || (tokenDocument.parent.flags?.breadcrumbs?.enabled == true)) {
          console.debug("Configuring new Breadcrumbs token")

        tokenDocument.update({
            flags: {
                breadcrumbs: {
                    enabled: true,
                    style: {
                      src: tokenDocument.parent.flags?.breadcrumbs?.override_actors === true 
                           ? tokenDocument.parent.flags?.breadcrumbs?.style?.src 
                           : (tokenDocument.actor.flags?.breadcrumbs?.style?.src || game.settings.get("breadcrumbs", "breadcrumbs-default-image")),
                      scale: tokenDocument.parent.flags?.breadcrumbs?.override_actors === true 
                             ? tokenDocument.parent.flags?.breadcrumbs?.style?.scale 
                             : (tokenDocument.actor.flags?.breadcrumbs?.style?.scale || game.settings.get("breadcrumbs", "breadcrumbs-default-scale")),
                      tint: tokenDocument.parent.flags?.breadcrumbs?.override_actors === true 
                            ? tokenDocument.parent.flags?.breadcrumbs?.style?.tint 
                            : (tokenDocument.actor.flags?.breadcrumbs?.style?.tint || game.settings.get("breadcrumbs", "breadcrumbs-default-tint")),
                      alternating: tokenDocument.parent.flags?.breadcrumbs?.override_actors === true 
                            ? tokenDocument.parent.flags?.breadcrumbs?.style?.alternating 
                            : (tokenDocument.actor.flags?.breadcrumbs?.style?.alternating || false),    
                    },
                    trail: {
                        id: tokenDocument.parent.id + "-" + tokenDocument.id,
                        timestamp: Date.now(),
                    },
                    position: {
                        last_x: tokenDocument.x, 
                        last_y: tokenDocument.y
                    }
                }
            }
        });
        tokenDocument.parent.update({
            flags: {
                breadcrumbs: {
                    trails: {
                        [tokenDocument.parent.id + "-" + tokenDocument.id]: {
                            totalCrumbs: 1
                        }
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
    const hasBreadcrumbsEnabled = tokenDocument.parent.flags?.breadcrumbs?.enabled == true && (
        tokenDocument.flags?.breadcrumbs?.enabled == true || tokenDocument.actor.flags?.breadcrumbs?.enabled == true);
    const hasPositionUpdate = updateData.y || updateData.x;
    
    if (hasBreadcrumbsEnabled && hasPositionUpdate) {
        // If the token has not moved at least half of its size, do not produce a Crumb
        if ((Math.abs(tokenDocument.x - tokenDocument.flags.breadcrumbs.position.last_x) < (tokenDocument.width * tokenDocument.parent.grid.size / 2)) && 
            (Math.abs(tokenDocument.y - tokenDocument.flags.breadcrumbs.position.last_y) < (tokenDocument.height * tokenDocument.parent.grid.size / 2))) 
            {
                return;
            } else {
                movementDirection = getRotationAngle(
                    tokenDocument.flags.breadcrumbs.position.last_x, 
                    tokenDocument.flags.breadcrumbs.position.last_y, 
                    tokenDocument.x, tokenDocument.y);
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
            };
    } else { return; };

    function getMergedBreadcrumbsSettings(tokenDocument) {
      // Default settings
      const defaultSettings = {
          src: null,
          scale: undefined,
          tint: undefined,
      };
  
      const actorSettings = tokenDocument.actor.flags?.breadcrumbs?.style || {};
      const tokenSettings = tokenDocument.flags?.breadcrumbs?.style || {};
      const sceneSettings = tokenDocument.parent.flags?.breadcrumbs?.style || {};
  
      let mergedSettings = { ...defaultSettings };
  
      // If token settings are defined, they take precedence
      if (Object.keys(tokenSettings).length > 0) {
          mergedSettings = { ...mergedSettings, ...tokenSettings };
      } 
      // If token settings aren't defined, check for `override_actors`
      else if (tokenDocument.parent.flags?.breadcrumbs?.override_actors) {
          mergedSettings = { ...mergedSettings, ...sceneSettings };
      } 
      // If token settings aren't defined and `override_actors` isn't enabled, fall back to actor settings
      else {
          mergedSettings = { ...mergedSettings, ...actorSettings };
      }
  
      return mergedSettings;
    };  
    const actorSettings = getMergedBreadcrumbsSettings(tokenDocument);

    let maxTrailLength = tokenDocument.parent.flags.breadcrumbs?.trails?.length?.max || game.settings.get("breadcrumbs", "breadcrumbs-default-trail-length");
    let trailCrumbCount = tokenDocument.parent.flags?.breadcrumbs?.trails?.[tokenDocument.parent.id + "-" + tokenDocument.id].totalCrumbs
    const isAlternate = (trailCrumbCount + 1) % 2 !== 0 && tokenDocument.flags.breadcrumbs.style.alternating === true;

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
            tint: actorSettings.tint || game.settings.get("breadcrumbs", "breadcrumbs-default-tint").substring(0, 7),
            scaleX: isAlternate ? -(actorSettings.scale || game.settings.get("breadcrumbs", "breadcrumbs-default-scale")) * tokenDocument.width: (actorSettings.scale || game.settings.get("breadcrumbs", "breadcrumbs-default-scale")) * tokenDocument.width,
            scaleY: actorSettings.scale * tokenDocument.height || game.settings.get("breadcrumbs", "breadcrumbs-default-scale") * tokenDocument.height,
            rotation: 0
        },
        x: tokenDocument.x + (tokenDocument.width * tokenDocument.parent.grid.size) / 2 - tokenDocument.parent.grid.size / 2,
        y: tokenDocument.y + (tokenDocument.height * tokenDocument.parent.grid.size) / 2 - tokenDocument.parent.grid.size / 2,
        height: tokenDocument.parent.grid.size,
        width: tokenDocument.parent.grid.size,
        rotation: movementDirection
    };

    await tokenDocument.parent.createEmbeddedDocuments("Tile", [breadcrumbsTileDefinition]);

    tokenDocument.parent.update({
        flags: {
            breadcrumbs: {
                trails: {
                    [tokenDocument.parent.id + "-" + tokenDocument.id]: {
                        totalCrumbs: trailCrumbCount + 1
                    }
                }
            }
        }
    });

    let existingBreadcrumbs = tokenDocument.parent.tiles.filter(
        tile => tile.flags?.breadcrumbs?.trail?.id == tokenDocument.parent.id + "-" + tokenDocument.id);

    while (existingBreadcrumbs.length > maxTrailLength) {
        existingBreadcrumbs.sort((a, b) => a.flags.breadcrumbs.trail.timestamp - b.flags.breadcrumbs.trail.timestamp);
        let oldestTile = existingBreadcrumbs.shift();  // Removes the first (oldest) tile from the array
        oldestTile.delete();
    };

    Hooks.off("updateToken");
});