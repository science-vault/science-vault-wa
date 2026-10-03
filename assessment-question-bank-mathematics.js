// Lower School Mathematics Years 7-10 authentic assessment bank.
// Original questions modelled on WA school assessment conventions and aligned to SCSA 2026 strands.
(function(){
const S='mathematics',Q=[];
const add=(y,id,t,sub,type,d,m,q,ans,e={})=>Q.push({id,subject:S,year:y,topic:t,subtopic:sub,type,difficulty:d,marks:m,question:q,answer:ans,...e});
const mc=(y,id,t,sub,q,opts,c,d='Easy')=>add(y,id,t,sub,'Multiple choice',d,1,q,`${'ABCD'[c]}. ${opts[c]} [1]`,{options:opts});
const sa=(y,id,t,sub,q,ans,m=3,d='Medium',e={})=>add(y,id,t,sub,'Short answer',d,m,q,ans,{response:'working',...e});
const ex=(y,id,t,sub,q,ans,m=6,e={})=>add(y,id,t,sub,'Extended response','Hard',m,q,ans,{responseLines:10,...e});
const N='Number and algebra',G='Measurement and geometry',P='Probability and statistics';

// YEAR 7
mc(7,'m7a01',N,'Understanding number','Which number is greatest?',['-12','-3','0','-1'],2);
mc(7,'m7a02',N,'Fractions, decimals and percentages','Which is equivalent to 3/5?',['0.35','0.5','0.6','0.8'],2);
mc(7,'m7a03',N,'Calculating with number','Evaluate 48 ÷ 6 × 3.',['8','18','24','144'],2);
mc(7,'m7a04',N,'Algebraic techniques','If x = 4, find 3x + 5.',['12','17','20','27'],1);
mc(7,'m7a05',N,'Financial mathematics','A $60 shirt is reduced by 20%. What is the discount?',['$12','$20','$40','$48'],0);
sa(7,'m7b01',N,'Integers','A lift starts on level 3, travels down 7 floors and then up 2 floors. On which level does it finish? Show your integer calculation.','3 - 7 + 2 = -2. Level -2. [3]',3);
sa(7,'m7b02',N,'Fractions','Calculate 2/3 + 1/6. Give your answer in simplest form.','4/6 + 1/6 = 5/6. [3]',3);
sa(7,'m7b03',N,'Ratios','Orange drink is mixed using 1 part concentrate to 4 parts water. How much water is required for 750 mL of concentrate?','750 × 4 = 3000 mL = 3 L. [3]',3);
sa(7,'m7b04',N,'Patterns and relationships','The sequence is 5, 9, 13, 17, ... State the next two terms and describe the rule.','21, 25 [2]; add 4 each time [1].',3);
mc(7,'m7c01',G,'Angles','Two angles on a straight line are 68° and x°. Find x.',['22°','68°','112°','292°'],2);
mc(7,'m7c02',G,'Area','What is the area of a parallelogram with base 9 cm and perpendicular height 4 cm?',['13 cm²','18 cm²','26 cm²','36 cm²'],3);
sa(7,'m7c03',G,'Perimeter and area','A rectangular garden is 12 m long and 7 m wide. Calculate its perimeter and area.','Perimeter = 2(12+7)=38 m [2]; area=12×7=84 m² [2].',4);
sa(7,'m7c04',G,'Scale','On a map, 1 cm represents 5 km. Two towns are 7.4 cm apart on the map. Calculate the actual distance.','7.4×5=37 km. [3]',3);
sa(7,'m7c05',G,'Coordinates','Plotting is not required: state the quadrant containing each point A(-3,4), B(5,-2), C(-1,-6).','A: II [1]; B: IV [1]; C: III [1].',3);
mc(7,'m7d01',P,'Probability','A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?',['1/6','1/3','1/2','2/3'],1);
sa(7,'m7d02',P,'Data displays','The scores are 6, 8, 8, 9, 11, 12. Find the median and range.','Median=(8+9)/2=8.5 [2]; range=12-6=6 [1].',3);
sa(7,'m7d03',P,'Experimental probability','A spinner lands on blue 18 times in 50 spins. Calculate the experimental probability of blue as a fraction and decimal.','18/50=9/25 [2]; 0.36 [1].',3);
ex(7,'m7e01',N,'Modelling with number','A school camp costs $185 per student. A family has already paid a $50 deposit and saves $15 each week. How many complete weeks are needed to save the remaining amount? Show all working and check your answer.','Remaining $135 [2]; 135÷15=9 weeks [2]; check 50+9×15=185 [2].',6);
ex(7,'m7e02',G,'Modelling with measurement','A classroom floor is 8.4 m by 6.5 m. Carpet costs $32 per square metre. Calculate the floor area and total carpet cost.','Area=54.6 m² [3]; cost=54.6×32=$1747.20 [3].',6);
ex(7,'m7e03',P,'Statistical investigation','A student wants to find the favourite sport of Year 7 students. Explain why asking only members of the school basketball team would be biased. Describe a better sampling method and a suitable graph for the results.','Bias explained [2]; representative/random or stratified Year 7 sample [2]; appropriate categorical display such as bar/column graph [1]; justification [1].',6);

// YEAR 8
mc(8,'m8a01',N,'Index notation','Simplify 2³ × 2².',['2⁵','4⁵','2⁶','4⁶'],0);
mc(8,'m8a02',N,'Percentages','Increase $240 by 15%.',['$255','$264','$276','$360'],2);
mc(8,'m8a03',N,'Algebraic techniques','Simplify 5x + 3 - 2x + 7.',['3x + 10','7x + 10','3x + 4','7x + 4'],0);
mc(8,'m8a04',N,'Linear equations','Solve 3x + 5 = 20.',['3','5','8','15'],1);
mc(8,'m8a05',N,'Rates','A car travels 180 km in 3 hours at constant speed. Its average speed is',['60 km/h','90 km/h','177 km/h','540 km/h'],0);
sa(8,'m8b01',N,'Fractions and percentages','A class has 32 students. 3/8 of the class travel to school by bus. How many students travel by bus?','32×3/8=12 students. [3]',3);
sa(8,'m8b02',N,'Linear equations','Solve 4x - 7 = 21 and verify your solution by substitution.','4x=28, x=7 [2]; check 4(7)-7=21 [1].',3);
sa(8,'m8b03',N,'Financial mathematics','A phone originally costs $680 and is discounted by 12%. Calculate the sale price.','$680×0.12=$81.60 discount [2]; sale price=$598.40 [2].',4);
sa(8,'m8b04',N,'Linear relationships','A taxi fare is modelled by C = 5 + 2.4d, where d is distance in km. Calculate the fare for 8 km.','C=5+2.4(8)=5+19.2=$24.20. [3]',3);
mc(8,'m8c01',G,'Pythagoras','A right triangle has shorter sides 6 cm and 8 cm. Its hypotenuse is',['10 cm','12 cm','14 cm','100 cm'],0);
mc(8,'m8c02',G,'Area','Find the area of a trapezium with parallel sides 6 cm and 10 cm and height 5 cm.',['25 cm²','40 cm²','50 cm²','80 cm²'],1);
sa(8,'m8c03',G,'Pythagoras','A ladder reaches 12 m up a wall. Its base is 5 m from the wall. Calculate the ladder length.','c²=12²+5²=169 [2]; c=13 m [2].',4);
sa(8,'m8c04',G,'Volume','Calculate the volume of a rectangular prism 8 cm × 5 cm × 3.5 cm.','V=8×5×3.5=140 cm³. [3]',3);
sa(8,'m8c05',G,'Transformations','Point P(2,-3) is reflected in the y-axis. Give the coordinates of its image and describe what changes.','P′(-2,-3) [2]; x-coordinate changes sign while y remains unchanged [1].',3);
mc(8,'m8d01',P,'Probability','Two fair coins are tossed. What is P(two heads)?',['1/2','1/3','1/4','3/4'],2);
sa(8,'m8d02',P,'Statistics','For 4, 7, 7, 8, 9, 13, calculate the mean and range.','Mean=48/6=8 [2]; range=13-4=9 [1].',3);
sa(8,'m8d03',P,'Sampling','Explain one advantage of a random sample compared with a convenience sample.','Random sampling reduces selection bias and is more likely to represent the population. [2]',2);
ex(8,'m8e01',N,'Modelling with algebra','A gym charges a $25 joining fee plus $12 per week. Write a rule for total cost C after w weeks. Calculate the cost after 10 weeks and determine how many weeks can be purchased for $205.','C=25+12w [2]; C(10)=$145 [2]; 25+12w=205, w=15 [2].',6);
ex(8,'m8e02',G,'Modelling with measurement','A rectangular water tank is 1.5 m long, 0.8 m wide and 0.6 m high. Calculate its volume in cubic metres and litres.','V=1.5×0.8×0.6=0.72 m³ [3]; 0.72×1000=720 L [3].',6);
ex(8,'m8e03',P,'Data interpretation','Two classes have the same mean test score of 68%. Class A has a range of 18 and Class B a range of 42. Explain what this tells you about the two distributions and why the mean alone is insufficient.','Same centre/mean [1]; B has greater spread/variation [2]; A is more consistent [1]; mean alone does not describe spread [2].',6);

// YEAR 9
mc(9,'m9a01',N,'Index laws','Simplify a⁷ ÷ a³.',['a²','a³','a⁴','a¹⁰'],2);
mc(9,'m9a02',N,'Algebraic expansion','Expand 3(x + 4).',['3x + 4','3x + 7','3x + 12','x + 12'],2);
mc(9,'m9a03',N,'Linear equations','Solve 5x - 8 = 2x + 13.',['5','7','9','21'],1);
mc(9,'m9a04',N,'Financial mathematics','$1500 earns simple interest at 4% p.a. for 3 years. The interest is',['$60','$120','$180','$1680'],2);
mc(9,'m9a05',N,'Linear relationships','The gradient between (2,3) and (6,11) is',['1/2','2','4','8'],1);
sa(9,'m9b01',N,'Algebraic techniques','Expand and simplify 4(2x - 3) - (x + 5).','8x-12-x-5=7x-17. [3]',3);
sa(9,'m9b02',N,'Linear equations','Solve 3(2x - 1)=21.','6x-3=21; 6x=24; x=4. [3]',3);
sa(9,'m9b03',N,'Coordinate geometry','Find the gradient of the line through (-2,5) and (4,-7).','m=(-7-5)/(4-(-2))=-12/6=-2. [3]',3);
sa(9,'m9b04',N,'Financial mathematics','Calculate the simple interest and final balance on $2400 invested at 3.5% p.a. for 4 years.','I=2400×0.035×4=$336 [3]; balance=$2736 [1].',4);
mc(9,'m9c01',G,'Pythagoras','A right triangle has hypotenuse 17 cm and one shorter side 8 cm. The other side is',['9 cm','15 cm','19 cm','225 cm'],1);
mc(9,'m9c02',G,'Coordinate geometry','The midpoint of (2,5) and (8,11) is',['(3,3)','(5,8)','(6,16)','(10,16)'],1);
sa(9,'m9c03',G,'Pythagoras','A rectangular screen is 48 cm wide and 36 cm high. Calculate its diagonal length.','d²=48²+36²=3600 [2]; d=60 cm [2].',4);
sa(9,'m9c04',G,'Surface area','A closed rectangular prism measures 10 cm × 6 cm × 4 cm. Calculate its total surface area.','SA=2(10×6+10×4+6×4)=2(124)=248 cm². [4]',4);
sa(9,'m9c05',G,'Coordinate geometry','Find the midpoint of A(-5,7) and B(9,-3).','((−5+9)/2,(7−3)/2)=(2,2). [3]',3);
mc(9,'m9d01',P,'Probability','If P(A)=0.35, then P(not A)=',['0.35','0.50','0.65','1.35'],2);
sa(9,'m9d02',P,'Two-way tables','In a group of 80 students, 46 play a sport, 32 play an instrument and 18 do both. How many do neither?','Sport or instrument=46+32-18=60 [2]; neither=80-60=20 [2].',4);
sa(9,'m9d03',P,'Statistics','A data set has Q1=12, median=18 and Q3=27. Calculate the interquartile range and explain what it represents.','IQR=27-12=15 [2]; spread of middle 50% of data [2].',4);
ex(9,'m9e01',N,'Modelling with linear relationships','Plan A costs $20 per month plus $0.10 per text. Plan B costs $35 per month with unlimited texts. Write a cost rule for each plan, determine when the plans cost the same, and state which is cheaper for 200 texts.','A=20+0.10t [1]; B=35 [1]; 20+0.10t=35 gives t=150 [2]; at 200 texts A=$40, B=$35 so B cheaper [2].',6);
ex(9,'m9e02',G,'Modelling with geometry','A 5 m ladder rests against a vertical wall with its base 1.4 m from the wall. Calculate how high it reaches. Then determine whether it reaches a window sill 4.8 m above the ground.','h²=25-1.96=23.04 [2]; h=4.8 m [2]; it reaches exactly the sill [2].',6);
ex(9,'m9e03',P,'Statistical reasoning','A website claims “9 out of 10 students prefer our app” after surveying 20 students who already subscribe to the app. Evaluate the claim and propose a more reliable investigation.','Biased sampling frame [2]; small/non-representative sample [1]; random/stratified sample from relevant student population [2]; larger sample/neutral question [1].',6);

// YEAR 10
mc(10,'m10a01',N,'Algebraic factorisation','Factorise x² + 7x + 12.',['(x+2)(x+6)','(x+3)(x+4)','(x-3)(x-4)','(x+1)(x+12)'],1);
mc(10,'m10a02',N,'Quadratic equations','Solve x² - 9 = 0.',['x=3 only','x=-3 only','x=±3','x=9'],2);
mc(10,'m10a03',N,'Indices','Simplify (x³)⁴.',['x⁷','x¹²','4x³','x⁸¹'],1);
mc(10,'m10a04',N,'Linear equations','Solve 2x + 5 > 17.',['x>6','x<6','x>11','x<11'],0);
mc(10,'m10a05',N,'Financial mathematics','$5000 increases by 6% in one year. Its new value is',['$5006','$5030','$5300','$8000'],2);
sa(10,'m10b01',N,'Quadratic expressions','Expand and simplify (x+5)(x-2).','x²-2x+5x-10=x²+3x-10. [3]',3);
sa(10,'m10b02',N,'Quadratic equations','Solve x² + x - 12 = 0 by factorisation.','(x+4)(x-3)=0 [2]; x=-4 or x=3 [2].',4);
sa(10,'m10b03',N,'Simultaneous equations','Solve x+y=11 and x-y=3.','Add equations: 2x=14, x=7 [2]; y=4 [2].',4);
sa(10,'m10b04',N,'Financial mathematics','An investment of $3200 grows by 5% per year. Calculate its value after 2 years.','3200×1.05²=$3528. [4]',4);
mc(10,'m10c01',G,'Trigonometry','In a right triangle, relative to angle θ, sin θ equals',['adjacent/hypotenuse','opposite/hypotenuse','opposite/adjacent','hypotenuse/opposite'],1);
mc(10,'m10c02',G,'Circle measurement','The circumference of a circle of radius 5 cm is',['5π cm','10π cm','25π cm','50π cm'],1);
sa(10,'m10c03',G,'Trigonometry','A right triangle has hypotenuse 12 cm and an angle of 35°. Calculate the side opposite the 35° angle to one decimal place.','opposite=12 sin35°≈6.9 cm. Method [2], answer [2].',4);
sa(10,'m10c04',G,'Trigonometry','From a point 30 m from the base of a building, the angle of elevation to the roof is 42°. Calculate the building height to one decimal place, ignoring eye height.','h=30 tan42°≈27.0 m. [4]',4);
sa(10,'m10c05',G,'Circle measurement','Calculate the area of a circle with diameter 14 cm. Give an exact answer in terms of π and an approximate decimal answer.','r=7 [1]; A=49π cm² [2]; ≈153.9 cm² [1].',4);
mc(10,'m10d01',P,'Probability','Events A and B are independent with P(A)=0.4 and P(B)=0.5. P(A and B)=',['0.2','0.4','0.5','0.9'],0);
sa(10,'m10d02',P,'Statistics','A data set has mean 72 and standard deviation 4. Another has mean 72 and standard deviation 11. Compare the distributions.','Same mean/centre [1]; second has much greater spread/variability [2]; first is more consistent [1].',4);
sa(10,'m10d03',P,'Probability','A bag contains 5 red and 3 blue counters. Two counters are selected without replacement. Calculate P(red then blue).','5/8 × 3/7 =15/56. [4]',4);
ex(10,'m10e01',N,'Modelling with quadratics','The height of a ball is modelled by h=-5t²+20t+1, where h is metres and t is seconds. Calculate its height at t=2, determine when it reaches maximum height using the axis of symmetry, and find that maximum height.','h(2)=21 m [2]; t=-b/(2a)=-20/(-10)=2 s [2]; maximum=21 m [2].',6);
ex(10,'m10e02',G,'Modelling with trigonometry','A surveyor stands 45 m from a tower. The angle of elevation to the top is 38°. The surveyor’s eye height is 1.6 m. Calculate the tower height to one decimal place.','Height above eye=45 tan38°≈35.2 m [3]; add 1.6 m ≈36.8 m [2]; units/rounding [1].',6);
ex(10,'m10e03',P,'Statistical investigation','Two websites report different average house prices for the same suburb. Explain at least three reasons their figures could differ and identify information you would need before deciding which statistic is more useful.','Relevant points: different time periods, samples, property types, mean vs median, outliers, sample size, inclusion criteria [up to 4]; identifies needed metadata and justifies comparison [2].',6);

window.AssessmentQuestionBank=(window.AssessmentQuestionBank||[]).concat(Q);
})();