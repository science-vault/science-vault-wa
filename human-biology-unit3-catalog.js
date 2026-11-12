/* Index the authored course without replacing its lessons. */
(function(root){const chapters=root.HumanBiologyATAR.filter(m=>String(m.year)==="12"&&m.unit.startsWith("Unit 3"));root.HBUnit3Catalog={chapters,resolve:key=>key};})(window);
