function loadNews() {

    const container = document.getElementById("news");
    if (!container) return;

    container.innerHTML = "<p>Loading...</p>";

    const rssUrl = encodeURIComponent(
        "https://news.google.com/rss/search?q=Mexico+logistics+investment+security"
    );

    fetch(`https://api.allorigins.win/get?url=${rssUrl}`)
    .then(res => res.json())
    .then(data => {

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const items = xml.querySelectorAll("item");

        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = "<p>No news found</p>";
            return;
        }

        items.forEach((item, i) => {
            if (i >= 10) return;

            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;

            const div = document.createElement("div");
            div.className = "news-item";

            div.innerHTML = `
                <a href="${link}" target="_blank">
                    ${title}
                </a>
            `;

            container.appendChild(div);
        });

    })
    .catch(err => {
        console.error("RSS error:", err);
        container.innerHTML = "<p>Error loading news</p>";
    });
}

// INIT + REFRESH
window.addEventListener("load", function () {
    loadNews();
    setInterval(loadNews, 60000);
});