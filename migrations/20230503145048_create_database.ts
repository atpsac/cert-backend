import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
    
    

    `);
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw(`
        ROLLBACK;
    `);
}

