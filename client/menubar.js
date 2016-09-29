var baseURL;

function loadingTemplate() {
    var loadingDoc = "<document><loadingTemplate><activityIndicator><text>Loading KassirTV</text></activityIndicator></loadingTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(loadingDoc, "application/xml");
    return parsedTemplate;
}

function alertTemplate() {
    var alertDoc = "<document><alertTemplate><title>Error</title><description>Page failed to load</description></alertTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(alertDoc, "application/xml");
    return parsedTemplate;
}

function loadAndPushDocument(url) {
    var loadingDocument = loadingTemplate();
    navigationDocument.pushDocument(loadingDocument);
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
        if (request.readyState != 4) {
            return;
        }

        if (request.status == 200) {
            var document = request.responseXML;
            document.addEventListener("select", handleSelectEvent);
            navigationDocument.replaceDocument(document, loadingDocument)
        }
        else {
            navigationDocument.popDocument();
            var alertDocument = alertTemplate();
            navigationDocument.presentModal(alertDocument);
        }
    };
    request.send();
}

function updateMenuItem(menuItem, url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
        if (request.status == 200) {
            var document = request.responseXML;
            document.addEventListener("select", handleSelectEvent);
            var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
            menuItemDocument.setDocument(document, menuItem)
        }
    };

    request.send();
}

function handleSelectEvent(event) {
    var selectedElement = event.target;

    var targetURL = selectedElement.getAttribute("selectTargetURL");
    if (!targetURL) {
        return;
    }
    targetURL = baseURL + targetURL;

    if (selectedElement.tagName == "menuItem") {
        updateMenuItem(selectedElement, targetURL);
    }
    else {
        loadAndPushDocument(targetURL);
    }
}

App.onLaunch = function(options) {
    baseURL = options.BASEURL;
    var startDocumentURL = baseURL + "templates/MenuBar.xml";

    loadAndPushDocument(startDocumentURL)
}
