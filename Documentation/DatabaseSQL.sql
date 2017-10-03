-- Creates Database for Smart Locker project

create table combo(
	food_id int(10) not null unique,
	combo_name char(255) not null unique,
	price float(10) not null,
	combo_photo BLOB(),
	primary key(food_id)
);

create table food(
	ingrediet_id int(10) not null unique,
	food_name char(255) not null unique,
	food_photo BLOB(),
	food_id int(10),
	primary key(ingredient_id)
	foreign key(food_id) references combo
);

create table ingredient(
	raw_ingredient char(255),
	ingredient_id int(10),
	foreign key (ingredient_id) references food
);

create table ordername(
	order_id int(10),
	primary key(order_id)
);

create schedule(
	pickup_time time(7) unique,
	available boolean(1),
	primary key(pickup_time)
);

create locker(
	number_locker int(10),
	PIN int(6),
	primary key(number)
);

create locker_schedule(
	pickup_time time(7),
	foreign	key(pickup_time) references schedule
	number_locker int(10),
	foreign key (number_locker) references locker
	order_id int(10),
	foreign key(order_id) references ordername
);