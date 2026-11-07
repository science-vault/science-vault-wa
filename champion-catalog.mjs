/* Original Champion Hall roster. Atlas coordinates follow fixed 5×5 art sheets. */
const roster=[
 ['astra','Astra','Starforged Sentinel','Cosmic guardian','A spear of starlight. A promise to protect every new discovery.','#779fef'],
 ['vex','Vex','The Catalyst','Arcane alchemist','Every great transformation begins with a spark of curiosity.','#ba82ec'],
 ['sylva','Sylva','Wildheart Guardian','Nature protector','She hears the living world, from the smallest cell to the oldest forest.','#6ec499'],
 ['cipher','Cipher','Rift Architect','Geometric mage','Impossible structures become paths when you understand their patterns.','#e6c16b'],
 ['chrona','Chrona','Keeper of Ages','Time keeper','A thousand stories live inside a single turning hourglass.','#6ec9c7'],
 ['nyra','Nyra','Stormblade','Lightning duelist','She reads the storm before the first thunder reaches the ground.','#a2bdec'],
 ['kael','Kael','Emberforged','Flame warrior','Every challenge is another flame in his forge.','#e39560'],
 ['mira','Mira','Tidecaller','Ocean oracle','She charts the hidden currents that connect every shore.','#68c7d3'],
 ['orin','Orin','Earthshaper','Stone guardian','Mountains remember. Orin has learned to listen.','#a1b68e'],
 ['lyra','Lyra','Voidseer','Cosmic seer','She turns unanswered questions into constellations.','#b193d6'],
 ['solara','Solara','Dawnwing','Solar archer','Her arrows carry the first light of a new understanding.','#ebc976'],
 ['arkon','Arkon','Iron Warden','Construct knight','Built to stand firm. Rebuilt to think for himself.','#b8b5ac'],
 ['zara','Zara','Prism Dancer','Crystal duelist','One beam, a thousand colours, and a different angle on every problem.','#8ed6dd'],
 ['thane','Thane','Frostbound','Ice warrior','Patience is his strongest weapon in the longest winter.','#a0cde3'],
 ['elara','Elara','Moonscribe','Lunar scholar','She writes the stories that guide travellers through the dark.','#b4b8e3'],
 ['mekko','Mekko','Gearsmith','Copper construct','An inventive heart beats behind a hundred tiny gears.','#dda76e'],
 ['sable','Sable','Dusk Ranger','Shadow scout','She finds the clues others pass without noticing.','#b0a0cb'],
 ['zephyr','Zephyr','Cloudrunner','Wind sentinel','He follows the currents, then builds a better way forward.','#b7d7d1'],
 ['iona','Iona','Verdant Healer','Botanical healer','Small discoveries bloom into extraordinary possibilities.','#a4c68e'],
 ['kairo','Kairo','Rift Sentinel','Space guardian','He stands where worlds meet and connections begin.','#88b4e5'],
 ['nova','Nova','Cosmic Architect','Star mage','The universe is her workshop. Questions are her tools.','#b1a1e8'],
 ['brann','Brann','Forgeheart','Volcanic smith','He turns raw ideas into something strong enough to last.','#da956f'],
 ['seren','Seren','Aurora Oracle','Northern seer','The sky speaks in colours; she knows how to read them.','#91d4ba'],
 ['nox','Nox','Obsidian Reaver','Crystal knight','He brings sharp focus to the most difficult challenge.','#cb8195'],
 ['valora','Valora','Astral Empress','Regal guardian','A crown earned through knowledge shines brighter than gold.','#e9ce8e'],
 ['onyx','Onyx','Nightglass Knight','Panther guardian','Silent, watchful, and always one discovery ahead.','#a58acb'],
 ['nerida','Nerida','Deepwater Oracle','Abyssal seer','There is a world of answers beneath the surface.','#78bdd5'],
 ['volt','Volt','Circuit Monk','Electric sentinel','Discipline turns a spark into a powerful current.','#deb968'],
 ['petal','Petal','Orchid Blade','Botanical duelist','Grace and precision grow from daily practice.','#dcaecb'],
 ['rune','Rune','Stone Archivist','Ancient scholar','He carries the lessons of centuries into the next unknown.','#b1bda0'],
 ['azra','Azra','Desert Astronomer','Celestial navigator','She measures a limitless sky from a shifting sea of sand.','#dfb484'],
 ['boreal','Boreal','Winter Colossus','Arctic giant','Every steady step leaves a path for someone else.','#b6d5df'],
 ['cinder','Cinder','Phoenix Mantle','Flame guardian','A failed attempt is the beginning of her next rise.','#e5a57a'],
 ['dune','Dune','Scarab Construct','Sandstone guardian','An ancient design, driven by a new question.','#cfb681'],
 ['echo','Echo','Resonance Weaver','Sound mage','She discovers the harmony between seemingly separate ideas.','#baa3db'],
 ['ferra','Ferra','Magnet Knight','Metal duelist','Opposing forces become a source of strength.','#d28d9e'],
 ['galen','Galen','Jade Mender','Healing scholar','Understanding is the first step towards making things better.','#9bcaab'],
 ['halo','Halo','Glasswing','Luminous guardian','She reveals the hidden brilliance inside every idea.','#b5d9e4'],
 ['iris','Iris','Spectrum Sovereign','Chromatic mage','She sees every problem through more than one colour.','#c8a7dd'],
 ['juno','Juno','Moon Huntress','Lunar ranger','Careful observation makes the distant target clear.','#9daed8'],
 ['kestrel','Kestrel','Skywatch Ranger','Feathered scout','A wider view reveals the connection you were missing.','#cca78d'],
 ['lumen','Lumen','Lantern Spirit','Light construct','Even a little understanding can light the next step.','#e1c17d'],
 ['meridian','Meridian','Compass Navigator','Explorer captain','No route is lost when you know how to find your bearings.','#85c5c1'],
 ['nyxara','Nyxara','Eclipse Crown','Dark celestial','She finds meaning in the space between light and shadow.','#9fa6d8'],
 ['obra','Obra','Obsidian Smith','Mountain smith','The strongest creations begin with patient work.','#c8947b'],
 ['pyra','Pyra','Solar Titan','Sun guardian','A brilliant mind needs a purpose as powerful as its light.','#e6b46f'],
 ['quartz','Quartz','Crystal Colossus','Gemstone construct','Pressure and persistence reveal what lies within.','#a3d5de'],
 ['rhea','Rhea','Garden Sovereign','Nature empress','Knowledge grows when you give it room to take root.','#c19fa9'],
 ['soren','Soren','Dragon Scholar','Silver sage','Experience gives him wings. Curiosity keeps him flying.','#acc5df'],
 ['zenith','Zenith','Stellar Sovereign','Cosmic champion','Fifty milestones. One extraordinary journey.','#d0c7ef']
];
export const CHAMPIONS=roster.map(([id,name,title,role,lore,color],i)=>({id,name,title,role,lore,color,level:i+1,sheet:i<25?'a':'b',cell:i%25}));
export const CHAMPION_MAP=Object.fromEntries(CHAMPIONS.map(c=>[c.id,c]));
export const LEGACY_CHAMPIONS={explorer:'astra',maker:'vex',scribe:'elara',keeper:'solara',engineer:'mekko',scholar:'soren',guardian:'sylva',navigator:'meridian',champion:'valora',astral:'nova',crystal:'zara',ember:'kael',archivist:'rune'};
export const SPECIAL_SKINS=CHAMPIONS.flatMap(c=>[
 {id:'skin:'+c.id+'-celestial',kind:'skin',ref:c.id+'-celestial',champion:c.id,name:'Celestial '+c.name,edition:'Celestial Edition',rarity:'epic',art:'celestial'},
 {id:'skin:'+c.id+'-eclipse',kind:'skin',ref:c.id+'-eclipse',champion:c.id,name:'Eclipse '+c.name,edition:'Eclipse Edition',rarity:'legendary',art:'eclipse'}
]);
export function championUnlocked(s,id,level){const c=CHAMPION_MAP[id];return !!c&&(Number(level)>=c.level||s.rewards?.legacyChampions?.includes(id));}
export function currentChampion(s){return CHAMPION_MAP[s.rewards?.champion]||CHAMPIONS[0];}
export function currentSkin(s){return SPECIAL_SKINS.find(k=>k.ref===s.rewards?.skin&&k.champion===currentChampion(s).id&&s.rewards?.owned?.includes(k.id))||null;}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function championPortrait(id='astra',skin='base',extra=''){
 const c=CHAMPION_MAP[id]||CHAMPIONS[0],k=SPECIAL_SKINS.find(k=>k.ref===skin&&k.champion===c.id),sheet=k?'skins':'roster',x=c.cell%5*25,y=Math.floor(c.cell/5)*25;
 return '<span class="champion-art '+(k?'edition-'+k.art:'')+' '+esc(extra)+'" role="img" aria-label="'+esc((k?k.name:c.name)+', '+c.title)+'" style="--champion-sheet:url(\'assets/champions/'+sheet+'-'+c.sheet+'.webp\');--champion-x:'+x+'%;--champion-y:'+y+'%;--champion-color:'+c.color+'"></span>';
}
