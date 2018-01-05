// PathSubtract.jsx for Adobe Illustrator
// Description: Script for subtract object from Paths. Pathfinder in Illustrator does not do it =)
// Requirements: Adobe Illustrator CS6 and above
// Date: December, 2017
// Author: Sergey Osokin, email: hi@sergosokin.ru
// ============================================================================
// Installation:
// 1. Place script in:
//    Win (32 bit): C:\Program Files (x86)\Adobe\Adobe Illustrator [vers.]\Presets\en_GB\Scripts\
//    Win (64 bit): C:\Program Files\Adobe\Adobe Illustrator [vers.] (64 Bit)\Presets\en_GB\Scripts\
//    Mac OS: <hard drive>/Applications/Adobe Illustrator [vers.]/Presets.localized/en_GB/Scripts
// 2. Restart Illustrator
// 3. Choose File > Scripts > PathSubtract
// ============================================================================
// NOTICE:
// Tested with Adobe Illustrator CS6 (Win), CC 2017/2018 (Mac).
// This script is provided "as is" without warranty of any kind.
// Free to use, not for sale.
// ============================================================================
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php

#target illustrator
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

function main () {
    // Version Requirements
    if ((app.version.substr(0, 2) * 1) < 16) {
        alert('Sorry, the PathSubtract only works in CS6 (v16) and above.\n' + 'You are using Adobe Illustrator v' + app.version.substr(0, 2));
        return;
    }

    if (app.documents.length == 0 ) { 
        throw new Error('There are no documents open.\nOpen a document and try again.');
        return; 
    }

    var expand = true;
    var doc = app.activeDocument;
    var fillOk = 0; //Check filled objects
    var fillObj = []; //Filled mask objects array

    if (doc.selection.length == 0 ) { 
        throw new Error('Script Error\nThere are no selected objects.');
        return; 
    }
    
    for (i = 0; i < doc.selection.length; i++) {
        var itemGI = doc.selection[i];
        if (itemGI.typename === "GroupItem") {
            release(itemGI,'pageItems');
        }  
    }

    app.redraw();
    var docSelected = doc.selection;

    // Searching unfilled objects before subtract
    for (j = 0; j < docSelected.length; j++) {
        var item = docSelected[j];
        if (item.filled && item.closed) {
            fillOk = 1;
        }
        if (item.typename === "CompoundPathItem") {
            itemCP = item.pathItems[0];
            if (itemCP.filled && itemCP.closed) {
                fillOk = 1;
            }  
        }
    }
    
    // Creating mask for Paths
    if (fillOk > 0) {
        // Searching compound shapes in selection
        for (k = 0; k < docSelected.length; k++) {
            var item = docSelected[k];
            var typename = item.typename;
            if (typename === 'CompoundPathItem') {
                release(item,'pathItems');
            }
        }

        for (l = 0; l < sel().length; l++) {
            var item = sel()[l];
            if (item.filled && item.closed) fillObj.push(item);
        }

        app.executeMenuCommand('Make Planet X');

        var lPaint = doc.selection;
        deselect();
        removeFill(fillObj);
        doc.selection = lPaint;

        // Expand mask after if you needed
        expand = confirm('Done\nDo you want expand masked Open Paths?');
        if (expand) {
            app.executeMenuCommand('Expand Planet X');
        }
    } else {
        throw new Error('Script Error\nPlease, fill the closed mask object in any color.');
    }
}

function release(obj, action) {
    for (m = obj[action].length-1 ; m >= 0; m--){
        obj[action][m].move( obj, ElementPlacement.PLACEAFTER );

    }
}

function removeFill(obj) {
    for (n = 0; n < obj.length; n++) {
        obj[n].selected = true;
        obj[n].stroked = false;
        obj[n].filled = false;
    }
}

function sel() {
    return app.activeDocument.selection;
}

function deselect() {
    app.activeDocument.selection = null;
}

try {
    main ();    
} catch(e) {
  alert(e.message, 'Script Alert', true);
}
