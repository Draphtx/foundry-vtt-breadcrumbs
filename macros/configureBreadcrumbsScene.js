const currentScene = game.scenes.current

const loadoutsTileDialog = new Dialog({
    title: "Breadcrumbs", 
    content:`
    <script type="text/javascript">
        function limitWeightLength(obj){
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
      <input id="enableBreadcrumbs" name="enableBreadcrumbs" type="checkbox"></input>
      </div>
    </div>
    
    <div class="form-group">
      <label>Breadcrumbs Image</label>
      <input type='text' name='breadcrumbsImage' value='` + game.settings.get("breadcrumbs", "breadcrumbs-default-image") + `'></input>
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
            callback: html => {setupBreadcrumbsScene(
                html.find('[name="enableBreadcrumbs"]').val(),
                html.find('[name="breadcrumbsImage"]').val()
            )}   
            }
      },
      default: 'apply',
}).render(true);

async function setupBreadcrumbsScene(enableBreadcrumbs, breadcrumbsImage){
    currentScene.update({
        "flags.breadcrumbs": {
            "enabled": true,
            "image": breadcrumbsImage
        }
    });
};