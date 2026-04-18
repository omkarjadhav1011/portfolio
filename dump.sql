CREATE TABLE IF NOT EXISTS "SkillBranch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "branchName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "offset" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO SkillBranch VALUES('cmnmj44lp000a1mb926szmffy','feature/web','#58a6ff',0,1775439965006,1776497545448);
INSERT INTO SkillBranch VALUES('cmnmj44n9000n1mb9mjm18bqc','feature/backend','#00ff88',1,1775439965061,1776497545497);
INSERT INTO SkillBranch VALUES('cmnmj44op00101mb9piilt1dv','feature/ml','#f0883e',2,1775439965114,1776497545538);
INSERT INTO SkillBranch VALUES('cmnmj44po001b1mb98nq7y3id','feature/tools','#d2a8ff',3,1775439965149,1776497545574);
CREATE TABLE IF NOT EXISTS "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "tag" TEXT,
    "icon" TEXT,
    "branchId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Skill_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "SkillBranch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Skill VALUES('cmnmj44ly000c1mb99faa7mhd','HTML/CSS',5,NULL,'🌐','cmnmj44lp000a1mb926szmffy',1775439965014,1776497545454);
INSERT INTO Skill VALUES('cmnmj44m6000e1mb91ckf1ll9','JavaScript',4,NULL,'JS','cmnmj44lp000a1mb926szmffy',1775439965022,1776497545460);
INSERT INTO Skill VALUES('cmnmj44md000g1mb9rgibkeb0','PHP',4,'v8','🐘','cmnmj44lp000a1mb926szmffy',1775439965029,1776497545468);
INSERT INTO Skill VALUES('cmnmj44mj000i1mb9va0sepe1','React',3,NULL,'⚛','cmnmj44lp000a1mb926szmffy',1775439965036,1776497545477);
INSERT INTO Skill VALUES('cmnmj44mr000k1mb9hrx8nqx4','Next.js',3,'v14','▲','cmnmj44lp000a1mb926szmffy',1775439965044,1776497545486);
INSERT INTO Skill VALUES('cmnmj44ng000p1mb9l3ypv3lb','Python',4,NULL,'🐍','cmnmj44n9000n1mb9mjm18bqc',1775439965068,1776497545502);
INSERT INTO Skill VALUES('cmnmj44no000r1mb9etb64oj6','Java',3,NULL,'☕','cmnmj44n9000n1mb9mjm18bqc',1775439965076,1776497545510);
INSERT INTO Skill VALUES('cmnmj44nw000t1mb9aqbp07sw','C++',3,NULL,'⚙','cmnmj44n9000n1mb9mjm18bqc',1775439965084,1776497545515);
INSERT INTO Skill VALUES('cmnmj44o3000v1mb9mt3soi0k','MySQL',4,NULL,'🗄','cmnmj44n9000n1mb9mjm18bqc',1775439965091,1776497545520);
INSERT INTO Skill VALUES('cmnmj44ob000x1mb96k7gyv79','PostgreSQL',3,NULL,'🐘','cmnmj44n9000n1mb9mjm18bqc',1775439965099,1776497545526);
INSERT INTO Skill VALUES('cmnmj44oj000z1mb9zjfph1w2','MongoDB',3,NULL,'🍃','cmnmj44n9000n1mb9mjm18bqc',1775439965107,1776497545533);
INSERT INTO Skill VALUES('cmnmj44ow00121mb998eyx00j','NumPy',4,NULL,'🔢','cmnmj44op00101mb9piilt1dv',1775439965120,1776497545542);
INSERT INTO Skill VALUES('cmnmj44p100141mb9pqdhpjws','Pandas',4,NULL,'🐼','cmnmj44op00101mb9piilt1dv',1775439965125,1776497545548);
INSERT INTO Skill VALUES('cmnmj44p600161mb9w0pw2vm4','Scikit-learn',3,NULL,'🧠','cmnmj44op00101mb9piilt1dv',1775439965131,1776497545555);
INSERT INTO Skill VALUES('cmnmj44pe00181mb9xuq4j9fi','Streamlit',3,NULL,'📊','cmnmj44op00101mb9piilt1dv',1775439965138,1776497545562);
INSERT INTO Skill VALUES('cmnmj44pi001a1mb9wfq5cqr4','Jupyter Notebook',3,NULL,'📓','cmnmj44op00101mb9piilt1dv',1775439965143,1775483840416);
INSERT INTO Skill VALUES('cmnmj44pt001d1mb9rvsi5roc','Git',5,'v2.45','⑂','cmnmj44po001b1mb98nq7y3id',1775439965154,1776497545580);
INSERT INTO Skill VALUES('cmnmj44pz001f1mb9qblxxp0l','GitHub',4,NULL,'🐙','cmnmj44po001b1mb98nq7y3id',1775439965159,1776497545590);
INSERT INTO Skill VALUES('cmnmj44q4001h1mb9k9cc9oct','VS Code',5,NULL,'💻','cmnmj44po001b1mb98nq7y3id',1775439965165,1776497545595);
INSERT INTO Skill VALUES('cmnmj44qa001j1mb95y0uj8tu','Postman',4,NULL,'📮','cmnmj44po001b1mb98nq7y3id',1775439965170,1776497545602);
INSERT INTO Skill VALUES('cmnmpxwsh00035lisbsr27z6n','Claude Code',4,NULL,'✴️','cmnmj44po001b1mb98nq7y3id',1775451432257,1775483874727);
INSERT INTO Skill VALUES('cmnn9ejoz0002syr41ps4wzgn','Docker',3,NULL,'🐋','cmnmj44po001b1mb98nq7y3id',1775484121130,1775484121130);
INSERT INTO Skill VALUES('cmnn9gmi60004syr4bg8e2blu','SpringBoot',3,NULL,'🛠️','cmnmj44n9000n1mb9mjm18bqc',1775484218095,1775484218095);
INSERT INTO Skill VALUES('cmo40b3nw000m13dtptekfh9h','Tailwind CSS',3,NULL,'🎨','cmnmj44lp000a1mb926szmffy',1776496768844,1776497545493);
INSERT INTO Skill VALUES('cmo40b3rb001a13dtud93bujr','Jupyter',4,NULL,'📓','cmnmj44op00101mb9piilt1dv',1776496768967,1776497545567);
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "currentBranch" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "availableForWork" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "socials" TEXT NOT NULL,
    "funFacts" TEXT NOT NULL,
    "stash" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Profile VALUES('main','Omkar Jadhav','omkarjadhav','B.Tech CSE (Data Science) Student & Full-Stack Developer',replace('I build things for the web and explore the intersection of software and data.\nCurrently pursuing B.Tech in Computer Science (Data Science) at KIT Kolhapur,\nobsessed with clean code, great UX, and systems that scale.\n\nWhen I''m not writing code, I''m experimenting with machine learning models,\nbuilding full-stack apps, or debugging something I broke at 2am.','\n',char(10)),'main','Open to internships & collaborations',1,'jadhavomkar101103@gmail.com','Kolhapur, Maharashtra, India','[{"label":"GitHub","url":"https://github.com/omkarjadhav","icon":"github"},{"label":"LinkedIn","url":"https://linkedin.com/in/omkarjadhav","icon":"linkedin"},{"label":"Twitter","url":"https://twitter.com/omkarjadhav","icon":"twitter"}]','["I''ve written more git commit messages than diary entries","Went from 94% in SSC to building ML models — the plot thickens","I debug in production (just kidding... mostly)","My Hugging Face API calls cost more than my monthly coffee budget"]','["☕  Coffee-driven development — 3 cups before 10am","♟  Plays chess to debug decision-making","📚  Reading: Designing Data-Intensive Applications (DDIA)","🎵  Codes to lo-fi beats and post-rock","🌱  Contributing to open source, one PR at a time"]',1776497545325);
