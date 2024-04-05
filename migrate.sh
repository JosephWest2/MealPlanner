echo "enter the name of the migration"
read migrationName

prisma migrate dev --name $migrationName