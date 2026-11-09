/* Year 12 lessons cleared for replacement uploads, 9 November 2026. */
(function(root){"use strict";
const chapters=[];
root.HumanBiologyATAR=(root.HumanBiologyATAR||[]).filter(lesson=>!(String(lesson.year)==="12"&&String(lesson.unit).startsWith("Unit 4")));
root.HBUnit4Catalog={chapters,resolve:key=>key};
})(window);
