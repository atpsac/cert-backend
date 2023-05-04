import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
    
    CREATE TABLE "user" (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        username varchar(25) NOT NULL,
        password varchar(100) NOT NULL,
        create_user integer NOT NULL,
        create_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_user integer NOT NULL,
        update_date timestamp NOT NULL,
        situation boolean NOT NULL DEFAULT TRUE,
        CONSTRAINT users_pk PRIMARY KEY (id),
        CONSTRAINT username_uq UNIQUE (username)
    );
    
    CREATE TABLE role (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        rolename varchar(100) NOT NULL,
        CONSTRAINT roles_pk PRIMARY KEY (id)
    );
    
    CREATE TABLE user_role (
        id_user integer NOT NULL,
        id_role integer NOT NULL,
        CONSTRAINT user_role_pk PRIMARY KEY (id_user,id_role)
    );
    
    ALTER TABLE user_role ADD CONSTRAINT user_fk FOREIGN KEY (id_user)
    REFERENCES "user" (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE user_role ADD CONSTRAINT role_fk FOREIGN KEY (id_role)
    REFERENCES role (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    CREATE TABLE person (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        firstname varchar(100) NOT NULL,
        p_lastname varchar(100) NOT NULL,
        m_lastname varchar(100) NOT NULL,
        dni char(8) NOT NULL,
        birthdate date NOT NULL,
        email varchar(100) NOT NULL,
        phone_number char(10),
        mobile_number char(12),
        id_civil_status integer NOT NULL,
        id_instruction integer NOT NULL,
        id_gender integer NOT NULL,
        CONSTRAINT persons_pk PRIMARY KEY (id),
        CONSTRAINT dni_uq UNIQUE (dni),
        CONSTRAINT email_uq UNIQUE (email)
    );
    
    CREATE TABLE address (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        id_ubigeo integer NOT NULL,
        id_address_type integer NOT NULL,
        CONSTRAINT addresses_pk PRIMARY KEY (id)
    );
    
    CREATE TABLE address_type (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        name varchar NOT NULL,
        CONSTRAINT address_types_pk PRIMARY KEY (id),
        CONSTRAINT address_types_name_uq UNIQUE (name)
    );
    
    CREATE TABLE ubigeo (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        country varchar(50) NOT NULL,
        department varchar(50) NOT NULL,
        province varchar(50) NOT NULL,
        district varchar(50) NOT NULL,
        country_code char(2) NOT NULL,
        department_code char(2) NOT NULL,
        province_code char(2) NOT NULL,
        district_code char(2) NOT NULL,
        code char(6) GENERATED ALWAYS AS (department_code || province_code||district_code) STORED,
        CONSTRAINT ubigeo_pk PRIMARY KEY (id)
    );
    
    ALTER TABLE address ADD CONSTRAINT ubigeo_fk FOREIGN KEY (id_ubigeo)
    REFERENCES ubigeo (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE address ADD CONSTRAINT address_type_fk FOREIGN KEY (id_address_type)
    REFERENCES address_type (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    CREATE TABLE person_address (
        id_person integer NOT NULL,
        id_address integer NOT NULL,
        CONSTRAINT person_address_pk PRIMARY KEY (id_person,id_address)
    );
    
    ALTER TABLE person_address ADD CONSTRAINT person_fk FOREIGN KEY (id_person)
    REFERENCES person (id) MATCH FULL
    ON DELETE CASCADE ON UPDATE CASCADE;
    
    ALTER TABLE person_address ADD CONSTRAINT address_fk FOREIGN KEY (id_address)
    REFERENCES address (id) MATCH FULL
    ON DELETE CASCADE ON UPDATE CASCADE;
    
    CREATE TABLE civil_status (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        name varchar(20) NOT NULL,
        abbrev_name char(1) NOT NULL,
        CONSTRAINT civil_status_pk PRIMARY KEY (id),
        CONSTRAINT civil_status_name_uq UNIQUE (name)
    );
    
    ALTER TABLE person ADD CONSTRAINT civil_status_fk FOREIGN KEY (id_civil_status)
    REFERENCES civil_status (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    CREATE TABLE instruction (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        name varchar(50) NOT NULL,
        CONSTRAINT instruction_pk PRIMARY KEY (id),
        CONSTRAINT instruction_name_uq UNIQUE (name)
    );
    
    ALTER TABLE person ADD CONSTRAINT instruction_fk FOREIGN KEY (id_instruction)
    REFERENCES instruction (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    CREATE TABLE gender (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        name varchar(20) NOT NULL,
        abbrev_name char(1) NOT NULL,
        CONSTRAINT gender_pk PRIMARY KEY (id),
        CONSTRAINT gender_name_uq UNIQUE (name)
    );
    
    ALTER TABLE person ADD CONSTRAINT gender_fk FOREIGN KEY (id_gender)
    REFERENCES gender (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    CREATE TABLE employee (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        affiliation_date date NOT NULL,
        disaffiliation_date date NOT NULL,
        id_jobtittle integer NOT NULL,
        id_user integer NOT NULL,
        id_person integer NOT NULL,
        CONSTRAINT employee_pk PRIMARY KEY (id)
    );
    
    CREATE TABLE department (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
        name varchar(100) NOT NULL,
        CONSTRAINT department_pk PRIMARY KEY (id),
        CONSTRAINT department_name_uq UNIQUE (name)
    );
    
    CREATE TABLE employee_department (
        id_employee integer NOT NULL,
        id_department integer NOT NULL,
        CONSTRAINT employee_department_pk PRIMARY KEY (id_employee,id_department)
    );
    
    ALTER TABLE employee_department ADD CONSTRAINT employee_fk FOREIGN KEY (id_employee)
    REFERENCES employee (id) MATCH FULL
    ON DELETE CASCADE ON UPDATE CASCADE;
    
    ALTER TABLE employee_department ADD CONSTRAINT department_fk FOREIGN KEY (id_department)
    REFERENCES department (id) MATCH FULL
    ON DELETE CASCADE ON UPDATE CASCADE;
    
    CREATE TABLE jobtittle (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        name varchar(100) NOT NULL,
        description varchar(500) NOT NULL,
        CONSTRAINT jobtittle_pk PRIMARY KEY (id),
        CONSTRAINT jobtittle_name_uq UNIQUE (name)
    );
    
    ALTER TABLE employee ADD CONSTRAINT jobtittle_fk FOREIGN KEY (id_jobtittle)
    REFERENCES jobtittle (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE employee ADD CONSTRAINT user_fk FOREIGN KEY (id_user)
    REFERENCES "user" (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE employee ADD CONSTRAINT employee_uq UNIQUE (id_user);
    
    ALTER TABLE employee ADD CONSTRAINT person_fk FOREIGN KEY (id_person)
    REFERENCES person (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE employee ADD CONSTRAINT employee_uq1 UNIQUE (id_person);
    
    CREATE TABLE producer (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT BY 1 MINVALUE 0 MAXVALUE 2147483647 START WITH 1 CACHE 1 ),
        code char(8) NOT NULL,
        enrollment date NOT NULL,
        disenrollment date,
        create_user integer NOT NULL,
        create_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_user integer NOT NULL,
        update_date timestamp NOT NULL,
        situation boolean NOT NULL DEFAULT TRUE,
        id_person integer NOT NULL,
        CONSTRAINT producer_pk PRIMARY KEY (id),
        CONSTRAINT producer_code_uq UNIQUE (code)
    );
    
    ALTER TABLE producer ADD CONSTRAINT person_fk FOREIGN KEY (id_person)
    REFERENCES person (id) MATCH FULL
    ON DELETE RESTRICT ON UPDATE CASCADE;
    
    ALTER TABLE producer ADD CONSTRAINT producer_uq UNIQUE (id_person);

    `);
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw(`
        ROLLBACK;
    `);
}

