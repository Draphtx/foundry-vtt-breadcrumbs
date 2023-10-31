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
    <legend>Actor & Token Controls</legend>

    <!-- Boolean input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="enableBreadcrumbs">Enable Breadcrumbs</label>  
      <div class="col-md-4">
      <input id="enableBreadcrumbs" name="enableBreadcrumbs" type="checkbox" checked></input>
      </div>
    </div>
    
    <div class="form-group">
      <label class="col-md-4 control-label" for="applyToActor">Apply to Actor</label>  
      <div class="col-md-4">
      <input id="applyToActor" name="applyToActor" type="checkbox"></input>
      </div>
    </div>

    </fieldset>
    </form>

    <form class="form-horizontal">
    <fieldset>
    <legend>Image Properties</legend>
    
    <div class="form-group">
        <label>Breadcrumbs Image</label>
        <button onclick="fileBrowser()">
            <img id="breadcrumbsImagePreview" src="` + game.settings.get("breadcrumbs", "breadcrumbs-default-image") + `" style="width: 50px; height: 50px;">
        </button>
    </div>

    <div class="form-group">
        <label>Image Tint</label>
        <input type="text" name="imageTint" is="colorpicker-input" data-responsive-color>
    </div>

    <!-- Range input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="imageScale">Image Scale</label>  
      <div class="col-md-4">
        <input id="imageScale" name="imageScale" type="range" min="0.1" max="1" step="0.1" defaultValue="1" value="1" oninput="document.getElementById('rangeValLabel').innerHTML = this.value;"></input>
        <span class="help-block">Scale: </span>
      <em id="rangeValLabel" style="font-style: normal;">1</em>
      </div>
    </div>

    </fieldset>
    </form>

    <form class="form-horizontal">
    <fieldset>
    <legend>Trail Properties</legend>

    <div class="form-group">
      <label class="col-md-4 control-label" for="alternateSidess">Alternate Sides</label>
      <div class="col-md-4">
      <input id="alternateSides" name="alternateSides" type="checkbox"></input>
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="isHidden">Hidden</label>
      <div class="col-md-4">
      <input id="isHidden" name="isHidden" type="checkbox"></input>
      </div>
    </div>

    </fieldset>
    </form>
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
            html.find('[name="applyToActor"]').val(),
            html.find("#breadcrumbsImagePreview").attr("src"),
            html.find('[name="imageTint"]').val(),
            html.find('[name="imageScale"]').val(),
            html.find('[name="alternateSides"]').val(),
            html.find('[name="isHidden"]').val(),
        )}   
        }
      },
    default: 'apply',
}).render(true);

async function setupBreadcrumbsActors(enableBreadcrumbs, applyToActor, breadcrumbsImage, imageTint, imageScale, alternateSides, isHidden) {
    const enableBreadcrumbsCheckbox = document.getElementById('enableBreadcrumbs');
    const setForSceneCheckbox = document.getElementById('setForScene');
    const alternateSidesCheckbox = document.getElementById('alternateSides');
    const isHiddenCheckbox = document.getElementById('alternateSides');

    if(applyToActor.checked) {
        canvas.tokens.controlled.forEach(token => token.document.actor.update({
            flags: {
                breadcrumbs: {
                    enabled: enableBreadcrumbsCheckbox.checked,
                    style: {
                        src: breadcrumbsImage,
                        scale: imageScale,
                        tint: imageTint.substring(0, 7),
                        alternating: alternateSidesCheckbox.checked,
                        hidden: isHiddenCheckbox.checked
                    }
                }
            }
        }));
    } else {
        canvas.tokens.controlled.forEach(token => token.document.update({
            flags: {
                breadcrumbs: {
                    enabled: enableBreadcrumbsCheckbox.checked,
                    style: {
                        src: breadcrumbsImage,
                        scale: imageScale,
                        tint: imageTint.substring(0, 7),
                        alternating: alternateSidesCheckbox.checked,
                        hidden: isHiddenCheckbox.checked
                    }
                }
            }
        }));
    };
};