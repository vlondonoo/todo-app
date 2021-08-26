(function(){
    'use strict';

    alert('Hello World');
    /*% if (feature.featureA) { */alert('Feature A');/*% } */
    alert('/*%= data.aValue */');
    alert('/*%= data.bValue */');
    alert('/*%= data.more.cValue */');
    alert('/*%= data.more.dValue */');
    alert('/*%= data.more.andmore.eValue */');
    alert('/*%= data.more.andmore.fValue */');
})();
