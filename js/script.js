const switcher = document.getElementById("langSwitcher");

switcher.addEventListener("change", () => {
    const lang = switcher.value;

    document.getElementById("title").innerText = translations[lang].title;
    document.getElementById("subtitle").innerText = translations[lang].subtitle;
    document.getElementById("heroTitle").innerText = translations[lang].heroTitle;
    document.getElementById("heroText").innerText = translations[lang].heroText;
    document.getElementById("valueTitle").innerText = translations[lang].valueTitle;
});

window.addEventListener("load", function () {
    if (window.twttr) {
        window.twttr.widgets.load();
    }
});

