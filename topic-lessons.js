/* Learning Vault WA LMS Topic Lesson Bank.
   Lessons are intentionally authored from repository teaching/curriculum material.
   Do not add generic fallback lesson content here.
   Key: YEAR|COURSE|UNIT_OR_STRAND|TOPIC
*/
window.TopicLessons = window.TopicLessons || {};
window.registerTopicLesson = function(meta, html){
  if(!meta || !html) return;
  const key=[meta.year,meta.course,meta.unit,meta.topic].join('|');
  window.TopicLessons[key]={...meta,html};
};

/* Year 7 Science — Biological Sciences
   Lesson 1 of 10: Need for Classification
   WA Curriculum 2026 alignment: classification orders and organises diversity of life;
   later lessons develop the kingdom-to-species hierarchy and dichotomous keys.
   Repository-grounded from Year 7 Biological Sciences resources, especially:
   - PPT-(EP) Introduction to Classification.pptx
   - 16 Classification of Living Things.pptx
   - 1 Characteristics of Living Things.pptx (prior-knowledge support)
*/
window.registerTopicLesson({
  year:7,
  course:'Science',
  unit:'Biological Sciences',
  topic:'Classification and feeding relationships',
  lesson:1,
  lessonTitle:'Lesson 1 — Why Do Scientists Classify Living Things?',
  curriculum:'WA Science 2026',
  repositorySources:[
    'resources/Year 7/Biological Sciences/PowerPoints/PPT-(EP) Introduction to Classification.pptx',
    'resources/Year 7/Biological Sciences/PowerPoints/16 Classification of Living Things.pptx',
    'resources/Year 7/Biological Sciences/PowerPoints/1 Characteristics of Living Things.pptx'
  ]
}, `
<div class="lesson-block">
  <p><strong>Lesson 1 of 10 · Year 7 Biological Sciences</strong></p>
  <h3>Why do scientists classify living things?</h3>
  <p><strong>Learning intention:</strong> Understand why scientists classify organisms and how observable characteristics can be used to organise living things into useful groups.</p>
  <p><strong>Success criteria:</strong> By the end of this lesson, you can define classification, explain two reasons scientists classify organisms, identify useful observable characteristics and group organisms using shared features.</p>
</div>

<div class="lesson-block">
  <h3>Do Now — How do we organise things?</h3>
  <ol>
    <li>Name two ways books could be organised in a library.</li>
    <li>How might a supermarket group the products it sells?</li>
    <li>Why is grouping useful when there are thousands of different items?</li>
  </ol>
  <p><strong>Think:</strong> Scientists face the same problem with living things. Earth contains an enormous diversity of organisms, so scientists need a consistent system for organising them.</p>
</div>

<div class="lesson-block">
  <h3>Learn — What is classification?</h3>
  <p><strong>Classification</strong> is the process of arranging organisms into groups using shared characteristics. A useful classification system helps scientists organise biodiversity, identify organisms, compare them and communicate clearly about them.</p>
  <p>Scientists begin by observing characteristics. These may include body covering, presence of a backbone, number or type of limbs, feathers, scales, hair or fur, and other features that can be observed reliably.</p>
  <p><strong>Important:</strong> One feature alone may not be enough. Scientists compare several characteristics and look for patterns of similarities and differences.</p>
</div>

<div class="lesson-block">
  <h3>Key vocabulary</h3>
  <ul>
    <li><strong>organism</strong> — an individual living thing</li>
    <li><strong>classification</strong> — arranging organisms into groups using shared characteristics</li>
    <li><strong>characteristic</strong> — a feature or property of an organism</li>
    <li><strong>observable characteristic</strong> — a feature that can be observed and used to compare organisms</li>
    <li><strong>biodiversity</strong> — the variety of living things</li>
  </ul>
</div>

<div class="lesson-block">
  <h3>Worked example</h3>
  <p>A scientist observes three animals:</p>
  <ul>
    <li><strong>Animal A:</strong> feathers, wings and a beak</li>
    <li><strong>Animal B:</strong> hair or fur and produces milk</li>
    <li><strong>Animal C:</strong> scales, fins and gills</li>
  </ul>
  <p><strong>Step 1:</strong> Record observable characteristics.</p>
  <p><strong>Step 2:</strong> Compare the characteristics with known groups.</p>
  <p><strong>Step 3:</strong> Group organisms that share important features.</p>
  <p>Animal A can be grouped with birds, Animal B with mammals and Animal C with fish. The decision is based on shared characteristics, not simply where the animal lives.</p>
</div>

<div class="lesson-block">
  <h3>We Do — Group the organisms</h3>
  <p>Imagine you have a frog, spider, eagle, lizard, kangaroo and fish. With a partner, choose one observable characteristic that divides the six organisms into two groups. Then choose another characteristic that could divide one of your groups again.</p>
  <p><strong>Example first question:</strong> Does the organism have a backbone?</p>
  <p>This idea of repeatedly separating organisms using observable features will lead to <strong>dichotomous keys</strong> later in this strand.</p>
</div>

<div class="lesson-block">
  <h3>You Do — Check your understanding</h3>
  <ol>
    <li>Define <strong>classification</strong> in your own words.</li>
    <li>Give two reasons scientists classify organisms.</li>
    <li>List three observable characteristics that could be used to classify an animal.</li>
    <li>A whale lives in water and a shark lives in water. Explain why habitat alone is not enough to place them in the same biological group.</li>
    <li>A newly observed animal has a backbone, feathers and wings. What group would you place it in? Give evidence for your decision.</li>
  </ol>
</div>

<div class="lesson-block">
  <h3>Common misconception</h3>
  <p><strong>Misconception:</strong> Organisms that live in the same place must belong to the same classification group.</p>
  <p><strong>Correction:</strong> Habitat can provide useful information, but classification is based on shared biological characteristics. A dolphin and a shark both live in the ocean, but they have different characteristics and belong to different groups.</p>
</div>

<div class="lesson-block">
  <h3>Exit ticket</h3>
  <p>Complete these without notes:</p>
  <ol>
    <li>What is classification?</li>
    <li>Why is classification useful to scientists?</li>
    <li>Name one observable characteristic that could help classify an unknown organism.</li>
  </ol>
  <p><strong>Next lesson:</strong> We begin organising living things into a hierarchy and explore how broad groups become increasingly specific.</p>
</div>

<div class="lesson-block">
  <h3>Repository resources used to build this lesson</h3>
  <p>This web lesson is authored from the Science Vault WA repository sequence and the 2026 WA curriculum. The PowerPoints are supporting teacher resources rather than embedded lesson substitutes.</p>
  <p><a class="btn dark" href="resources/Year%207/Biological%20Sciences/PowerPoints/PPT-(EP)%20Introduction%20to%20Classification.pptx">Introduction to Classification</a> <a class="btn dark" href="resources/Year%207/Biological%20Sciences/PowerPoints/16%20Classification%20of%20Living%20Things.pptx">Classification of Living Things</a></p>
</div>
`);
