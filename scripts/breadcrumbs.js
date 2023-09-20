Hooks.on("createToken", function(tokenDocument, options, userId) {
    if(tokenDocument.actor.flags?.breadcrumbs) {
        console.info("Found Breadcrumbs actor")
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
}

Hooks.on("updateToken", async function(tokenDocument, updateData, diffData, userId) {
    let movementDirection = undefined
    if((tokenDocument.actor.flags?.breadcrumbs) && ((updateData.y) || (updateData.x)) && (tokenDocument.parent.flags?.breadcrumbs?.enabled == true)) {
        movementDirection = getRotationAngle(tokenDocument.flags.breadcrumbs.position.last_x, tokenDocument.flags.breadcrumbs.position.last_y, tokenDocument.x, tokenDocument.y);
        tokenDocument.update({
            flags: {
                breadcrumbs: {
                    trail_id: tokenDocument.parent.id + "-" + tokenDocument.actor.id,
                    position: {
                        last_x: tokenDocument.x, 
                        last_y: tokenDocument.y
                    }
                }
            }
        });
    } else { return; };
    console.log("Breadcrumbs token moved " + movementDirection);
    breadcrumbsTileDefinition = {
        texture: {
            // src: game.settings.get("breadcrumbs", "breadcrumbs-default-image"),
            src: tokenDocument.parent.flags.breadcrumbs.image || game.settings.get("breadcrumbs", "breadcrumbs-default-image"),
            rotation: 0
        },
        x: tokenDocument.x,
        y: tokenDocument.y,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        rotation: movementDirection
    };

    // let tileDocument = await tokenDocument.parent.getTileDocument(breadcrumbsTileDefinition);
    const addedToken = await tokenDocument.parent.createEmbeddedDocuments("Tile", [breadcrumbsTileDefinition]);
    Hooks.off("updateToken");
});