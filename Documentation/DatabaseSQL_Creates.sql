-- Creates Database for Smart Locker project

create table combo(
	id int(10) not null unique,
	name char(255) not null unique,
	price float(10) not null,
	photo BLOB(),
	primary key(id)
);

create table food_combo(
	food_id int (10) not null,
	combo_id int (10) not null,
	primary key(food_id, combo_id),
	foreign key(food_id) references food,
	foreign key(combo_id) references combo
);

create table food(
	id int(10) not null unique,
	name char(255) not null unique,
	photo BLOB(),
	primary key(id)
);

create table food_ingredient(
	food_id int(10) not null,
	ingredient_id int(10) not null,
	primary key(food_id, ingredient_id),
	foreign key(food_id) references food,
	foreign key(ingredient_id) references ingredient
);

create table ingredient(
	id int(10) not null unique,
	name char(255) not null unique,
	primary key(id)
);

create table order(
	id int(10) not null unique,
	combo_id int(10) not null,
	datestamp date not null, -- not in ERM but might be usefull for a order
	primary key(id),
	foreign key(combo_id) references combo
);

create table schedule(
	pickup_time time(7) not null unique,
	available boolean(1),
	primary key(pickup_time)
);

create table locker(
	nr int(10) not null unique,
	PIN int(6) not null,
	primary key(nr)
);

create table locker_schedule(
	pickup_time time(7) not null,
	locker_nr int(10) not null,
	order_id int(10) not null,
	primary key(pickup_time, locker_nr, order_id),
	foreign	key(pickup_time) references schedule,
	foreign key (locker_nr) references locker,
	foreign key(order_id) references order
);
