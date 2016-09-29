var baseURL;

function loadingTemplate() {
    var loadingDoc = "<document><loadingTemplate><activityIndicator><text>Loading ...</text></activityIndicator></loadingTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(loadingDoc, "application/xml");
    navigationDocument.pushDocument(parsedTemplate);
}

function getDocument(extension) {
    var templateXHR = new XMLHttpRequest();
    var url = baseURL + extension;

    loadingTemplate();
    templateXHR.responseType = "document";
    templateXHR.open("GET", url, true);
    templateXHR.addEventListener("load", function() {pushPage(templateXHR.responseXML);}, false);
    templateXHR.send();
}

function pushPage(document) {
    navigationDocument.pushDocument(document);
}

App.onLaunch = function(options) {
    baseURL = options.BASEURL;
    var extension = "templates/PageNavigation.xml";
    getDocument(extension);
}
