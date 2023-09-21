const currentScene = game.scenes.current

const loadoutsTileDialog = new Dialog({
    title: "Breadcrumbs", 
    content:`
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
      <label>Breadcrumbs Image</label>
      <input type='text' name='breadcrumbsImage' value='` + game.settings.get("breadcrumbs", "breadcrumbs-default-image") + `'></input>
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
      <input type="number" id="trailLength" name="trailLength" value="50" min="0" max="99" oninput="limitTrailLength(this)">
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
                html.find('[name="breadcrumbsImage"]').val(),
                html.find('[name="breadcrumbsScale"]').val(),
                html.find('[name="trailLength"]').val()
            )}   
            }
      },
      default: 'apply',
}).render(true);

async function setupBreadcrumbsScene(enableBreadcrumbs, breadcrumbsImage, breadcrumbsScale, trailLength){
    currentScene.update({
        "flags.breadcrumbs": {
            "enabled": enableBreadcrumbs,
            "image": breadcrumbsImage,
            "scale": breadcrumbsScale,
            "trails": {
                "length": {
                    max: Number(trailLength)
                }

            }
        }
    });
};