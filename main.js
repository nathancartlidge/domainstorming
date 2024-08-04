const domains_div = document.getElementById("domains");
const domains_search = document.getElementById("search")
let domains = []

fetch("domains.txt")
    .then((res) => res.text())
    .then((text) => {
        domains = text.split("\n").slice(1, -1).map((domain) => domain.toLowerCase());
        domains.forEach((domain) => {
            let el = document.createElement("p");
            let url = document.createElement("span");
            let link = document.createElement("a");
            el.innerText = "." + domain;
            el.id = "domain_" + domain;
            url.id = "domain_url_" + domain;
            link.innerText = "(wiki)";
            link.href = "https://en.wikipedia.org/wiki/." + domain;
            el.appendChild(url);
            el.appendChild(link)
            domains_div.appendChild(el);
        });
        filterDomains();
    })

function filterDomains() {
    let search_value = domains_search.value.toLowerCase();
    let count = 0;
    if (search_value === "") {
        domains_div.classList.add("show-all");
        count = 1;
    } else {
        domains_div.classList.remove("show-all");
        domains.forEach((domain) => {
            let domain_el = document.getElementById("domain_" + domain);
            let domain_url_el = document.getElementById("domain_url_" + domain);

            if (search_value.endsWith(domain)) {
                domain_url_el.innerText = search_value.slice(0, -domain.length);
                domain_el.classList.remove("hide", "partial");
                count += 1;
            } else if (search_value.length > domain.length && search_value.slice(0, -1).endsWith(domain)) {
                domain_url_el.innerText = search_value.slice(0, -(1 + domain.length));
                domain_el.classList.remove("hide");
                domain_el.classList.add("partial")
                count += 1;
            } else {
                domain_el.classList.add("hide");
            }
        });
    }

    if (count === 0) {
        domains_div.classList.add("no-results")
    } else {
        domains_div.classList.remove("no-results")
    }
}

domains_search.addEventListener("input", filterDomains)