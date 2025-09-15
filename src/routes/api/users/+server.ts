import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

//GET request to fetch all users
export async function GET(){
    const allUsers = await db.select().from(users);
    return new Response(JSON.stringify(allUsers), {status: 200});
}

export async function POST({request}){
    const body = await request.json();

    const [user] = await db
    .insert(users)
    .values({
        email: body.email,
        name: body.name
    })
    .returning()

    //status 201 is "user created"
    return new Response(JSON.stringify(user), {status: 201});
}