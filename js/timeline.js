// ── Page fade in ──
window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("page-overlay").classList.add("hidden"), 100);
});

// ── Fade out on nav ──
function fadeOut(href) {
    const o = document.getElementById("page-overlay");
    o.style.transition = "opacity 0.6s ease";
    o.style.opacity = "1";
    o.style.pointerEvents = "all";
    setTimeout(() => window.location.href = href, 650);
}
document.getElementById("logo-link").addEventListener("click", e => { e.preventDefault(); fadeOut("index.html"); });
document.getElementById("back-btn").addEventListener("click", e => { e.preventDefault(); fadeOut("more.html"); });

// ── Stars ──
const sc = document.getElementById("star-container");
for (let i = 0; i < 70; i++) {
    const s = document.createElement("div"); s.className = "star";
    const sz = Math.random()*2+1+"px";
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz};height:${sz};animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*4}s;`;
    sc.appendChild(s);
}

// ── Snow ──
const snc = document.getElementById("snow-container");
for (let i = 0; i < 40; i++) {
    const sf = document.createElement("div"); sf.className = "snowflake";
    const sz = Math.random()*3+2+"px";
    sf.style.cssText = `left:${Math.random()*100}vw;width:${sz};height:${sz};animation-duration:${Math.random()*10+5}s;animation-delay:${Math.random()*5}s;`;
    snc.appendChild(sf);
}

// ── Scroll reveal ──
document.querySelectorAll(".reveal").forEach(el =>
    new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("active"); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1 }).observe(el)
);

// ── Timeline era data ──
const eras = [
    {
        epoch: "Late Miocene",
        title: "Eucyon davisi",
        subtitle: "10,000,000 Years Ago",
        caption: "The Canid Ancestor",
        body: "The first true canids emerged in North America during the Late Miocene. Eucyon davisi, the size of a small coyote, would become the ancestor of all foxes and wolves we know today.",
        facts: [
            "Originated in North America during the Late Miocene epoch.",
            "Body size comparable to a modern coyote — agile and fast.",
            "Crossed the Bering Land Bridge to begin colonizing Eurasia."
        ]
    },
    {
        epoch: "Pliocene Rise",
        title: "Vulpes Genus",
        subtitle: "5,000,000 Years Ago",
        caption: "The Genus Forms",
        body: "As the climate cooled during the Pliocene, the Vulpes genus diverged in Eurasia. Increased brain volume and social behavior gave them an edge over competing carnivores.",
        facts: [
            "Genus Vulpes formed in Eurasia as climate shifted cooler.",
            "Began migrating south into Africa and east into Asia.",
            "Brain size increased to support sophisticated social hunting."
        ]
    },
    {
        epoch: "Pleistocene Epoch",
        title: "Vulpes vulpes",
        subtitle: "1,000,000 Years Ago",
        caption: "The Red Fox Emerges",
        body: "Amidst the shifting glaciers of the Pleistocene, the true Red Fox split from its ancestors in Eurasia. This was a pivotal moment in the fox's history, as it developed specialized traits required to thrive in the harshest environments on Earth.",
        facts: [
            "Extreme Cold Adaptation: Developed thicker pelts and specialized circulatory systems in paws.",
            "Eurasian Migration: Established dominance across the northern land bridge before spreading south.",
            "Cunning Evolution: Increased cranial capacity for sophisticated hunting strategies in deep snow."
        ]
    },
    {
        epoch: "The Dispersion",
        title: "Global Spread",
        subtitle: "500,000 Years Ago",
        caption: "Across Every Continent",
        body: "During the great glacial cycles, Red Fox populations crossed land bridges and colonized every continent in the Northern Hemisphere, beginning to diverge into regional subspecies.",
        facts: [
            "Spread across North America via the Bering Land Bridge.",
            "Subspecies began diverging due to geographic isolation.",
            "Population densities established on 4 continents simultaneously."
        ]
    },
    {
        epoch: "Modern Era",
        title: "45 Subspecies",
        subtitle: "Present Day — 2026",
        caption: "The Modern Vulpes",
        body: "Today, Vulpes vulpes is the most geographically widespread carnivore on Earth. With 45 recognized subspecies adapted to every climate from Arctic tundra to the Sahara edge, the fox's story continues.",
        facts: [
            "45 subspecies recognized by the IUCN Red List — all Least Concern.",
            "Territory spans over 70 million km² across 4 continents.",
            "Successfully adapted to urban environments on every inhabited continent."
        ]
    }
];

let currentEra = 2;
window.selectEra = function(index) {
    currentEra = index;
    const era = eras[index];

    // Update detail card with fade
    const card = document.getElementById("detail-card");
    if (!card) return;
    
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    setTimeout(() => {
        document.getElementById("detail-epoch").textContent   = era.epoch;
        document.getElementById("detail-title").textContent   = era.title;
        document.getElementById("detail-subtitle").textContent = era.subtitle;
        document.getElementById("detail-caption").textContent  = era.caption;
        document.getElementById("detail-body").textContent    = era.body;

        const ul = document.getElementById("detail-facts");
        if (ul) {
             ul.innerHTML = era.facts.map(f =>
                `<li class="flex items-start gap-4"><span class="text-purple-400 mt-1 flex-shrink-0">✦</span><span>${f}</span></li>`
             ).join("");
        }

        // update active dot
        document.querySelectorAll(".timeline-dot .w-6.h-6").forEach(el => {
            el.className = el.className.replace("w-6 h-6", "w-4 h-4").replace("bg-purple-400", "bg-purple-400/60");
            el.innerHTML = "";
            el.removeAttribute("id");
            if (el.nextElementSibling && el.nextElementSibling.classList.contains("dot-ring")) {
                el.nextElementSibling.remove();
            }
        });
        
        // Very basic simple state management for visual cues
        
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, 300);
}
