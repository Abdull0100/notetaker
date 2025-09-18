import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

//GET request to fetch all users
export async function GET(){
    const allUsers = await db.select().from(user);
    return new Response(JSON.stringify(allUsers), {status: 200});
}

export async function POST({request}){
    const body = await request.json();

    const [newUser] = await db
    .insert(user)
    .values({
        id: crypto.randomUUID(),
        email: body.email,
        name: body.name
    })
    .returning()

    //status 201 is "user created"
    return new Response(JSON.stringify(newUser), {status: 201});
}