CREATE TABLE IF NOT EXISTS "SkillDiff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO SkillDiff VALUES('cmo0deefo000114a1nnia2ajh','HTML/CSS','added','basic UI structuring and styling',15,1776276893076,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0dgbog000314a1wpmbgtj6','Java','modified','strong focus on backend development',13,1776276982817,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0er3rz0000r8tfvt1a7n0y','C language','deprecated','used for understanding programming fundamentals',16,1776279165405,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vb0jd00005t00aan5nbuv','PHP','deprecated','worked with server-side scripting and basic web apps',11,1776306968184,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vd8v900015t00x0fmas9n','MySQL','added','relational database',12,1776307072293,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0veelo00025t00zwxw3fyu','Git/Github','added','version control and collaboration',9,1776307126381,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vfp4v00035t00jko7c6w8','Data Structures & Algorithms ','modified','problem solving for interviews',10,1776307186688,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vj33900045t00dz8diyza','Python','modified','leveling up: async + FastAPI',7,1776307344742,1776497545629);
INSERT INTO SkillDiff VALUES('cmo0vjr6100055t00r7yfqus7','Flask','added','lightweight APIs and small backend services',8,1776307375946,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vktwu00065t003r98g1jv','Machine Learning Basics','deprecated','understanding core ML concepts',6,1776307426158,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vltdi00075t009jue9f7l','Spring Boot','added','building scalable REST APIs',5,1776307472119,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vmhw500085t005wasb6ms','Hibernate / JPA ','added','ORM and database interaction',4,1776307503893,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vn5su00095t00hb6y9j3i','PostgreSQL ','added','elational database for production apps',14,1776307534877,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vnmv7000a5t00kxgjlylz','React','modified','deepening patterns & performance',3,1776307556996,1776497545633);
INSERT INTO SkillDiff VALUES('cmo0vo13y000b5t00eczfc1tp','Docker ','added','learning containerization',2,1776307575454,1776363159390);
INSERT INTO SkillDiff VALUES('cmo0vos9w000c5t00p05mwwht','ASP.NET ','added','explored backend development in .NET ecosystem',1,1776307610661,1776363159390);
INSERT INTO SkillDiff VALUES('cmo40b3si001k13dtaov9coo2','TypeScript','added','migrating all JS projects',0,1776496769010,1776497545608);
INSERT INTO SkillDiff VALUES('cmo40b3sp001l13dtr466s9cu','Next.js 14 App Router','added','used in this portfolio',0,1776496769018,1776497545613);
INSERT INTO SkillDiff VALUES('cmo40b3sv001m13dtuv7hinhk','Docker','added','learning containerization',0,1776496769024,1776497545620);
INSERT INTO SkillDiff VALUES('cmo40b3t1001n13dty4zqing7','PostgreSQL','added','replacing MySQL in new projects',0,1776496769029,1776497545626);
INSERT INTO SkillDiff VALUES('cmo40b3tm001q13dtgsrfpssv','jQuery','deprecated','replaced by React',0,1776496769051,1776497545641);
INSERT INTO SkillDiff VALUES('cmo40b3tu001r13dtp9imfra7','Bootstrap','deprecated','replaced by Tailwind CSS',0,1776496769059,1776497545650);
CREATE TABLE IF NOT EXISTS "CommitEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dateEnd" TEXT,
    "description" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "branchColor" TEXT NOT NULL,
    "colorKey" TEXT,
    "tags" TEXT,
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO CommitEntry VALUES('cmnmj44kk00041mb93eh4zjai','f3a9b1c','job','Web Developer Intern','Dnyanda Solutions Pvt. Ltd.','Jul 2022','Sep 2022','["Developed backend systems using PHP for client e-commerce applications","Built a complete E-commerce platform with user authentication, cart, and payment flow","Collaborated on HTML/CSS frontend for responsive shopping interfaces","Worked with MySQL for product catalogue and order management"]','work/dnyanda-solutions','#00ff88','green','["PHP","HTML","CSS","JavaScript","MySQL"]',NULL,4,1775439964964,1776497545399);
INSERT INTO CommitEntry VALUES('cmnmj44kq00051mb97y888517','a2d8e4f','achievement','Python Bootcamp Certification','Udemy','Jan 2023',NULL,'["Completed comprehensive Python programming bootcamp","Covered OOP, file handling, data structures, and web scraping"]','cert/python-bootcamp','#e3b341','yellow','["Python","Udemy","Certification"]',NULL,5,1775439964970,1776497545411);
INSERT INTO CommitEntry VALUES('cmnmj44kx00061mb9s3lxb005','b5c7f2a','achievement','Java Programming Certification','Udemy','Mar 2023',NULL,'["Completed Java programming course covering core Java and OOP principles","Built multiple project applications including a library management system"]','cert/java-programming','#e3b341','yellow','["Java","OOP","Udemy","Certification"]',NULL,3,1775439964978,1776497545421);
INSERT INTO CommitEntry VALUES('cmnmj44l300071mb97v02esg3','0d3f9e1','education','B.Tech Computer Science & Engineering (Data Science)','KIT College of Engineering, Kolhapur','Aug 2023','May 2026','["SGPA: 8.0/10 — Pursuing specialization in Data Science","Relevant coursework: DSA, OS, DBMS, Computer Networks, Machine Learning","Building projects in ML, full-stack web development, and systems programming"]','edu/btech-cse','#58a6ff','blue','["DSA","OS","DBMS","Machine Learning","Data Science"]',NULL,2,1775439964983,1776497545428);
INSERT INTO CommitEntry VALUES('cmnmj44la00081mb9jm8s7ike','1e2b4c7','education','Diploma in Computer Engineering','ICRE Gargoti','Jun 2020','May 2023','["Graduated with 87% — Top performer in department","Core subjects: C, C++, Java, DBMS, Digital Electronics, Networking"]','edu/diploma-cse','#58a6ff','blue','["C++","Java","Networking","DBMS"]',NULL,6,1775439964990,1776497545434);
INSERT INTO CommitEntry VALUES('cmnmj44lh00091mb9tdrzfrqi','2c3d5e8','education','SSC (Class X)','Dindewadi High School','Mar 2020',NULL,'["Scored 94% — School topper in Mathematics and Science"]','edu/high-school','#58a6ff','blue','["Mathematics","Science"]',NULL,7,1775439964997,1776497545439);
INSERT INTO CommitEntry VALUES('cmnn37re80000syr4zrrpbb1x','st31kr7','job','Software Enginerring Intern','NonstopIO','Feb 2026','Aug 2026','["Work as SDE Intern for 6 Months.","Worked on real world projects."]','work/nonstopio','#00ff88','green','["internship"]',NULL,1,1775473726829,1776492523217);
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "languageColor" TEXT NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "commits" INTEGER NOT NULL DEFAULT 0,
    "lastCommit" TEXT NOT NULL,
    "lastCommitMsg" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "longDescription" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Project VALUES('cmnmj44jp00001mb916reqt3d','git-portfolio','git-portfolio','A developer portfolio with Git-inspired UI — terminals, branches, and commit logs.','TypeScript','#3178c6',12,3,47,'just now','feat: add command palette with Ctrl+K shortcut','["Next.js","Tailwind","Framer Motion"]','https://omkarjadhav.vercel.app','https://github.com/omkarjadhav/git-portfolio','active',1,'Built with Next.js 14, this portfolio reimagines personal websites through the lens of Git — commit timelines, branch visualizations, and a fully interactive terminal command palette.',4,1775439964933,1776497545358);
INSERT INTO Project VALUES('cmnmj44jw00011mb940jr3qdt','dev-mobiles','dev-mobiles','Mobile shopping e-commerce platform with full auth, cart, search, and purchase flow.','PHP','#4F5D95',8,2,84,'2 months ago','feat: add purchase flow with payment integration','["PHP","HTML","CSS","JavaScript","MySQL"]',NULL,'https://github.com/omkarjadhav/dev-mobiles','active',1,'A full-featured mobile shopping platform built during my internship at Dnyanda Solutions. Supports user login, product search, cart management, and a complete purchase flow with payment integration.',1,1775439964941,1776497545367);
INSERT INTO Project VALUES('cmnmj44k600021mb9yow3jb75','crop-recommendation','crop-recommendation','ML-based crop suggestion system using soil and weather data with a real-time farmer UI.','Python','#3572A5',19,5,62,'3 months ago','feat: integrate real-time weather API for dynamic predictions','["Python","Scikit-learn","Pandas","NumPy"]',NULL,'https://github.com/omkarjadhav/crop-recommendation','active',1,'A machine learning system that recommends optimal crops based on soil composition and real-time weather conditions. Built with Scikit-learn classification models and a clean farmer-friendly UI.',3,1775439964950,1776497545378);
INSERT INTO Project VALUES('cmnmj44kd00031mb92up4fqge','snapsktch','snapsktch','AI-powered text-to-image generator using Hugging Face API and Streamlit.','Python','#3572A5',14,3,38,'4 months ago','chore: update model endpoint to stable-diffusion-xl','["Python","Streamlit","Hugging Face","AI"]',NULL,'https://github.com/omkarjadhav/snapsktch','active',1,'A text-to-image generation app powered by Hugging Face''s diffusion models. Users describe an image in text, and SnapSktch renders it in seconds via Streamlit''s interactive UI.',2,1775439964958,1776497545389);
CREATE UNIQUE INDEX "SkillBranch_branchName_key" ON "SkillBranch"("branchName");
CREATE UNIQUE INDEX "Skill_branchId_name_key" ON "Skill"("branchId", "name");
CREATE UNIQUE INDEX "SkillDiff_name_key" ON "SkillDiff"("name");
CREATE UNIQUE INDEX "CommitEntry_hash_key" ON "CommitEntry"("hash");
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
