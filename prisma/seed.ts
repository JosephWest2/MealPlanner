import { prisma } from "@/lib/prismaSingleton";
import { hash } from "bcrypt";

async function main() {
    const password = await hash("test", 12);
    const user = await prisma.user.upsert(
        {
            where: {
                email: "test@test.com"
            },
            update: {},
            create: {
                email: "test@test.com",
                name: "test",
                password: password
            }
        }
    )
    console.log(user);
}

main()
.then(() => prisma.$disconnect())
.catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});