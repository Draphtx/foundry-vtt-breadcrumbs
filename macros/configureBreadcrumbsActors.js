const currentScene = game.scenes.current

const loadoutsTileDialog = new Dialog({
    title: "Breadcrumbs", 
    content:`
    <script>
        async function fileBrowser() {
            const path = '` + game.settings.get("breadcrumbs", "breadcrumbs-default-image") + `';
            new FilePicker({
                type: 'image',
                current: path,
                callback: imagePath => {
                    document.getElementById("breadcrumbsImagePreview").src = imagePath;
                },
            }).browse();
    }
    </script>
    <script type="text/javascript">
        function limitTrailLength(obj){
            if (obj.value.length > 2){
                obj.value = obj.value.slice(0,2); 
            }
        }
    </script>
    <form class="form-horizontal">
    <fieldset>
    
    <!-- Form Name -->
    <legend>Actor Configuration</legend>

    <!-- Boolean input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="enableBreadcrumbs">Enable Breadcrumbs</label>  
      <div class="col-md-4">
      <input id="enableBreadcrumbs" name="enableBreadcrumbs" type="checkbox" checked></input>
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="setForScene">Limit to Scene?</label>  
      <div class="col-md-4">
      <input id="setForScene" name="setForScene" type="checkbox"></input>
      </div>
    </div>

    <div class="form-group">
        <label>Breadcrumbs Image</label>
        <button onclick="fileBrowser()">
            <img id="breadcrumbsImagePreview" src="` + game.settings.get("breadcrumbs", "breadcrumbs-default-image") + `" style="width: 50px; height: 50px;">
        </button>
    </div>

    <!-- Range input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="breadcrumbsScale">Breadcrumbs Scale</label>  
      <div class="col-md-4">
      <input id="breadcrumbsScale" name="breadcrumbsScale" type="range" min="0.1" max="1" step="0.1" defaultValue="1" value="1" oninput="document.getElementById('rangeValLabel').innerHTML = this.value;"></input>
      <span class="help-block">Scale: </span>
      <em id="rangeValLabel" style="font-style: normal;">1</em>
      </div>
    </div>
    `,
      buttons: {
        cancel: {
            icon: "<i class='fas fa-check'></i>",
            label: `Cancel`,
            callback: function(){ return; }  
            },
        apply: {
            icon: "<i class='fas fa-check'></i>",
            label: `Apply Changes` ,
            callback: html => {setupBreadcrumbsActors(
                html.find('[name="enableBreadcrumbs"]').val(),
                html.find('[name="setForScene"]').val(),
                html.find("#breadcrumbsImagePreview").attr("src"),
                html.find('[name="breadcrumbsScale"]').val()
            )}   
            }
      },
      default: 'apply',
}).render(true);

async function setupBreadcrumbsActors(enableBreadcrumbs, setForScene, breadcrumbsImage, breadcrumbsScale) {
    const enableBreadcrumbsCheckbox = document.getElementById('enableBreadcrumbs');
    const setForSceneCheckbox = document.getElementById('setForScene');

    if(!setForSceneCheckbox.checked) {
        canvas.tokens.controlled.forEach(token => token.document.actor.update({
            flags: {
                breadcrumbs: {
                    enabled: enableBreadcrumbsCheckbox.checked,
                    style: {
                        src: breadcrumbsImage,
                        scale: breadcrumbsScale,
                        tint: null
                    }
                }
            }
        }))
    } else {
        canvas.tokens.controlled.forEach(token => token.document.update({
            flags: {
                breadcrumbs: {
                    enabled: enableBreadcrumbsCheckbox.checked,
                }
            }
        }))
        canvas.tokens.controlled.forEach(token => currentScene.update({
            "flags.breadcrumbs": {
                actors: {
                    [token.document.actor.id]: {
                        src: breadcrumbsImage,
                        scale: breadcrumbsScale,
                        tint: null
                    }
                }
            }
        }));
    };
};