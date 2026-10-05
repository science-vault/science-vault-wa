/* Learning Vault WA LMS Topic Lesson Bank.
   Complete web lessons aligned to the Western Australian Curriculum: Science 2026.
   Repository PowerPoints, worksheets and videos can be attached later.
   Key: YEAR|COURSE|UNIT_OR_STRAND|TOPIC
*/
window.TopicLessons = window.TopicLessons || {};
window.registerTopicLesson = function(meta, html){
  if(!meta || !html) return;
  const key=[meta.year,meta.course,meta.unit,meta.topic].join('|');
  if(!window.TopicLessons[key]) window.TopicLessons[key]={...meta,lessons:[],html:''};
  window.TopicLessons[key].lessons.push({...meta,html});
  window.TopicLessons[key].html += html;
};

function y7BioLesson(n,title,learn,success,body,next){
  window.registerTopicLesson({year:7,course:'Science',unit:'Biological Sciences',topic:'Classification and feeding relationships',lesson:n,lessonTitle:'Lesson '+n+' — '+title,curriculum:'Western Australian Curriculum: Science 2026',repositorySources:[]},`
  <section class="lesson-block" style="border:2px solid #dfe9e7;border-radius:16px;padding:22px;margin:24px 0">
    <p><strong>Lesson ${n} of 10 · Year 7 Biological Sciences</strong></p>
    <h2>${title}</h2>
    <p><strong>Learning intention:</strong> ${learn}</p>
    <p><strong>Success criteria:</strong> ${success}</p>
    ${body}
    <div class="lesson-block"><h3>Teacher resource area</h3><p>PowerPoints, worksheets, videos and repository resources can be attached to this lesson later without changing the learning sequence.</p></div>
    <p><strong>Next lesson:</strong> ${next}</p>
  </section>`);
}

y7BioLesson(1,'Why Do Scientists Classify Living Things?','Understand why scientists classify organisms and how observable characteristics can be used to organise living things.','I can define classification, explain why it is useful, identify observable characteristics and group organisms using shared features.',`
<div class="lesson-block"><h3>Do Now</h3><ol><li>Name two ways books could be organised in a library.</li><li>How might a supermarket group products?</li><li>Why is grouping useful when there are thousands of items?</li></ol></div>
<div class="lesson-block"><h3>Learn — Classification</h3><p><strong>Classification</strong> is arranging organisms into orderly groups using shared characteristics. It helps scientists organise biodiversity, identify organisms, compare similarities and differences, communicate clearly and find information efficiently.</p><p>Useful observable characteristics include body covering, backbone, limbs, feathers, scales, hair or fur, wings, fins and other reliable features. Habitat alone is not enough.</p></div>
<div class="lesson-block"><h3>Key vocabulary</h3><ul><li><strong>organism</strong> — an individual living thing</li><li><strong>classification</strong> — arranging organisms into groups</li><li><strong>characteristic</strong> — a feature of an organism</li><li><strong>biodiversity</strong> — the variety of living things</li></ul></div>
<div class="lesson-block"><h3>I Do</h3><p>Animal A has feathers, wings and a beak; Animal B has fur and produces milk; Animal C has scales, fins and gills. Comparing shared characteristics allows A to be grouped with birds, B with mammals and C with fish.</p></div>
<div class="lesson-block"><h3>We Do</h3><p>Group a frog, spider, eagle, lizard, kangaroo and fish using one observable characteristic. Then divide one group again using another characteristic.</p></div>
<div class="lesson-block"><h3>You Do</h3><ol><li>Define classification.</li><li>Give two reasons scientists classify organisms.</li><li>List three useful observable characteristics.</li><li>Explain why a whale and shark should not be grouped together just because both live in water.</li><li>Classify an animal with a backbone, feathers and wings and justify your answer.</li></ol></div>
<div class="lesson-block"><h3>Assess — Exit ticket</h3><ol><li>What is classification?</li><li>Why is it useful?</li><li>Name one useful observable characteristic.</li><li>Why should several characteristics be considered?</li></ol></div>`,'Classification hierarchy — kingdom to species.');

