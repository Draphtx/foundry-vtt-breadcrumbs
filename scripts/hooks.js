import { BreadcrumbsToken } from './breadcrumbs.js';

Hooks.on("updateToken", function(tokenDocument, updateData, diffData, _) {
    if(tokenDocument.flags?.breadcrumbs) {
        const breadcrumbsToken = new BreadcrumbsToken(tokenDocument, updateData, diffData);
        breadcrumbsToken.processUpdatedToken();
    };
    Hooks.off("updateToken");
});