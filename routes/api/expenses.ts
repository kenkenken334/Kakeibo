import {defineHandler} from "void";
import {db} from "void/db";
import {expenses} from "../../db/schema";
import { requireAuth } from "void/auth";
import { eq } from "void/db";

//支出一覧を取得
export const GET = defineHandler(async (c) => {
    const user = requireAuth(c);
    return db.select().from(expenses).where(eq(expenses.userId, user.id)).all();
})

//支出を一件保存
export const POST = defineHandler(async (request) => {
    const user = requireAuth(request);
    const body = await request.req.json();

    //保存するデータがテーブルに一致しない場合はerrorを返す
    if(
        !body || !Number.isSafeInteger(body.amount) || body.amount <= 0 || typeof body.memo != "string" || body.memo.length > 200
    ){
        return request.json({error: "金額とメモを確認してください"}, 400);
    }

    await db.insert(expenses).values({
        userId: user.id,
        amount: body.amount,
        memo: body.memo.trim(),
    }).run();

    return {success:true};
})

