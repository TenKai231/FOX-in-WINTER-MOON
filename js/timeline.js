// ── Page fade in ──
window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("page-overlay").classList.add("hidden"), 100);
});

// ── All DOM-dependent code wrapped in DOMContentLoaded ──
document.addEventListener("DOMContentLoaded", () => {

    // ── Fade out on nav ──
    function fadeOut(href) {
        const o = document.getElementById("page-overlay");
        o.style.transition = "opacity 0.6s ease";
        o.style.opacity = "1";
        o.style.pointerEvents = "all";
        setTimeout(() => window.location.href = href, 650);
    }

    const logoLink = document.getElementById("logo-link");
    const backBtn  = document.getElementById("back-btn");
    if (logoLink) logoLink.addEventListener("click", e => { e.preventDefault(); fadeOut("../index.html"); });
    if (backBtn)  backBtn.addEventListener("click",  e => { e.preventDefault(); fadeOut("more.html"); });

    // ── Stars ──
    const sc = document.getElementById("star-container");
    if (sc) {
        for (let i = 0; i < 70; i++) {
            const s = document.createElement("div"); s.className = "star";
            const sz = Math.random() * 2 + 1 + "px";
            s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz};height:${sz};animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*4}s;`;
            sc.appendChild(s);
        }
    }

    // ── Snow ──
    const snc = document.getElementById("snow-container");
    if (snc) {
        for (let i = 0; i < 40; i++) {
            const sf = document.createElement("div"); sf.className = "snowflake";
            const sz = Math.random() * 3 + 2 + "px";
            sf.style.cssText = `left:${Math.random()*100}vw;width:${sz};height:${sz};animation-duration:${Math.random()*10+5}s;animation-delay:${Math.random()*5}s;`;
            snc.appendChild(sf);
        }
    }

    // ── Scroll reveal ──
    document.querySelectorAll(".reveal").forEach(el =>
        new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add("active"); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1 }).observe(el)
    );

    // ── Leaflet Migration Map ──
    if (typeof L !== "undefined") {
        const map = L.map("migration-map", {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            doubleClickZoom: false,
            attributionControl: false,
        }).setView([55.0, 60.0], 2);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 19,
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
        }).addTo(map);

        function createPulseIcon(color) {
            return L.divIcon({
                className: "",
                html: `<div style="position:relative;width:14px;height:14px">
                         <div style="width:14px;height:14px;background:${color};border-radius:50%;position:absolute;z-index:2;box-shadow:0 0 10px ${color}"></div>
                         <div style="width:14px;height:14px;background:${color};border-radius:50%;position:absolute;z-index:1;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></div>
                       </div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });
        }

        L.marker([64.2, -153.0], { icon: createPulseIcon("#A78BFA") })
            .addTo(map)
            .bindPopup("<b style='color:#A78BFA;font-family:Cinzel'>North America — Origin</b><br><span style='font-size:11px;color:#9ca3af'>Eucyon davisi, 10 Mya. Ancestral canid birthplace.</span>");

        L.marker([65.5, -168.0], { icon: createPulseIcon("#60A5FA") })
            .addTo(map)
            .bindPopup("<b style='color:#60A5FA;font-family:Cinzel'>Bering Land Bridge</b><br><span style='font-size:11px;color:#9ca3af'>Gateway to Eurasia, used 10–12 Mya during glacial periods.</span>");

        L.marker([55.0, 82.9], { icon: createPulseIcon("#A78BFA") })
            .addTo(map)
            .bindPopup("<b style='color:#A78BFA;font-family:Cinzel'>Central Eurasia — Spread</b><br><span style='font-size:11px;color:#9ca3af'>Vulpes vulpes established, 1 Mya. Spread across Eurasia.</span>");

        L.marker([51.5, -0.1], { icon: createPulseIcon("#FF8C42") })
            .addTo(map)
            .bindPopup("<b style='color:#FF8C42;font-family:Cinzel'>British Isles — Today</b><br><span style='font-size:11px;color:#9ca3af'>~150,000 urban foxes. Highest density in the world.</span>");

        L.polyline([
            [64.2, -153.0],
            [65.5, -168.0],
            [64.0,  173.0],
            [58.0,  100.0],
            [55.0,   82.9],
            [51.5,   -0.1],
        ], {
            color: "#A78BFA",
            weight: 2,
            opacity: 0.6,
            dashArray: "6, 8",
        }).addTo(map);

        const style = document.createElement("style");
        style.textContent = `
            .leaflet-popup-content-wrapper { background:#0f172a; color:white; border:1px solid rgba(167,139,250,0.3); border-radius:12px; }
            .leaflet-popup-tip { background:#0f172a; }
            .leaflet-popup-close-button { color:rgba(255,255,255,0.5) !important; }
            @keyframes ping { 0%{transform:scale(1);opacity:1} 75%{transform:scale(2);opacity:0} 100%{opacity:0} }
            .dot-ring {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 36px; height: 36px;
                border-radius: 50%;
                border: 2.5px solid rgba(167, 139, 250, 0.85);
                animation: dotPing 1.6s ease-out infinite;
                pointer-events: none;
            }
            .dot-ring.orange { border-color: rgba(255, 140, 66, 0.85); }
            @keyframes dotPing {
                0%   { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
                70%  { transform: translate(-50%, -50%) scale(2.2);   opacity: 0.3; }
                100% { transform: translate(-50%, -50%) scale(2.5);   opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

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
            ],
            link:    "https://en.wikipedia.org/wiki/Late_Miocene",
            sciLink: "https://paleobiodb.org/classic/checkTaxonInfo?taxon_no=41293",
            image:   "../assets/image/era_10mya.png"
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
            ],
            link:    "https://en.wikipedia.org/wiki/Pliocene",
            sciLink: "https://www.gbif.org/genus/5219238",
            image:   "../assets/image/era_5mya.png"
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
            ],
            link:    "https://en.wikipedia.org/wiki/Pleistocene",
            sciLink: "https://en.wikipedia.org/wiki/Red_fox",
            image:   "../assets/image/era_1mya.png"
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
            ],
            link:    "https://en.wikipedia.org/wiki/Bering_land_bridge",
            sciLink: "https://en.wikipedia.org/wiki/Vulpes_vulpes#Subspecies",
            image:   "../assets/image/era_500ka.png"
        },
        {
            epoch: "Modern Era",
            title: "45 Subspecies",
            subtitle: "Present Day — 2026",
            caption: "The Modern Vulpes",
            body: "Today, Vulpes vulpes is the most geographically widespread carnivore on Earth. With 45 recognized subspecies adapted to every climate from Arctic tundra to the Sahara edge, the fox's story continues.",
            facts: [
                "45 subspecies recognized by the IUCN Red List — all Least Concern.",
                "Territory spans over 70 million km\u00b2 across 4 continents.",
                "Successfully adapted to urban environments on every inhabited continent."
            ],
            link:    "https://en.wikipedia.org/wiki/Red_fox",
            sciLink: "https://www.iucnredlist.org/species/23062/166244332",
            image:   "../assets/image/era_today.png"
        }
    ];

    let currentEra = 2;

    window.selectEra = function(index) {
        currentEra = index;
        const era = eras[index];

        // ── Update timeline dot visuals ──
        const inactiveClass = [
            "w-4 h-4 rounded-full bg-purple-400    ring-4 ring-midnight-900 relative z-10 shadow-[0_0_15px_rgba(167,139,250,0.6)]",
            "w-4 h-4 rounded-full bg-purple-400/60 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_10px_rgba(167,139,250,0.3)]",
            "w-4 h-4 rounded-full bg-purple-400    ring-4 ring-midnight-900 relative z-10 shadow-[0_0_15px_rgba(167,139,250,0.6)]",
            "w-4 h-4 rounded-full bg-purple-400/60 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_10px_rgba(167,139,250,0.3)]",
            "w-4 h-4 rounded-full bg-fox-orange     ring-4 ring-midnight-900 relative z-10 shadow-[0_0_15px_rgba(255,140,66,0.5)]"
        ];
        const activeClass = [
            "w-6 h-6 rounded-full bg-purple-400 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_24px_rgba(167,139,250,0.95)]",
            "w-6 h-6 rounded-full bg-purple-400 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_24px_rgba(167,139,250,0.95)]",
            "w-6 h-6 rounded-full bg-purple-400 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_24px_rgba(167,139,250,0.95)]",
            "w-6 h-6 rounded-full bg-purple-400 ring-4 ring-midnight-900 relative z-10 shadow-[0_0_24px_rgba(167,139,250,0.95)]",
            "w-6 h-6 rounded-full bg-fox-orange ring-4 ring-midnight-900 relative z-10 shadow-[0_0_24px_rgba(255,140,66,0.9)]"
        ];
        for (let i = 0; i < 5; i++) {
            const circle = document.getElementById(`dot-circle-${i}`);
            if (!circle) continue;
            const container = circle.parentElement;
            // remove any existing ring
            const existing = container.querySelector(".dot-ring");
            if (existing) existing.remove();
            if (i === index) {
                circle.className = activeClass[i];
                const ring = document.createElement("div");
                ring.className = (i === 4) ? "dot-ring orange" : "dot-ring";
                container.appendChild(ring);
            } else {
                circle.className = inactiveClass[i];
            }
        }

        // ── Swap era image with fade effect ──
        const eraImg = document.getElementById("era-image");
        if (eraImg && era.image) {
            eraImg.style.transition = "opacity 0.35s ease";
            eraImg.style.opacity = "0";
            setTimeout(() => {
                eraImg.src = era.image;
                eraImg.onload = () => { eraImg.style.opacity = "1"; };
                // fallback in case onload doesn't fire (cached)
                setTimeout(() => { eraImg.style.opacity = "1"; }, 50);
            }, 350);
        }

        const card = document.getElementById("detail-card");
        if (!card) return;

        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        card.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        setTimeout(() => {
            document.getElementById("detail-epoch").textContent    = era.epoch;
            document.getElementById("detail-title").textContent    = era.title;
            document.getElementById("detail-subtitle").textContent = era.subtitle;
            document.getElementById("detail-caption").textContent  = era.caption;
            document.getElementById("detail-body").textContent     = era.body;

            const ul = document.getElementById("detail-facts");
            if (ul) {
                ul.innerHTML = era.facts.map(f =>
                    `<li class="flex items-start gap-4"><span class="text-purple-400 mt-1 flex-shrink-0">✦</span><span>${f}</span></li>`
                ).join("");
            }

            // ── Wire up buttons ──
            const exploreBtn = document.getElementById("explore-btn");
            const sciBtn     = document.getElementById("sci-btn");
            if (exploreBtn) exploreBtn.onclick = () => window.open(era.link,    "_blank", "noopener");
            if (sciBtn)     sciBtn.onclick     = () => window.open(era.sciLink, "_blank", "noopener");

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 300);
    };

    // ── Wire up buttons for the initial default era (index 2) ──
    const exploreBtn = document.getElementById("explore-btn");
    const sciBtn     = document.getElementById("sci-btn");
    if (exploreBtn) exploreBtn.onclick = () => window.open(eras[2].link, "_blank", "noopener");
    if (sciBtn)     sciBtn.onclick     = () => window.open(eras[2].sciLink, "_blank", "noopener");

}); // end DOMContentLoaded
