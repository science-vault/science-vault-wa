/* Learning Vault WA LMS Topic Lesson Bank.
   Lessons are authored as complete web lessons aligned to the current WA curriculum.
   Repository PowerPoints and worksheets can be attached later as optional supporting resources.
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
   WA Curriculum 2026 alignment: classification helps order and organise the diversity of life
   into a hierarchy from kingdom to species; classification tools including dichotomous keys
   can be developed and used to classify organisms.
*/
window.registerTopicLesson({
  year:7,
  course:'Science',
  unit:'Biological Sciences',
  topic:'Classification and feeding relationships',
  lesson:1,
  lessonTitle:'Lesson 1 — Why Do Scientists Classify Living Things?',
  curriculum:'Western Australian Curriculum: Science 2026',
  repositorySources:[]
}, `
<div class="lesson-block">
  <p><strong>Lesson 1 of 10 · Year 7 Biological Sciences</strong></p>
  <h3>Why do scientists classify living things?</h3>
  <p><strong>Learning intention:</strong> Understand why scientists classify organisms and how observable characteristics can be used to organise living things into useful groups.</p>
  <p><strong>Success criteria:</strong> By the end of this lesson, you can define classification, explain why classification is useful, identify observable characteristics and group organisms using shared features.</p>
</div>

<div class="lesson-block">
  <h3>Do Now — How do we organise things?</h3>
  <ol>
    <li>Name two ways books could be organised in a library.</li>
    <li>How might a supermarket group the products it sells?</li>
    <li>Why is grouping useful when there are thousands of different items?</li>
  </ol>
  <p><strong>Think:</strong> Scientists face a similar problem with living things. Earth contains an enormous diversity of organisms, so scientists need a consistent system for organising them.</p>
</div>

<div class="lesson-block">
  <h3>Learn 1 — What is classification?</h3>
  <p><strong>Classification</strong> is the process of arranging organisms into orderly groups using shared characteristics.</p>
  <p>Classification helps scientists to:</p>
  <ul>
    <li>order and organise the diversity of life</li>
    <li>identify organisms</li>
    <li>compare similarities and differences</li>
    <li>communicate clearly about organisms</li>
    <li>find information about organisms more efficiently.</li>
  </ul>
</div>

<div class="lesson-block">
  <h3>Learn 2 — Observable characteristics</h3>
  <p>An <strong>observable characteristic</strong> is a feature that can be observed in a living organism, preserved specimen, photograph or drawing.</p>
  <p>Useful characteristics may include body covering, presence or absence of a backbone, number of limbs, feathers, scales, hair or fur, wings, fins and other reliable features.</p>
  <p><strong>Important:</strong> Scientists do not classify an organism simply because it lives in a particular habitat. They compare characteristics and look for patterns of similarities and differences.</p>
</div>

<div class="lesson-block">
  <h3>Key vocabulary</h3>
  <ul>
    <li><strong>organism</strong> — an individual living thing</li>
    <li><strong>classification</strong> — arranging organisms into orderly groups</li>
    <li><strong>characteristic</strong> — a feature or property of an organism</li>
    <li><strong>observable characteristic</strong> — a feature that can be observed and compared</li>
    <li><strong>biodiversity</strong> — the variety of living things</li>
  </ul>
</div>

<div class="lesson-block">
  <h3>I Do — Worked example</h3>
  <p>A scientist observes three animals:</p>
  <ul>
    <li><strong>Animal A:</strong> feathers, wings and a beak</li>
    <li><strong>Animal B:</strong> hair or fur and produces milk</li>
    <li><strong>Animal C:</strong> scales, fins and gills</li>
  </ul>
  <p><strong>Step 1:</strong> Record observable characteristics.</p>
  <p><strong>Step 2:</strong> Compare similarities and differences.</p>
  <p><strong>Step 3:</strong> Group organisms that share important characteristics.</p>
  <p>Animal A can be grouped with birds, Animal B with mammals and Animal C with fish. The decision is based on shared characteristics rather than simply where each animal lives.</p>
</div>

<div class="lesson-block">
  <h3>Quick Check</h3>
  <ol>
    <li>What does classification mean?</li>
    <li>Give one reason classification is useful.</li>
    <li>Which is more useful for classifying an animal: its colour today or whether it has feathers? Explain.</li>
  </ol>
</div>

<div class="lesson-block">
  <h3>We Do — Sort the organisms</h3>
  <p>Consider a frog, spider, eagle, lizard, kangaroo and fish.</p>
  <ol>
    <li>Choose one observable characteristic that divides the six organisms into two groups.</li>
    <li>Name the organisms in each group.</li>
    <li>Choose another characteristic that divides one of your groups again.</li>
    <li>Explain why your chosen characteristics are useful.</li>
  </ol>
  <p><strong>Possible starting question:</strong> Does the organism have a backbone?</p>
  <p>Repeatedly separating organisms using observable characteristics is an idea we will develop later when we learn about <strong>dichotomous keys</strong>.</p>
</div>

<div class="lesson-block">
  <h3>You Do — Independent practice</h3>
  <ol>
    <li>Define <strong>classification</strong> in your own words.</li>
    <li>Give two reasons scientists classify organisms.</li>
    <li>List three observable characteristics that could be used to classify an animal.</li>
    <li>A whale and a shark both live in the ocean. Explain why habitat alone is not enough to place them in the same biological group.</li>
    <li>A newly observed animal has a backbone, feathers and wings. What broad group would you place it in? Give evidence for your decision.</li>
    <li>Why is a consistent classification system useful when scientists in different countries study the same organisms?</li>
  </ol>
</div>

<div class="lesson-block">
  <h3>Challenge</h3>
  <p>Create your own classification system for these six imaginary organisms: one with feathers and two legs, one with scales and four legs, one with fur and four legs, one with scales and no legs, one with feathers and wings, and one with fur and two legs. Show at least two levels of grouping and explain the characteristics you used.</p>
</div>

<div class="lesson-block">
  <h3>Common misconception</h3>
  <p><strong>Misconception:</strong> Organisms that live in the same place must belong to the same classification group.</p>
  <p><strong>Correction:</strong> Habitat may provide information about an organism, but biological classification depends on shared characteristics. A dolphin and a shark both live in the ocean, yet they have important biological differences and belong to different groups.</p>
</div>

<div class="lesson-block">
  <h3>Assess — Exit ticket</h3>
  <p>Complete these without notes:</p>
  <ol>
    <li>What is classification?</li>
    <li>State two reasons scientists classify living things.</li>
    <li>Name one observable characteristic that could help classify an unknown organism.</li>
    <li>Explain why scientists should use several characteristics rather than habitat alone.</li>
  </ol>
  <p><strong>Next lesson:</strong> Classification hierarchy — from kingdom to species.</p>
</div>

<div class="lesson-block">
  <h3>Teacher resource area</h3>
  <p>This is a complete Topic Hub web lesson. Supporting PowerPoints, worksheets, videos and other repository resources can be attached here later without changing the lesson sequence.</p>
</div>
`);
