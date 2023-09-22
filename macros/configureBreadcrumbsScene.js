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
    <legend>Scene Configuration</legend>

    <!-- Boolean input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="enableBreadcrumbs">Enable Breadcrumbs</label>  
      <div class="col-md-4">
      <input id="enableBreadcrumbs" name="enableBreadcrumbs" type="checkbox" checked></input>
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="overrideActors">Override Actors</label>  
      <div class="col-md-4">
      <input id="overrideActors" name="overrideActors" type="checkbox"></input>
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

    <div class="form-group">
      <label for="trailLength">Max Trail Length</label>
      <input type="number" id="trailLength" name="trailLength" value="` + game.settings.get("breadcrumbs", "breadcrumbs-default-trail-length") + `" min="0" max="99" oninput="limitTrailLength(this)">
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
            callback: html => {setupBreadcrumbsScene(
                html.find('[name="enableBreadcrumbs"]').val(),
                html.find('[name="overrideActors"]').val(),
                html.find("#breadcrumbsImagePreview").attr("src"),
                html.find('[name="breadcrumbsScale"]').val(),
                html.find('[name="trailLength"]').val()
            )}   
            }
      },
      default: 'apply',
}).render(true);

async function setupBreadcrumbsScene(enableBreadcrumbs, breadcrumbsImage, breadcrumbsScale, trailLength){
    const enableBreadcrumbsCheckbox = document.getElementById('enableBreadcrumbs');
    const overrideActorsCheckbox = document.getElementById('overrideActors');
    currentScene.update({
        "flags.breadcrumbs": {
            enabled: enableBreadcrumbsCheckbox.checked,
            override_actors: overrideActorsCheckbox.checked,
            actors: {
                default: {
                    src: breadcrumbsImage,
                    scale: breadcrumbsScale,
                    tint: null
                }
            },
            trails: {
                length: {
                    max: Number(trailLength)
                }

            }
        }
    });
};