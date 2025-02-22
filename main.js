const ideas_div = document.getElementById("ideas");
const domains_div = document.getElementById("domains");
const domains_search = document.getElementById("search");
let domains = [];
let words = [];

fetch("domains.txt")
    .then((res) => res.text())
    .then((text) => {
        domains = text.split("\n").slice(1, -1).map((domain) => domain.toLowerCase());
        domains.forEach((domain) => {
            let el = document.createElement("p");
            let pre = document.createElement("span");
            let post = document.createElement("span");
            let link = document.createElement("a");
            el.innerText = "." + domain;
            el.id = "domain_" + domain;
            pre.id = "domain_pre_" + domain;
            post.id = "domain_post_" + domain;
            link.innerText = "(wiki)";
            link.href = "https://icannwiki.org/." + domain;
            el.appendChild(pre);
            el.appendChild(post);
            el.appendChild(link);
            domains_div.appendChild(el);
        });
        filterDomains();
    })
    .then(() => fetch("google-10000-english-no-swears.txt"))
    .then((res) => res.text())
    .then((text) => {
        words = text.split("\n").filter((word) => word.length >= 3);
        ideate();
    })


function ideate() {
    while (ideas_div.children.length > 1) {
        ideas_div.removeChild(ideas_div.children[1])
    }
    let pushed_words = 0;
    let i = 0;
    while (pushed_words < 10 && i < 100) {
        i += 1;
        let word = words[Math.floor(Math.random() * words.length)];
        let match = getMatch(word)
        if (match !== null) {
            pushed_words += 1;
            ideas_div.appendChild(makeElement(...match));
        }
    }
}

function makeElement(prefix, domain, postfix) {
    let el = document.createElement("p");
    let pre = document.createElement("span");
    let post = document.createElement("span");
    let link = document.createElement("a");
    el.innerText = "." + domain;
    pre.innerText = prefix;
    post.innerText = postfix;
    if (postfix !== "") {
        el.classList.add("partial")
    }
    link.innerText = "(wiki)";
    link.href = "https://icannwiki.org/." + domain;
    el.appendChild(pre);
    el.appendChild(post);
    el.appendChild(link);
    return el;
}

function getMatch(word) {
    let partial = null;
    for (let domain of domains) {
        if (word.length > domain.length && word.endsWith(domain)) {
            return [word.slice(0, -domain.length), domain, ""];
        } else if (partial === null && word.length > domain.length + 1 && word.slice(0, -1).endsWith(domain)) {
            if (words.includes(word.slice(0, -1))) {
                // we do not treat as a partial word if the shortened version is also a word
                return [word.slice(0, -domain.length - 1), domain, ""];
            } else {
                partial = [word.slice(0, -domain.length - 1), domain, "/" + word.slice(-1)];
            }
        }
    }
    return partial;
}

function filterDomains() {
    let search_value = domains_search.value.toLowerCase();
    let count = 0;
    if (search_value === "") {
        domains_div.classList.add("show-all");
        ideas_div.classList.remove("hide");
        count = 1;
    } else {
        domains_div.classList.remove("show-all");
        ideas_div.classList.add("hide");

        domains.forEach((domain) => {
            let domain_el = document.getElementById("domain_" + domain);
            let domain_pre_el = document.getElementById("domain_pre_" + domain);
            let domain_post_el = document.getElementById("domain_post_" + domain);

            if (search_value.length > domain.length && search_value.endsWith(domain)) {
                domain_pre_el.innerText = search_value.slice(0, -domain.length);
                domain_post_el.innerText = "";
                domain_el.classList.remove("hide", "partial");
                count += 1;
            } else if (search_value.length > domain.length + 1 && search_value.slice(0, -1).endsWith(domain)) {
                domain_pre_el.innerText = search_value.slice(0, -domain.length-1);
                domain_el.classList.remove("hide");
                domain_el.classList.add("partial");
                domain_post_el.innerText = "/" + search_value.slice(-1);
                count += 1;
            } else if (search_value.length <= domain.length && domain.includes(search_value)) {
                domain_pre_el.innerText = "";
                domain_post_el.innerText = "";
                domain_el.classList.remove("hide", "partial");
                count += 1;
            } else {
                domain_el.classList.add("hide");
            }
        });
    }

    if (count === 0) {
        domains_div.classList.add("no-results");
    } else {
        domains_div.classList.remove("no-results");
    }
}

domains_search.addEventListener("input", filterDomains);