y7BioLesson(2,'Classification Hierarchy — Kingdom to Species','Understand that scientists classify living things in a hierarchy from broad groups to increasingly specific groups.','I can order the major classification levels from kingdom to species and explain how groups become more specific.',`
<div class="lesson-block"><h3>Do Now</h3><ol><li>What is classification?</li><li>Why do scientists use shared characteristics?</li><li>Which is a broader group: all animals or all mammals?</li></ol></div>
<div class="lesson-block"><h3>Learn — The hierarchy</h3><p>A <strong>hierarchy</strong> is an arrangement of groups from broad to specific. The main levels are <strong>Kingdom → Phylum → Class → Order → Family → Genus → Species</strong>.</p><p>As we move down the hierarchy, groups contain fewer organisms but those organisms share more characteristics. <strong>Species</strong> is the most specific level in this sequence.</p></div>
<div class="lesson-block"><h3>Key vocabulary</h3><ul><li><strong>hierarchy</strong> — levels arranged from broad to specific</li><li><strong>kingdom</strong> — a very broad classification group</li><li><strong>genus</strong> — a group of closely related species</li><li><strong>species</strong> — the most specific classification level used here</li></ul></div>
<div class="lesson-block"><h3>I Do — Human example</h3><p>Humans can be classified as Animalia → Chordata → Mammalia → Primates → Hominidae → Homo → sapiens. Each step narrows the group and adds shared characteristics.</p></div>
<div class="lesson-block"><h3>Quick Check</h3><ol><li>Put Family, Kingdom, Species and Class in order from broadest to most specific.</li><li>Which contains more organisms: a kingdom or a genus?</li><li>At which level would organisms usually share the most characteristics?</li></ol></div>
<div class="lesson-block"><h3>We Do</h3><p>Use nested boxes to represent Kingdom, Phylum, Class, Order, Family, Genus and Species. Explain why each smaller box fits inside the previous one.</p></div>
<div class="lesson-block"><h3>You Do</h3><ol><li>Write the seven levels in order.</li><li>Explain what happens to the number of organisms as you move toward species.</li><li>Explain what happens to the number of shared characteristics.</li><li>Why is a hierarchy more useful than one enormous group?</li></ol></div>
<div class="lesson-block"><h3>Assess — Exit ticket</h3><ol><li>Write the classification levels from kingdom to species.</li><li>Which level is most specific?</li><li>Explain the relationship between group size and shared characteristics.</li></ol></div>`,'Kingdoms and major groups of living things.');

y7BioLesson(3,'Kingdoms and Major Groups','Recognise that living things can be placed into broad kingdoms using important shared characteristics.','I can compare broad groups of organisms and justify a classification using evidence.',`
<div class="lesson-block"><h3>Do Now</h3><ol><li>Write the hierarchy from Kingdom to Species.</li><li>Which level is broadest?</li><li>Would a kingdom contain one species or many species?</li></ol></div>
<div class="lesson-block"><h3>Learn — Broad groups</h3><p>Kingdoms are broad groups used to organise living things. At Year 7, the important idea is not memorising every organism but recognising that scientists use characteristics such as cell organisation, how organisms obtain nutrients, and body structure to distinguish broad groups.</p><p>Animals are multicellular consumers; plants are multicellular organisms that generally make their own food by photosynthesis; fungi obtain nutrients by absorption and include mushrooms, moulds and yeasts. Microscopic organisms include additional diverse groups.</p></div>
<div class="lesson-block"><h3>Key vocabulary</h3><ul><li><strong>multicellular</strong> — made of many cells</li><li><strong>consumer</strong> — obtains energy by consuming other organisms</li><li><strong>photosynthesis</strong> — process by which plants use light energy to make sugars</li><li><strong>fungus</strong> — organism that obtains nutrients by absorption</li></ul></div>
<div class="lesson-block"><h3>I Do</h3><p>A mushroom does not photosynthesise and absorbs nutrients from organic material. These characteristics support placing it with fungi rather than plants.</p></div>
<div class="lesson-block"><h3>We Do — Evidence sort</h3><p>Classify these descriptions as most consistent with animal, plant or fungus: (A) multicellular and photosynthesises; (B) multicellular and eats other organisms; (C) absorbs nutrients and may form thread-like structures.</p></div>
<div class="lesson-block"><h3>You Do</h3><ol><li>Give two characteristics of animals.</li><li>Give two characteristics of plants.</li><li>How do fungi obtain nutrients?</li><li>Explain why a mushroom should not be classified as a plant simply because it does not move from place to place.</li><li>Why should classification decisions use several characteristics?</li></ol></div>
<div class="lesson-block"><h3>Assess — Exit ticket</h3><p>An unknown multicellular organism cannot photosynthesise and absorbs nutrients from decaying material. Which broad group best fits it? Give two pieces of evidence.</p></div>`,'Using dichotomous keys to identify organisms.');

