USE alpine

-- DROP TABLE IF EXISTS review;
-- DROP TABLE IF EXISTS shipment;
-- DROP TABLE IF EXISTS productinventory;
-- DROP TABLE IF EXISTS warehouse;
-- DROP TABLE IF EXISTS orderproduct;
-- DROP TABLE IF EXISTS incart;
-- DROP TABLE IF EXISTS product;
-- DROP TABLE IF EXISTS category;
-- DROP TABLE IF EXISTS ordersummary;
-- DROP TABLE IF EXISTS paymentmethod;
-- DROP TABLE IF EXISTS customer;


CREATE TABLE IF NOT EXISTS customer (
    customerId          INT PRIMARY KEY AUTO_INCREMENT,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS paymentmethod (
    paymentMethodId     INT PRIMARY KEY AUTO_INCREMENT,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS ordersummary (
    orderId             INT PRIMARY KEY AUTO_INCREMENT,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS category (
    categoryId          INT PRIMARY KEY AUTO_INCREMENT,
    categoryName        VARCHAR(50)  
);

CREATE TABLE IF NOT EXISTS product (
    productId           INT PRIMARY KEY AUTO_INCREMENT,
    productName         VARCHAR(40),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(100),
    productImage        BLOB,
    productDesc         VARCHAR(1000),
    categoryId          INT,
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE IF NOT EXISTS orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS warehouse (
    warehouseId         INT PRIMARY KEY AUTO_INCREMENT,
    warehouseName       VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS shipment (
    shipmentId          INT PRIMARY KEY AUTO_INCREMENT,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS review (
    reviewId            INT PRIMARY KEY AUTO_INCREMENT,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO category(categoryName) VALUES ('Skis');
INSERT INTO category(categoryName) VALUES ('Snowboards');
-- INSERT INTO category(categoryName) VALUES ('Dairy Products');
-- INSERT INTO category(categoryName) VALUES ('Produce');
-- INSERT INTO category(categoryName) VALUES ('Meat/Poultry');
-- INSERT INTO category(categoryName) VALUES ('Seafood');
-- INSERT INTO category(categoryName) VALUES ('Confections');
-- INSERT INTO category(categoryName) VALUES ('Grains/Cereals');


INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Kendo 88 Skis 2023', 1, '
Just like sending a Rottweiler to obedience school and your dog coming back with a veneer of civility until he really needs to use his teeth, the storied Völkl Kendo 88 Skis get an update that makes them a tad more forgiving at slower speeds without losing any of their grit when the chips are down. That means better slow and mid speed performance, less hookiness at the tip, and still with the tenacious edge grip you expect when you lay the ski over. Völkl gets it done with the addition of Tailored Technology - the Titanal laminate has been sculpted - and Tailored Carbon Tips, and you''re the beneficiary.
', 437, 'https://images.evo.com/imgp/700/227083/915715/volkl-kendo-88-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Revolt 81 Skis 2023', 1, '
Just getting into park riding, but still need a quality ski to get around the whole mountain? Check out the Völkl Revolt 81 Skis and call it good. A full twin rocker with a slightly directional shape for "all-mountain" capability, the Revolt 81 gets it done whether you''re cruising the groomed with your buds or getting slappy on features.
', 661, 'https://images.evo.com/imgp/700/227092/915722/volkl-revolt-81-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rossignol Rallybird 90 Pro Skis + Xpress 10W GW Bindings - Women''s 2023', 1, '
A Rallybird for the fledgling set that delivers adult-level performance to those just getting their wings under them, the Rossignol Rallybird 90 Pro Skis + Xpress 10W GW Bindings take all-mountain excellence to a new level. With an extended Poplar core, the 90 Pro keeps edge control to a max under all conditions so you can let it fly with full confidence.
', 518, 'https://images.evo.com/imgp/700/227348/979080/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Elan Ripstick 94 Black Edition Skis - Women''s 2023', 1, '
The Elan Ripstick 94 Black Edition Skis are like an emotionally mature partner: powerful, controlled, and great at challenging your skiing without ever wavering in their support. Constructed with a full wood core reinforced with carbon QuadRods, these skis are so powerful, groomers will gasp in awe when they see you ripping down the hill. Their asymmetrical flex design provides targeted control and edge precision, delighting your thigh muscles and cutting perfectly into groomed snow and variable terrain. For the boot benders looking for something that''ll make them reach for a stiffer power strap, the Elan Ripstick 94 Black Edition Skis are the whole package. Get them a ring asap!
', 478, 'https://images.evo.com/imgp/700/226937/913465/elan-ripstick-94-black-edition-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Black Diamond Helio Carbon 115 Skis 2022', 1, '
Go ahead and book that guided trip to Hokkaido, and don''t forget about your skis. Deep and light snow with nightly refills calls for a touring ski you don''t often have a need for in other climates, and the Black Diamond Helio Carbon 115 Skis are one of the best options out there for a stick over 110mm wide that isn''t an anchor on the skintrack. The guys at the factory in Mittersill probably laugh at anything over 105mm with a skin-clip slot in the tail, but be assured it''s a thing, not just in Japan but anywhere in the western half of North America that gets the goods.
', 479, 'https://images.evo.com/imgp/700/200743/928316/black-diamond-helio-carbon-115-skis-2022-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Liberty Origin 112 Skis 2023', 1, '
If you''ve been paying attention, the go-to width for elite level freeride skiers has gone narrower in the past few years, with 112mm being just about right for most people who actually know how to ski powder and want some edgehold and precision underfoot for the steep and tecnical. The Liberty Origin 112 Skis slot into this category like a champ, with a versatile freeride rocker-camber-rocker profile, plenty of surface area underfoot, and a bomber construction based on the new VMT 1.0 core. The Origin 112 gets it done when other skis don''t quite measure up, and deserve a close look if you''re in the market.
', 751, 'https://images.evo.com/imgp/700/226664/916365/liberty-origin-112-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Lib Tech Libstick 98 Skis - Women''s 2023', 1, '
For the all-mountain skier extraordinaire, we present the Lib Tech Libstick 98 Skis. These skis blend the best of both worlds when it comes to all-mountain riding. With the directional shape and sturdy edge hold of a big mountain ski, they provide poised descents down any terrain and smooth tracking across groomers. With the more forward mount point and medium flex of a freestyle ski, they offer tons of pop and lively energy. They''re fun and nimble, rocketing out of turns and snaking through sneaky tree lines, yet steadfast and dependable when you just need to get to the bottom in one piece.
', 667, 'https://images.evo.com/imgp/700/226843/913506/lib-tech-libstick-98-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl M6 Mantra Skis 2023', 1, '
The Völkl M6 Mantra Skis have ruled the expert all-mountain roost for years, and they show no signs of giving up their perch soon. The addition of Tailored Carbon Tips and Tailored Titanal Frame elements made the M5, already a great ski, even more predictable and capable, and the M6 marches on with no changes other than graphics. If you''re looking for the ultimate in luxurious power with edgehold for miles, the M6 is hard to beat.
', 652, 'https://images.evo.com/imgp/700/227085/915719/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Coalition Snow Rafiki Skis - Women''s 2023', 1, '
The Coalition Snow Rafiki Skis are a feminist approach to powder: wide, surfy, offered in a size range for riders of all abilities, and made with high performance materials that excel when the snow gets deep. Every pair pays tribute to the trees Coalition plants in Kenya when you drop the dough, their name literally means "Friendship," in Swahili. Plus a dual radius sidecut lets you make effortless turns everywhere from the fluff to the runout. Indulge yourself with the Coalition Snow Rafiki Skis.
', 690, 'https://images.evo.com/imgp/700/226478/914808/coalition-snow-rafiki-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Faction Agent 3 Skis 2023', 1, '
The most versatile mid-winter touring design in the Faction collection, the Faction Agent 3 Skis combine a mid-fat 106mm waist, light Karuba wood core, and full Carbon Weave layup in a package that''s light but tough. Dependable and confidence-inspiring on anything from icy steeps to knee-deep freshies, the Agent 3 features a flatter tail with skin notch for your touring pleasure.
', 304, 'https://images.evo.com/imgp/700/227138/939870/faction-agent-3-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kastle Kästle FX96 Ti Skis 2023', 1, '
A freedom machine bent on conquering all terrain and all snow conditions, the Kästle FX96 Ti Skis are arguably the finest quiver-of-one solution in the world. Floaty enough on a pow day, tenacious enough on hard pack, smeary when you want them to be and forgiving when the snow''s not exactly friendly - yes, the FX96 is the tool you need. Built with Kästle''s full arsenal of tech, including Hollowtech 3.0 Carbon tips, Hook Free tip and tail rocker, and a half cap Powerzone Sandwich Sidewall, the FX96 is fast becoming legend - get yours while you can.
', 431, 'https://images.evo.com/imgp/700/228636/940986/kastle-fx96-ti-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Kastle Kästle ZX100 Skis 2023', 1, '
A moderate-flexing freeride ski for less aggressive or lighter riders on their way up the learning curve, the Kästle ZX100 Skis start with a Poplar-Beech wood core with multi-axial fiberglass layup. Add a Semi-Cap sidewall for security on harder snow, and you''ve got a package that will let you storm your way to the top.
', 379, 'https://images.evo.com/imgp/700/228638/980637/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Fischer Ranger 90 Skis 2023', 1, '
For high octane performance both on- and off-piste, look to the Fischer Ranger 90 Skis. With a refined combination of stability and nimble responsiveness thanks to Fischer''s Shaped Ti Titanal inserts underfoot and an easy-turning Flex Cut shape, these 90mm waisted skis offer a versatility that will be beloved by intermediate and advanced skiers alike. Complete with fast sintered bases and a durable sandwich sidewall construction, the Fischer Ranger 90 Skis are the perfect skis for those that like to carve deep trenches all over the mountain with minimal effort.
', 572, 'https://images.evo.com/imgp/700/223706/897747/fischer-ranger-90-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Mantra 102 Skis 2023', 1, '
Perhaps one of the best-balanced daily drivers of all time, the Völkl Mantra 102 Skis took the winning Mantra platform and made it wide enough to excel on a powder day without losing the famous smooth ride or laser-sharp edgehold Völkl is famous for. This 100+ category is a tough one, but you''ll have no problem finding expert skiers who love the Mantra 102 more than any ski in their quiver.
', 433, 'https://images.evo.com/imgp/700/227086/915717/volkl-mantra-102-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Secret 96 Skis - Women''s 2023', 1, '
We''re not sure why they keep using this name, because the word''s out. The Völkl Secret 96 Skis are the ripper skier''s best friend, and the closest thing to a race ski that''ll easily handle every snow condition on the mountain. The previous version of this ski was no slouch, but with the addition of the Tailored Titanal tip and Tailored Carbon Tips the Secret becomes calmer and more manageable without losing any of its inner strength or ability to track cleanly at speed. An amazing ski that responds best to a confident driver, the Secret 96 belongs in your quiver even if it''s a quiver of one.
', 322, 'https://images.evo.com/imgp/700/227102/915727/volkl-secret-96-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Faction Prodigy 2 Skis 2023', 1, '
One ski to do it all — freeride, pow, groomers and hit the park at the end of each lap — is a tall order, and a bit overhyped, but if there ever was such a thing it''s the Faction Prodigy 2 Skis. Clocking in at 98mm underfoot and with a do-it-all directional twin shape that outskis many purpose-built groomer skis but still spins and switches with the best, the Prodigy 2 makes anything possible, run after run after run.
', 431, 'https://images.evo.com/imgp/700/227214/939926/faction-prodigy-2-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('ZAG H-96 Skis 2023', 1, '
The most versatile ski in ZAG''s wide quiver of options, the ZAG H-96 Skis are what they grab when they aren''t sure what snow conditions to expect but need to be able to handle it all (the ski was developed for use by patrollers in the Mont Blanc Valley, known for it expansiveness and complete assortment of conditions on any given day). Intuitive ease of use and confidence on anything from pow to ice are trademarks of the H-96, which incorporates ZAG''s Heavy Duty Construction and full Poplar core for durability.
', 532, 'https://images.evo.com/imgp/700/226535/922129/zag-h-96-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Head Kore 105 Skis 2023', 1, '
The Head Kore 105 Skis make the best of two worlds. Their pure downhill pedigree shows through on each turn, providing the right level of feedback no matter how hard you push them. Their lightweight Multilayer-Carbon Sandwich Cap Construction means they''re ideal for strong skiers as a backcountry option as well. Stiff enough to hit warp speed without hesitation, yet still maneuverable enough to effortlessly bounce through tight trees, and weighing in at a wickedly light weight — if you''re an aggressive skier looking for a ski that never blinks, these bad mamajamas check all the boxes. The choice is up to you, but the Kore 105 is the right call either way.
', 758, 'https://images.evo.com/imgp/700/225244/913906/head-kore-105-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Dynastar M-Pro 90 Skis 2023', 1, '
Groomer lovers who still want to be ready for that surprise 8" overnight dump should check out the Dynastar M-Pro 90 Skis. The M-Pro 90 has incredible precision on groomers, a damp and smooth ride courtesy of the Titanal Rocket Frame, and the ability to handle fresh and cut up snow with ease. Using Dynastar''s Hybrid Poplar and Polyurethane core combines lightness and pop with smoothness, and Torsion Box Full Sidewall Construction gives the ski power to spare when on edge.
', 768, 'https://images.evo.com/imgp/700/228424/918451/dynastar-m-pro-90-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nordica Santa Ana 104 Free Skis - Women''s 2023', 1, '
Okay, the Nordica Santa Ana is good. By now, everyone who''s read online reviews, talked to ski shop employees, or in any way looked into buying a pair of skis in the last few years knows all about how good the Santa Ana is. Lightweight, yet powerful. Easy to ride, yet incredibly precise. And that all sounds good to you, but you''re looking for something a little more... uninhibited. Power is good, and versatility is great, but what if you want to get a little looser? Maybe hit that mini cliff under the chairlift on the next big powder day? Meet the Nordica Santa Ana 104 Free Skis. It''s everything everyone loves about the Santa Ana, but with a bit more rocker, a bit more waist, and a bit less metal, giving you just a bit of extra wiggle room to get a bit more free the next time you get after it.
', 797, 'https://images.evo.com/imgp/700/224776/902351/nordica-santa-ana-104-free-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rossignol Black Ops 92 Skis + Xpress 11 GW Bindings 2023', 1, '
A new Black Ops shape ideal for sessioning every aspect of the hill, the Rossignol Black Ops 92 Skis + Xpress 11 GW Bindings are ideal for lighter riders who love to take air and who like a light and nimble feel underfoot. Built around a light Paulownia wood core (the same used for many touring skis) but with a freestyle shape, the 92 is ready to step it up when you are.
', 557, 'https://images.evo.com/imgp/700/227346/914091/rossignol-black-ops-92-skis-xpress-11-gw-bindings-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Faction Prodigy 4 Skis 2023', 1, '
Big lines and hero snow call for a ski with heart, and the Faction Prodigy 4 Skis are as good as they come. Serious float with a 140mm wide tip and 116mm waist, along with huge rocker lines at both tip and tail mean unparalleled float in the deep stuff, while stout construction and a bomber Poplar wood core keep these things planted and headed down the fall line no matter what.
', 584, 'https://images.evo.com/imgp/700/227219/939936/faction-prodigy-4-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Revolt 86 Temple Skis 2023', 1, '
Session the park for a while, rip some groomers for a while, play in the trees a bit - all part of the game for the Völkl Revolt 86 Skis. A versatile all-mountain twin shape that also rips in the park, the Revolt 86 comes in two awesome graphic options and may be the best bang-for-the-buck choice for freestyle-oriented rippers on a budget.
', 744, 'https://images.evo.com/imgp/700/227095/915726/volkl-revolt-86-temple-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nordica Enforcer 104 Free Skis 2023', 1, '
The Nordica Enforcer 104 Free Skis are built for the uninhibited. For the rider who sees corduroy as a straight-jacket, and who finds the flowing pathways through moguls and trees to be a bit more friendly on the mind. These freeride sticks bring you all of the power and versatility of the fabled Enforcer line, but with a touch more rocker and a touch less metal, which helps them bend past the rules prescribed by traditional ski shaping, and find surfy lines through powder and off piste terrain. If you love the Enforcer 100s but wish they were a little more progressive and playful, this is your ski.
', 574, 'https://images.evo.com/imgp/700/224768/902349/nordica-enforcer-104-free-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Elan Ripstick 96 Skis 2023', 1, '
Get your carve on with the Elan Ripstick 96 Skis, an every day ripper that excels on hard stuff and still delivers when it gets soft and creamy. From carving corduroy to hitting your fave stash, these bombers are made for heavy hitters who cut turns all the way across the run and don''t mess around. Their asymmetrical amphibio profile gives you targeted precision exactly where you need it, while a Tubelite wood core with carbon keeps things light, agile, and ready to send side hits. Elan skis always deliver, and the Ripstick 96 is no exception.
', 727, 'https://images.evo.com/imgp/700/226935/913462/elan-ripstick-96-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Blaze 106 W Skis - Women''s 2023', 1, '
Looking for a light platform to mount up with a tech or hybrid binding and go hunting for some distant pow turns? Take a hard look at the Völkl Blaze 106 W Skis, a lightweight option that doesn''t forget you sometimes need edgehold to get to and from those pow turns unscathed. Or mount the Blaze 106 with an alpine binding and revel in the nimble capabilities of a ski that knows more mass doesn''t always equal more fun. Either way, the 3D Radius sidecut and full sidewall construction get the job done, making sure you''ve got the security you demand when it gets dicey and easy turn initiation when snow conditions get funky.
', 713, 'https://images.evo.com/imgp/700/227075/915709/volkl-blaze-106-w-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('ZAG Slap 104 Skis 2022', 1, '
SLAP (Style Libre en Back-Pays) or "Freestyle Backcountry" en anglais, is the coolest thing in skiing right now. If you want to get it right, line up a pair of the ZAG Slap 104 Skis and hit the slopes frontward, backward, and sideways - it''s all good. ZAG builds this ski in the "Heavy Duty Light" style, meaning burly but not cumbersome, with low camber and a bunch of rocker at both ends of the ski and a hybrid Poplar and Paulownia core for power without excessive weight. If you''re like us and believe that off-piste freestyle skiing deserves more than a slap on the back, get on a pair of these babies and show us you mean it.
', 405, 'https://images.evo.com/imgp/700/209786/852705/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Coalition Snow Bliss Skis - Women''s 2023', 1, '
Queen of the park, princess of play, bringer of badassery and more. The Coalition Snow Bliss Skis are an all-arounder park smashing ripper that shreds everywhere from the baby park to the big hitters. Featuring art by Navajo + Shawnee artist Olathe Antonio, their narrow waist width provides quick edge to edge transitions, whether they''re carving corduroy or pulling 360''s with friends.
', 756, 'https://images.evo.com/imgp/700/226481/914809/coalition-snow-bliss-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Season Pass Skis 2023', 1, '
Introducing a backcountry ski for the most creative, pow-hungry earn-your-turners in the land, the Season Pass Skis are a wider, lighter take on the ultra-versatile Nexus skis, because the crew at Season know why you tour. Built with an ultra-light woodcore of Poplar and Paulownia and a nearly symmetrical twin shape, the Pass is light enough for full days on the trail but stout enough to shred hard on the way down. Never has there been such a wealth of options for skiing beyond the confines of the resort - the Season Pass pushes the envelope for the most playful and imaginative among us.
', 711, 'https://images.evo.com/imgp/700/225267/940709/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Dynastar M-Pro 99 Skis 2023', 1, '
A staff favorite on harder snow, but suitable for any conditions on the mountain, the Dynastar M-Pro 99 Skis are super versatile performers that excel at both long and short radius turns and offer powerful on-edge performance. One of the best choices for an all-mountain ski that needs to be able to handle any snow and any terrain with grace, the M-Pro 99''s Titanal Rocket Frame adds significant dampness to the ride quality without a huge weight gain.
', 587, 'https://images.evo.com/imgp/700/228423/918452/dynastar-m-pro-99-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Liberty Genesis 106 BC Skis - Women''s 2023', 1, '
This is the backcountry ski you''ve been waiting for. The Liberty Genesis 106 BC Skis take their freeride roots and update them with lighter materials to create a carvy, floaty ski that excels on the skin track too. The aspen and carbon core and partial metal edge shave crucial grams without compromising that classic Genesis feel, and the reduced tail rocker is more compatible with climbing skins. This ski is ready for big, gnarly lines and won''t punish you on your way to the summit.
', 448, 'https://images.evo.com/imgp/700/226668/947013/liberty-genesis-106-bc-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Black Diamond Helio Carbon 95 Skis 2023', 1, '
Built around an engineered Paulownia wood core with a pre-preg Carbon layup, the Black Diamond Helio Carbon 95 Skis balance long-haul lightness with plenty of guts and stiffness to get you down in style. The 95mm waist is a great choice for those who mix full winter touring with spring and summer missions and extended traverses, and the early rise tip rocker provides a surprising level of float in variable snow conditions.
', 474, 'https://images.evo.com/imgp/700/227677/917062/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Elan Ripstick 88 Skis 2023', 1, '
Hey you. Yes, you reading this page. Do you like to go fast? Like, really fast? Get in on this, the Elan Ripstick 88 Skis MIGHT just help you beat your friends. Whether you like to smash the Ice Coast or get out on freshly groomed runs everywhere else, these sticks are all but guaranteed to help you beat your pals to the lift. Constructed with carbon rods that provide stability and power and a lightweight Tubelite Wood Core that makes the Ripstick easy to handle, they''re a recipe for success. You''ve heard of the saying "No friends on a pow day." But what about, "No friends on a fast day?" You know who you are. Get em'' while they last!
', 327, 'https://images.evo.com/imgp/700/226936/913464/elan-ripstick-88-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('DPS Foundation 100 RP Skis 2023', 1, '
On track to take over the best-selling status of the legendary 112 RP, the DPS Foundation 100 RP Skis provide a more versatile daily option for the majority of skiers who want forgiving and dependable performance on the groomed as well as in the powder. Damp and predictable, the Foundation 100 RP makes a tremendous quiver-of-one that will stand up to both hardpack and freshies, without having to deal with a super wide platform.
', 397, 'https://images.evo.com/imgp/700/209066/858495/dps-foundation-100-rp-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Völkl Secret 96 Skis - Women''s 2022', 1, '
The Völkl Secret 96 Skis are ready for daily driver duty from coast to coast. Prized for their stability through variable snow and superior edge hold on firmer stuff, the new model is tweaked rather than overhauled. A progressive Tailored Titanal Frame design makes for a more finely tuned ride in each length, while a new carbon layup in the tips helps lighten the load for greater agility without compromising on-snow performance. If you''re a strong skier looking to gain an edge at the resort, there are few that can match up to the power and capability of the Secret 96s.
', 363, 'https://images.evo.com/imgp/700/201961/795907/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Faction Agent 2 Skis 2023', 1, '
Built with the shape of the frontside specialist Dancer series, but with a heart of ultralight Karuba wood, a carbon-enhanced layup with Titanal only under the bindings, and skintrack-ready flat, notched tail, the Faction Agent 2 Skis are a top "touring" choice for technical backcountry skiers, but also excel on steep technical terrain, forests, and bumps. An excellent choice to mount up with a hybrid or full tech binding and take advantage of whatever seems the best option on any particular day.
', 323, 'https://images.evo.com/imgp/700/227136/939868/faction-agent-2-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nordica Enforcer 88 Skis 2023', 1, '
Looking for a frontside ski that rails like Lewis Hamilton at Monza but doesn''t make you feel like a quitter when it''s late in the day and your legs are noodles? Check out the Nordica Enforcer 88 Skis, a ride with a race pedigree built by people who know you''re still human and maybe don''t want to work that hard all day long.
', 386, 'https://images.evo.com/imgp/700/224771/910233/nordica-enforcer-88-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nordica Santa Ana 98 Skis - Women''s 2023', 1, '
The Nordica Santa Ana 98 Skis might just be the most versatile women''s skis ever made. It''s hard to make something so universally beloved by pros and everyday skiers alike, but Nordica has done it. The middle child of the Santa Ana family is a blend of lightweight and powerful, with tons of grip and drive for confidence down the fall line, but a surprisingly quick and intuitive feel when carving turns at slower speeds. It rewards good technique without punishing the occasional lapse in form, and performs well in the full spectrum of snow conditions, making it an ideal one-ski quiver for skiers that want to ride it all.
', 421, 'https://images.evo.com/imgp/700/224777/902354/nordica-santa-ana-98-skis-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rossignol Sender 94 Ti Skis 2023', 1, '
The Rossignol Sender 94 Ti Skis offer a long coveted blend of titanal infused stability and a stiffer flex while still being nimble and easy to maneuver when things get spicy. Ideal for intermediate to advanced skiers who appreciate going fast and sending ''er deep off those natural sidehits and cat tracks, the Sender 94 Ti empowers you to charge all over the mountain whether conditions are prime or not!
', 485, 'https://images.evo.com/imgp/700/216288/898235/rossignol-sender-94-ti-skis-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nordica Enforcer 94 Skis 2023', 1, '
The Enforcer line has become something of a cult classic by now. They''re just so good, and with a wide range of widths available, there''s one that''s just right for every set of daily conditions. As the mid skinny option in the lineup, the Nordica Enforcer 94 Skis are an ideal daily driver for East Coast riders or those who tend to find themselves in firmer conditions. They''re built around two sheets of titanal and a reinforced carbon chassis that makes them exceptionally precise, quick, and powerful snapping off turns edge to edge.
', 337, 'https://images.evo.com/imgp/700/224770/902347/nordica-enforcer-94-skis-2023-.jpg');


INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('K2 Lil Mini Snowboard - Little Boys'' 2023', 2, '
The K2 Lil Mini Snowboard is just the ticket for young riders beginning their snowboarding careers. The Noodle Core construction and Catch-Free Rocker make the Lil Mini extremely forgiving, and a soft flex compliments the package perfectly to give your ripper a head start all over the mountain.
', 647, 'https://images.evo.com/imgp/700/207160/909431/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rome Freaker Snowboard 2023', 2, '
The Rome Freaker Snowboard can party anywhere on the mountain. The directional twin shape and poppy Fusion Camber are ready to hit any feature and Directional Triple Bamboo Omega HotRods add response and power to your sidecountry lines. If all mountain and freestyle boards are limiting your style, a little dose of weirdness just might be the solution to your snow-boring woes.
', 637, 'https://images.evo.com/imgp/700/226684/913975/rome-freaker-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Cardiff Crane Enduro Snowboard 2022', 2, '
The Cardiff Crane Enduro Snowboard is Cardiff''s go-everywhere, do-everything freestyle-oriented board, with a very slightly tapered shape and enough rocker at both ends to make switch riding incredibly easy and intuitive. The Enduro build is the toughest, most durable option Cardiff offers, and starts with their CARBONcore and triax fiberglass layup, full UNIwall sidewalls, and an ultra durable topsheet. With a HALFcamber65 profile, the Crane is the poppiest and liveliest board in the Cardiff catalog.
', 414, 'https://images.evo.com/imgp/700/207891/840714/cardiff-crane-enduro-snowboard-2022-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('GNU Gloss C2E Snowboard - Women''s 2022', 2, '
Your skills deserve more than a matte finish, so give em some extra sparkle with the GNU Gloss C2E Snowboard. Built with an easygoing rocker profile and grippy Magne-Traction edges, the Gloss is perfect for playful park laps and glossy smooth, flowing runs down the groomers. Hand built in the good ol'' US of A at Mervin''s eco-friendly facility, the Gloss Snowboard is bound to get the creative juices flowing on the mountain.
', 763, 'https://images.evo.com/imgp/700/206929/824540/gnu-gloss-c2e-snowboard-women-s-2022-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Surfer Snowboard 2023', 2, '
Back off Warchild, the the 50 Year Storm is here. The Bataleon Surfer Snowboard is made for the biggest dumps that know no friends, thanks to the super set back stance, oversized nose, and long swallowtail that keep your front end out of the swell. 3BT™ sidebase uplift with AirRide™ floats through pow and dampens the chunder, so you can surf the pow, cruise the hardpack, and leave the kooks in your wake.
', 1024, 'https://images.evo.com/imgp/700/218556/913212/bataleon-surfer-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rome Ravine Snowboard 2023', 2, '
If you need a quiver killer board that can handle the pow, the Rome Ravine Snowboard is ready to swim with the rest of the fishes. Diamond 3D shaping is designed for serious float in deep powder and maneuvers like a pro when the snow gets sloppy. Double Carbon HotRods in the tail provide fast and playful response when you''re bouncing off side hits or racing through trees. The rockered nose keeps you moving in the deep stuff and the cambered tail provides stability on the hardpack, so you can move from the sidecountry to the cat tracks without missing a beat.
', 747, 'https://images.evo.com/imgp/700/226678/913972/rome-ravine-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Never Summer Lady FR Snowboard - Women''s 2023', 2, '
Freeride? Check. Directional? Check. Stiff and powerful for the hard rippers? Double check. The Never Summer Lady FR Snowboard is constructed with triple camber for speed, power, and supreme versatility. This original triple camber board features a WooBoo wood and bamboo core for a transformative ride that isn''t afraid to dig in and get it.
', 1022, 'https://images.evo.com/imgp/700/227190/931236/never-summer-lady-fr-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rossignol Diva Snowboard - Women''s 2023', 2, '
Hard chargers rejoice, the Rossignol Diva Snowboard is a true twin freestyle board that can plunder and prowl through any conditions. The L.I.T.E. Frame, stiff flex, and long list of high strength materials in the layup give this crusher a solid and precise feel when you''re zipping past ski racers on the hill. Full length shock absorption is ready for whatever backcountry booters, 40 foot cliffs, or high speed side hits you can find, and the Diva isn''t afraid of a little firm snow and ice, but is just as happy popping and playing when rolling groomers are all you''ve got. Enjoy smooth turns, high angle carves, and even low chatter straight lines. The Rossignol Diva Snowboard is ready for whatever you have to throw at it.
', 431, 'https://images.evo.com/imgp/700/208076/833806/rossignol-diva-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nidecker Ora Snowboard - Women''s 2023', 2, '
For a board you can hop on and jive with one day one, look no further than the Nidecker Ora Snowboard. With a directional twin shape, Standard CamRock profile, and a snappy full wood core backed up by Nidecker''s Classic Sandwich construction, the Ora is ideal for women seeking something a little less punishing, and a lot more fun.
', 362, 'https://images.evo.com/imgp/700/207607/823555/nidecker-ora-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Cardiff Crane Enduro Splitboard 2023', 2, '
You love the idea of bringing your carefully cultivated bag of freestyle tricks to the BC, but first you need to get up the hill? The Cardiff Crane Enduro Splitboard was built with you in mind. The Enduro built is Cardiff''s most durable and bombproof, the HALFcamber65 profile adds plenty of spice to your ride, and the Crane Enduro split flies uphill, well, like a bird.
', 359, 'https://images.evo.com/imgp/700/207906/840767/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Jones Stratos Snowboard - Women''s 2023', 2, '
Driving to the mountain with an uncertain forecast? The Jones Stratos Snowboard is the easy answer. A directional rocker profile with just the right amount of camber underfoot provides pop, power, and grip on firm snow, while 3D Contour Base shaping makes for dreamy transitions to softer stuff. A tight sidecut and friendly flex give this board a playful feel so you can carve, drop, and bounce around the mountain to your heart''s content.
', 1019, 'https://images.evo.com/imgp/700/206662/818848/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Jones Ultracraft Snowboard 2023', 2, '
The Hovercraft has rightly earned cult status for its nimble feel and versatile performance, but serious freeriders will want to skip a few steps and jump straight to the Jones Ultracraft Snowboard. It riffs on the same shape, with the addition of premium materials like basalt stringers and an ash veneer topsheet that reduce chatter and smooth out the ride. The 3D Contour Base 3.0 and directional rocker profile guarantee float and fluidity in pow, while the long side-cut and short, stiff tail are perfect for that no-speed-limit feel when you open up the throttle. If you''re looking for a Goldilocks big mountain crusher for all occasions, you''re looking for the Ultracraft.
', 301, 'https://images.evo.com/imgp/700/206655/818715/jones-ultracraft-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Ride Lowride Snowboard - Kids'' 2023', 2, '
The Ride Lowride Snowboard is designed for little shredders on the up, with a catch free Twin Rocker profile that makes turning easy as pie. Fun, forgiving, and expertly crafted to encourage progression, the Lowride is sure to spark a lifetime of Winter stoke.
', 717, 'https://images.evo.com/imgp/700/203129/887262/ride-lowride-snowboard-kids-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Thunder Snowboard 2023', 2, '
The Bataleon Thunder Snowboard drew from the ripping women''s Storm board for an aggressive, freeride shredder that knows no limits. High camber is stable and snappy for popping off natural features and it floats like a dream thanks to the 3BT™ tech and lightweight carbon Dual Super Tubes. The uplifted sidebases let you throw hard carves on the groomers and charge through rougher terrain so fast you''ll be back at the lift before you can say "cumulonimbus."
', 851, 'https://images.evo.com/imgp/700/218557/913213/bataleon-thunder-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nitro Squash Snowboard - Women''s 2023', 2, '
One look at the Nitro Squash Snowboard and you know a heckin'' good time is guaranteed. All the ingredients are there. Camber? Check. Tapered Swallowtail shape? Check. Big ol floaty nose? Check. This do-anything deck tackles everything from slackcountry pow missions to banked slaloms and groomer sessions with uncanny style. Trüe Camber provides ample pop and response, while the tapered swallow tail shape and progressive sidecut make it seriously surfy when there''s a little fresh to play with. If you''re not having enough fun on that beat up twin you''ve been riding for the last decade, the Squash is good for what ails you.
', 398, 'https://images.evo.com/imgp/700/224708/911961/nitro-squash-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('K2 Raygun Snowboard 2022', 2, '
Don''t bring a light sabre to a blaster fight, choose the K2 Raygun Snowboard and be ready to battle. This light but solid classic is one of K2''s biggest sellers because it delivers a ton of performance for the money. An all-Aspen core, ICG™ 10 Carbon Glass laminate construction, and a tough Extruded 2000 Base are all part of the package.
', 618, 'https://images.evo.com/imgp/700/207171/819124/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon BYND MDLS Snowboard 2023', 2, '
The Beyond Medals crew are experts in creative and fun riding, so their custom Whatever snowboard is sure to be a wild ride. The Bataleon BYND MDLS Snowboard is stiffer than the original for even more versatility on the mountain. Carbon Dual Super Tubes reduce weight and provide epic snap for busting off features and the classic 3BT™ tech is smooth and floaty in every terrain. It''s a serious ride for not-so-serious riders who care more about individual style than arbitrary points.
', 448, 'https://images.evo.com/imgp/700/218533/913170/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Rome Stale Fish Snowboard 2023', 2, '
Forget the overpriced resort burgers and fries - when the snow starts falling, fish is the only thing on the menu. The Rome Stale Fish Snowboard is made for the hard-charging snow surfer, kind of rider who values both style and speed. The long rockered nose and setback stance keep you moving in the powder and the Diamond 3D shape floats and turns with ease. Bamboo HotRods in the nose add a playful pop so you can hit a few features while making big surfy arcs, bringing the best of snowboarding and snow surfing into one epic board.
', 601, 'https://images.evo.com/imgp/700/226680/913973/rome-stale-fish-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Disaster Snowboard 2023', 2, '
The only thing disastrous about the Bataleon Disaster Snowboard is its effect on everyone else''s morale. The Disaster is the coolest board in the park, with a mellow uplift at the sides of the tip and tail that give you some wiggle room if your landing isn''t totally clean. The super soft flex is ready for every trick in the book and the low camber profile gives you the pop you crave with none of the hang ups.
', 584, 'https://images.evo.com/imgp/700/218541/913185/bataleon-disaster-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Season Nexus Snowboard 2023', 2, '
The Season Nexus Snowboard stands out in the arms race of bloated quivers and technical jargon - a simple skeleton key capable of unlocking the innate potential of any day in the mountains. Its straightforward geometry cuts through the noise, creating something that adds up to much more than the sum of its parts. Ample float in powder, smooth, engaged turns on hardpack, and dependable performance in everyday resort chop. It’s the ultimate quiver of one - more than enough to remind you why you fell in love with snowboarding in the first place.
', 647, 'https://images.evo.com/imgp/700/225271/940706/season-nexus-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Yes. Standard Snowboard 2023', 2, '
You could spend the first half of each day in the parking lot agonizing over which board you should ride, or you could just bring the Yes. Standard Snowboard and be done with it. This board sets the standard for all mountain versatility with a Directional Volume Twin shape that''s just as happy shredding pow in the trees as it is going huge in the park. Blur the lines between freeride and freestyle - or just throw them out altogether - with a true quiver of one.
', 828, 'https://images.evo.com/imgp/700/206989/883519/yes-standard-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nitro Prime Raw Snowboard 2023', 2, '
The Nitro Prime Raw Snowboard is a quiver busting all mountain ripper for riders seeking one board to rule them all. A directional twin shape combines with Nitro''s snappy Power Core construction and Flat Out rocker profile for a versatile ride that serves up the goods in any conditions.
', 569, 'https://images.evo.com/imgp/700/207658/832130/nitro-prime-raw-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Season Forma Snowboard 2023', 2, '
You know it when you feel it - a Platonic ideal brought to life for a few fleeting moments of gravity fed bliss. Like the Wizard of Oz bursting into technicolor after a lifetime of sepia, the perfect turn changes everything. The Season Forma Snowboard is crafted to seek it wherever it lies, with a volume shifted swallowtail design that harks back to the early days of surf shaping. This throwback pow shape offers dolphin-like agility in deep snow, but crank it up to speed on firmer ground and the Forma gives as good as it gets, begging you to get low and drag a hand.
', 526, 'https://images.evo.com/imgp/700/225269/940705/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Goliath Snowboard 2023', 2, '
The Bataleon Goliath Snowboard is no Philistine - strap it on and you''ll be earning creative style points anywhere on the mountain. Medium camber and carbon Dual Radial Super Tubes add stability at speed and the 3BT™ uplifted sidebases let you float and land stunts you never thought you''d master. If you enjoy everything from hot laps to rail, the Goliath will get you from top to bottom in the most fun line possible.
', 572, 'https://images.evo.com/imgp/700/218551/913199/bataleon-goliath-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Wallie Snowboard 2023', 2, '
Bring a little spice back to your riding with the Bataleon Wallie Snowboard. Low camber compliments the 3BT™ tech, which uplifts the sidebase at the widest points of the nose and tail. This lets you pop into carves and float through pow and is forgiving when you don''t quite nail that landing. The soft flex is perfect for trying out new moves so you can make the entire mountain your playground.
', 667, 'https://images.evo.com/imgp/700/218559/913222/bataleon-wallie-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Feelbetter Snowboard - Women''s 2023', 2, '
Newbies take a beating when they''re learning to ride, so make the learning curve a little easier with the Bataleon Feelbetter Snowboard. 3BT™ with Sidekick™ uplifts the side bases at the nose and tail for easier turn initiation and bite-free riding. The soft flex is perfect for beginners who need a board that''s easier to control at slower speeds, and when you get the hang of linking turns the uplifted edges will help you float and carve through any terrain you want to explore.
', 434, 'https://images.evo.com/imgp/700/218565/913238/bataleon-feelbetter-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Never Summer Proto Synthesis Snowboard - Women''s 2023', 2, '
Much like photosynthesis - the mechanism by which plants convert sunlight into energy - the Never Summer Proto Synthesis Snowboard converts snow and gravity into pure human stoke. On a pow day, when conditions are especially ripe, you can hear the reaction occurring in the form of spontaneous, involuntary hollering: "YEWWWWWW". It''s remarkable stuff, destined to be studied closely by snowboarding scientists searching for a cure to mankind''s ills. For now, you can do your bit by picking up one of the most energetic all mountain twins ever conceived and hooking yourself into the stoke mainframe. For the good of mankind, obviously.
', 702, 'https://images.evo.com/imgp/700/225622/931219/never-summer-proto-synthesis-snowboard-women-s-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nitro The Quiver Cannon Snowboard 2023', 2, '
Catch the buzz of the world''s most famous swallowtail with the Nitro The Quiver Cannon Snowboard. A versatile sidecountry destroyer that''ll charge through chunder just as naturally as it surfs weightlessly atop pow, the Cannon''s unique shaping and mid-wide width make it incredibly fun. Moderately stiff with Nitro''s Cam-Out rocker/camber profile, the Nitro Quiver Cannon Snowboard is a one of a kind specimen that you''ll find yourself saddling up on every time there''s fresh turns to be harvested.
', 974, 'https://images.evo.com/imgp/700/224694/911912/nitro-the-quiver-cannon-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Salomon Super 8 Splitboard 2022', 2, '
Like powder? You''re gonna love the Salomon Super 8 Splitboard. This backcountry explorer combines surfy Backseat Camber with a setback stance for the rider who likes a little extra sauce when the going gets deep, with Salomon''s lightweight Ghost Green Core to keep the turns nimble and silky smooth. Throw in a set of industry-leading pre-cut skins from Pomoca, and you''ve got a one way ticket to the wilderness white room.
', 1039, 'https://images.evo.com/imgp/700/207263/898492/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Arbor Westmark Rocker Frank April Snowboard 2023', 2, '
Riding the Arbor Westmark Rocker Frank April Snowboard feels like what would happen if you could take your skateboard down to your favorite point break and start tail sliding the lip of every wave that rolls through. With a redesigned tip and tail profile that provides an even more powerful and poppy ride, the full rocker profile gives it a super flowy feeling, easy turn initiation, and a bit of float when the snow starts falling. But first and foremost, this thing is all about freestyle. The sturdy medium flex pattern makes this a perfect board for all mountain jibbing and park progression, from the park to the street and beyond.
', 706, 'https://images.evo.com/imgp/700/225081/904233/arbor-westmark-rocker-frank-april-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Blow Snowboard 2023', 2, '
Don''t blow it, snag the Bataleon Blow Snowboard and lock in your freestyle progression for the next season or three. This easy-rider has a mellow flex and a versatile twin outline that helps you hone your style both in and out of the park. The Jib 3BT shape and beefy Shock Walls construction gives you plenty of stability and a solid platform for freestyle progression whether you''re smashing side hits, hunting natural features, or working on your rail game.
', 824, 'https://images.evo.com/imgp/700/218531/913171/bataleon-blow-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Evil Twin Snowboard 2023', 2, '
Everyone has a doppleganger but none of us want to run into these bad luck harbingers. The Bataleon Evil Twin Snowboard is the one alter ego you''ll be happy you found, thanks to 3BT™ uplifted sidebases and medium camber that will absolutely destroy competition in the park. The carbon Central Super Tube and lightweight core are snappy and lightweight for maximum air and the medium flex is versatile enough to bop around the rest of the mountain when you want to hit some natural features. It''s the classic Bataleon board that just gets better with age.
', 512, 'https://images.evo.com/imgp/700/218544/980783/bataleon-evil-twin-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Season Aero Snowboard 2023', 2, '
The Season Aero Snowboard is a rocket ship, surgeon’s scalpel, and artist’s paintbrush rolled into one. It’s that friend you can rely on to drop everything to go ride - the same one who makes you feel ten feet tall when things get spicy. Crafted with traditional camber and a powerful flex, it exudes confidence in rugged terrain and purrs when you open up the throttle to paint fast, clean arcs through the chop. Top to bottom, bell to bell, the Aero is built to fly.
', 605, 'https://images.evo.com/imgp/700/225274/940712/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Whatever Snowboard 2023', 2, '
Whatever, whenever — the Bataleon Whatever Snowboard is an all-mountain monster, ready for hot laps, cliff jumps, and anything else you have in mind. 3BT™ uplifted sidebases carve like butter and float like a dream, and the directional shape with a twin profile brings the best of both worlds. Ditch the quiver and grab the one board that can truly do it all.
', 331, 'https://images.evo.com/imgp/700/218560/913232/bataleon-whatever-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Roxy Dawn Snowboard - Women''s 2022', 2, '
The Roxy Dawn Snowboard is a super friendly board paired with the right technology for comfortable progression. Its twin geometry, Easy-Rise rocker profile, and softer flex make the Dawn ideal for the rider who may be a bit intimated by what the resort has to offer, but is ready to conquer their fears and start taking names.
', 350, 'https://images.evo.com/imgp/700/208579/825479/clone.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Minishred Snowboard - Kids'' 2023', 2, '
Forget starting the kiddo out on two planks, get em going on the Bataleon Minishred Snowboard. Bataleon''s Triple Base Technology makes learning to ride stress-free for everyone involved, and a true twin shape allows your little one to figure out their favorite stance. Plus, the Bataleon Minishred Snowboard is built to the same high standards as their adult boards for lasting durability you can count on.
', 442, 'https://imageQs.evo.com/imgp/700/218561/913237/bataleon-minishred-snowboard-kids-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nitro Lectra Snowboard - Women''s 2022', 2, '
The Nitro Lectra Snowboard facilitates your progress on snow with a super approachable flex and easygoing Flat Out Rocker to ensure a steady ride that''s bound to aid your progression. It''s ideal for anyone just getting started, and there''s plenty to enjoy for more experienced riders seeking a softer board to play with in the park. Wherever you take it, the Lectra is built to flourish.
', 986, 'https://images.evo.com/imgp/700/207673/832159/nitro-lectra-snowboard-women-s-2022-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Roxy Raina LTD Snowboard - Women''s 2022', 2, '
For riders steadily building on the fundamentals and conquering the resort, look to the Roxy Raina LTD Snowboard to keep you cruising. This medium to soft flexing board features top shelf features like C2 Contour Technology and Magne-Traction® edges, but comes in a beginner friendly package that rides easily in any snow conditions. Now featured in true evo style thanks to this exclusive topsheet!
', 628, 'https://images.evo.com/imgp/700/204345/885922/roxy-raina-ltd-snowboard-women-s-2022-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Bataleon Party Wave + Snowboard 2023', 2, '
If you head for the trees when the snow starts falling, the Bataleon Party Wave + Snowboard is the pow stick you need in your quiver. The short, volume-shifted shape whips around obstacles with ease and the 3BT™ uplifted sidebases and narrow centerbase make edge-to-edge transitions even easier. The setback stance and slight swallowtail keep your nose out of the deep stuff but the wider shape also lets you throw some hard carves on the groomers for a shreddy fiesta in any conditions. With Carbon Stringers and an all around beefed up construction, this + model is ready to rip!
', 966, 'https://images.evo.com/imgp/700/218554/913206/bataleon-party-wave-snowboard-2023-.jpg');
INSERT INTO product(productName, categoryId, productDesc, productPrice, productImageURL) VALUES ('Nidecker Alpha Snowboard 2023', 2, '
What if your snowboard could launch from the snow like a bird of prey? What if it could slice through deep pow like a dolphin moving through the waves? For Nidecker, the answer lies in Biomimicry: incorporating shapes found in the natural world, and strategies honed over millennia through natural selection. It could mean learning from the structure of a bird’s wing in flight and applying the same principles to optimize lift and float, or analyzing the morphology of a penguin''s stomach for a more fluid edge to edge feel. If it sounds simultaneously groundbreaking and obvious - as if the answer was staring us in the face all along - that''s because it is. The Nidecker Alpha Snowboard is the playful member of the new Instinct family, blending all mountain freestyle with a loose and surfy feel that allows you to take flight at any moment.
', 824, 'https://images.evo.com/imgp/700/207602/823536/nidecker-alpha-snowboard-2023-.jpg');

-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Chai', 1, '10 boxes x 20 bags',18.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Chang',1,'24 - 12 oz bottles',19.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Aniseed Syrup',2,'12 - 550 ml bottles',10.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Chef Anton''s Cajun Seasoning',2,'48 - 6 oz jars',22.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Chef Anton''s Gumbo Mix',2,'36 boxes',21.35);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Grandma''s Boysenberry Spread',2,'12 - 8 oz jars',25.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Uncle Bob''s Organic Dried Pears',4,'12 - 1 lb pkgs.',30.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Northwoods Cranberry Sauce',2,'12 - 12 oz jars',40.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Mishi Kobe Niku',5,'18 - 500 g pkgs.',97.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Ikura',6,'12 - 200 ml jars',31.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Queso Cabrales',3,'1 kg pkg.',21.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Queso Manchego La Pastora',3,'10 - 500 g pkgs.',38.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Tofu',4,'40 - 100 g pkgs.',23.25);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Genen Shouyu',2,'24 - 250 ml bottles',15.50);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Pavlova',7,'32 - 500 g boxes',17.45);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Alice Mutton',5,'20 - 1 kg tins',39.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Carnarvon Tigers',6,'16 kg pkg.',62.50);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Teatime Chocolate Biscuits',7,'10 boxes x 12 pieces',9.20);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Sir Rodney''s Marmalade',7,'30 gift boxes',81.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Sir Rodney''s Scones',7,'24 pkgs. x 4 pieces',10.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Gustaf''s Knackebread',8,'24 - 500 g pkgs.',21.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Sasquatch Ale',1,'24 - 12 oz bottles',14.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Steeleye Stout',1,'24 - 12 oz bottles',18.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Inlagd Sill',6,'24 - 250 g  jars',19.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Boston Crab Meat',6,'24 - 4 oz tins',18.40);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Jack''s New England Clam Chowder',6,'12 - 12 oz cans',9.65);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Singaporean Hokkien Fried Mee',8,'32 - 1 kg pkgs.',14.00);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Louisiana Fiery Hot Pepper Sauce',2,'32 - 8 oz bottles',21.05);
-- INSERT product(productName, categoryId, productDesc, productPrice) VALUES ('Laughing Lumberjack Lager',1,'24 - 12 oz bottles',14.00);
    
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Arnold', 'Anderson', 'a.anderson@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'arnold' , 'test');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Bobby', 'Brown', 'bobby.brown@hotmail.ca', '572-342-8911', '222 Bush Avenue', 'Boston', 'MA', '22222', 'United States', 'bobby' , 'bobby');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Candace', 'Cole', 'cole@charity.org', '333-444-5555', '333 Central Crescent', 'Chicago', 'IL', '33333', 'United States', 'candace' , 'password');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Darren', 'Doe', 'oe@doe.com', '250-807-2222', '444 Dover Lane', 'Kelowna', 'BC', 'V1V 2X9', 'Canada', 'darren' , 'pw');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Elizabeth', 'Elliott', 'engel@uiowa.edu', '555-666-7777', '555 Everwood Street', 'Iowa City', 'IA', '52241', 'United States', 'beth' , 'test');


SET @oid := 1;
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (@oid, '2019-10-15 10:25:55', 91.70);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 1, 1, 18);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 5, 2, 21.35);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 10, 1, 31);

SET @oid := 2;
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (@oid, '2019-10-16 18:00:00', 106.75);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 5, 5, 21.35);

SET @oid := 3;
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (@oid, '2019-10-15 3:30:22', 140);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 6, 2, 25);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 7, 3, 30);

SET @oid := 2;
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (@oid, '2019-10-17 05:45:11', 327.85);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 3, 4, 10);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 8, 3, 40);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 13, 3, 23.25);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 28, 2, 21.05);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 29, 4, 14);

SET @oid := 5;
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (@oid, '2019-10-15 10:25:55', 277.40);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 5, 4, 21.35);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 19, 2, 81);
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@oid, 20, 3, 10);
