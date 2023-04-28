create table checkout
(
    id            bigint auto_increment
        primary key,
    user_email    varchar(255) null,
    checkout_date varchar(255) null,
    return_date   varchar(255) null,
    movie_id      bigint       null
);

create table history
(
    id            bigint auto_increment
        primary key,
    user_email    varchar(255) null,
    checkout_date varchar(255) null,
    returned_date varchar(255) null,
    title         varchar(255) null,
    director      varchar(255) null,
    description   varchar(255) null,
    image         mediumblob   null
);

create table messages
(
    id          bigint auto_increment
        primary key,
    user_email  varchar(255)         null,
    title       varchar(255)         null,
    question    varchar(255)         null,
    admin_email varchar(45)          null,
    response    varchar(255)         null,
    closed      tinyint(1) default 0 null
);

create table movie
(
    movie_id         bigint auto_increment
        primary key,
    title            varchar(255) null,
    director         varchar(255) null,
    description      varchar(255) null,
    copies           int          null,
    copies_available int          null,
    category         varchar(255) null,
    img              mediumblob   null
);

create table review
(
    id                 bigint auto_increment
        primary key,
    user_email         varchar(255)  null,
    date               date          null,
    rating             decimal(3, 2) null,
    movie_id           bigint        null,
    review_description varchar(255)  null
);