y7BioLesson(4,'Using Dichotomous Keys','Use a dichotomous key to identify organisms from observable characteristics.','I can follow paired choices accurately and identify an organism using a dichotomous key.',`
<div class="lesson-block"><h3>Do Now</h3><ol><li>What does classification mean?</li><li>Name two observable characteristics.</li><li>What does the prefix “di-” suggest?</li></ol></div>
<div class="lesson-block"><h3>Learn — What is a dichotomous key?</h3><p>A <strong>dichotomous key</strong> is a classification tool made from a sequence of paired choices. At each step there are two alternatives. The chosen statement directs you to another pair of statements or to the identity of the organism.</p><p>Good choices use clear, observable and mutually exclusive characteristics.</p></div>
<div class="lesson-block"><h3>I Do — Mini key</h3><p>1a Has feathers → Bird<br>1b Does not have feathers → go to 2<br>2a Has fur → Mammal<br>2b Does not have fur → Reptile</p><p>An organism with fur follows 1b, then 2a, so it is identified as a mammal.</p></div>
<div class="lesson-block"><h3>Quick Check</h3><ol><li>Why is the key called dichotomous?</li><li>How many choices should appear at each step?</li><li>Why is “has wings / is dangerous” a poor pair of choices?</li></ol></div>
<div class="lesson-block"><h3>We Do</h3><p>Use this key for a shark, eagle, kangaroo and lizard: 1a feathers → eagle; 1b no feathers → 2. 2a fur → kangaroo; 2b no fur → 3. 3a fins → shark; 3b no fins → lizard. Trace the pathway for each organism.</p></div>
<div class="lesson-block"><h3>You Do</h3><ol><li>Define dichotomous key.</li><li>Identify the number of choices at each step.</li><li>Explain why observable characteristics are important.</li><li>Write the pathway used to identify the shark in the example.</li><li>Suggest one improvement if a key uses the choice “large / small” without measurements.</li></ol></div>
<div class="lesson-block"><h3>Assess — Exit ticket</h3><ol><li>What is the purpose of a dichotomous key?</li><li>What makes a good paired choice?</li><li>Write one suitable pair of contrasting statements for classifying animals.</li></ol></div>`,'Constructing a dichotomous key.');

y7BioLesson(5,'Constructing Dichotomous Keys','Develop a dichotomous key that classifies organisms using clear observable characteristics.','I can choose useful characteristics, write paired statements and test whether my key identifies each organism correctly.',`
<div class="lesson-block"><h3>Do Now</h3><ol><li>What is a dichotomous key?</li><li>How many alternatives are given at each step?</li><li>Name one characteristic suitable for separating animals into two groups.</li></ol></div>
<div class="lesson-block"><h3>Learn — Building a key</h3><p>To construct a key: <strong>1)</strong> observe all organisms, <strong>2)</strong> choose a characteristic that splits them into two clear groups, <strong>3)</strong> write paired contrasting statements, <strong>4)</strong> repeat with each remaining group, and <strong>5)</strong> test the key from the beginning for every organism.</p><p>Avoid vague choices such as “big/small” unless a measurement is given. Avoid choices that overlap.</p></div>
<div class="lesson-block"><h3>I Do — Four organisms</h3><p>For eagle, kangaroo, shark and lizard:</p><p>1a Has feathers → Eagle<br>1b Does not have feathers → 2<br>2a Has fur → Kangaroo<br>2b Does not have fur → 3<br>3a Has fins → Shark<br>3b Does not have fins → Lizard</p><p>Each pair uses one contrasting feature and every organism reaches one endpoint.</p></div>
<div class="lesson-block"><h3>We Do</h3><p>Create a class key for butterfly, spider, snail and earthworm. First list observable differences, then agree on the strongest first split. Test the completed key with all four organisms.</p></div>
<div class="lesson-block"><h3>You Do — Create your own key</h3><p>Construct a dichotomous key for: frog, fish, eagle, snake, spider and kangaroo.</p><ol><li>List useful observable characteristics.</li><li>Choose your first split.</li><li>Write paired statements for every step.</li><li>Ensure each organism has one final identity.</li><li>Test the key by tracing all six organisms.</li></ol></div>
<div class="lesson-block"><h3>Challenge</h3><p>Swap your key with another student. Identify any ambiguous choice or pathway that fails, then revise the key.</p></div>
<div class="lesson-block"><h3>Assess — Exit ticket</h3><ol><li>State three rules for a good dichotomous key.</li><li>Why must a key be tested?</li><li>Improve this pair: “1a animal is big / 1b animal is small”.</li></ol></div>`,'Feeding relationships — producers, consumers and decomposers.');
