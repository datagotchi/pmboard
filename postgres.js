const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "p4ssw0rd",
  database: "pmboard",
  host: "localhost",
  port: 5432,
});

const main = async () => {
  const client = await pool.connect();
  const json = JSON.parse(
    fs.readFileSync("./dump/pmboard/pmboard.products.json")
  );
  await Promise.all(
    json.map(async (product) => {
      const productObject = await client
        .query({
          text: `insert into products (name) values ($1::text) returning *`,
          values: [product.name],
        })
        .then((result) => result.rows[0]);
      console.log("*** product added: ", productObject);
      await Promise.all(
        product.personas.map(async (persona) => {
          const personaObject = await client
            .query({
              text: `insert into personas (name, product_id) values ($1::text, $2::integer) returning *`,
              values: [persona.name, Number(productObject.id)],
            })
            .then((result) => result.rows[0]);
          console.log("*** persona added: ", personaObject);
          await Promise.all(
            persona.evidence.map(async (file) => {
              console.log(
                "*** about to add file with persona ID: ",
                personaObject.id
              );
              const fileObject = await client
                .query({
                  text: `insert into evidence 
          (name, url, icon, persona_id, created_date, modified_date) 
          values ($1::text, $2::text, $3::text, $4::integer, $5::date, $6::date) 
          returning *`,
                  values: [
                    file.name,
                    file.url,
                    file.icon,
                    Number(personaObject.id),
                    file.createdDate ? file.createdDate["$date"] : null,
                    file.modifiedDate ? file.modifiedDate["$date"] : null,
                  ],
                })
                .then((result) => result.rows[0]);
              console.log("*** evidence added: ", fileObject);
              await Promise.all(
                file.trends.map(async (trend) => {
                  await client.query({
                    text: `insert into trends (name, type, evidence_id)
                  values ($1::text, $2::text, $3::integer)`,
                    values: [trend.name, trend.type, Number(fileObject.id)],
                  });
                  console.log("*** trend added: ", trend.name);
                })
              );
            })
          );
        })
      );
      console.log("** personas done");
      // foreach companies...
      await Promise.all(
        product.companies.map(async (company) => {
          const companyObject = await client.query({
            text: `insert into companies (name, product_id) values ($1::text, $2::integer) returning *`,
            values: [company.name, Number(productObject.id)],
          });
          // await Promise.all(
          //   company.evidence.map(async (file) => {
          //     const fileObject = await client.query(`insert into evidence
          // (name, url, icon, persona_id, created_date, modified_date)
          // values (${file.name}, ${file.url}, ${file.icon}, ${companyObject.id}, ${file.createdDate}, ${file.modifiedDate})
          // returning *`);
          //     await Promise.all(file.trends.map(async (trend) => {
          //       // add to `trends`: name, type,
          //       await client.query(`insert into trends (name, type, evidence_id)
          //         values (${trend.name}, ${trend.type}, ${fileObject.id})`);
          //     }));
          //   })
          // );
        })
      );
      console.log("** companies done");
      // foreach stories...
      await Promise.all(
        product.stories.map(async (story) => {
          const storyObject = await client
            .query({
              text: `insert into stories (name, product_id) values ($1::text, $2::integer) returning *`,
              values: [story.name, Number(productObject.id)],
            })
            .then((result) => result.rows[0]);
          await Promise.all(
            story.evidence.map(async (personaAsEvidence) => {
              const paeObject = await client
                .query({
                  text: `insert into evidence 
                (name, story_id, created_date, modified_date) 
                values ($1::text, $2::integer, $3::date, $4::date) 
                returning *`,
                  values: [
                    personaAsEvidence.name,
                    Number(storyObject.id),
                    personaAsEvidence.createdDate,
                    personaAsEvidence.modifiedDate,
                  ],
                })
                .then((result) => result.rows[0]);
              await Promise.all(
                personaAsEvidence.trends.map(async (trend) => {
                  await client.query({
                    text: `insert into trends (name, type, evidence_id)
                  values ($1::text, $2::text, $3::integer)`,
                    values: [trend.name, trend.type, Number(paeObject.id)],
                  });
                })
              );
            })
          );
        })
      );
      console.log("** stories done");
      // foreach tasks...
      await Promise.all(
        product.tasks.map(async (task) => {
          const taskObject = await client.query({
            text: `insert into tasks (name, product_id) values ($1::text, $2::integer) returning *`,
            values: [task.name, Number(productObject.id)],
          });
          console.log("*** task added: ", taskObject);
          // await Promise.all(
          //   task.evidence.map(async (file) => {
          //     const fileObject = await client.query(`insert into evidence
          // (name, url, icon, persona_id, created_date, modified_date)
          // values (${file.name}, ${file.url}, ${file.icon}, ${taskObject.id}, ${file.createdDate}, ${file.modifiedDate})
          // returning *`);
          //     await Promise.all(file.trends.map(async (trend) => {
          //       // add to `trends`: name, type,
          //       await client.query(`insert into trends (name, type, evidence_id)
          //         values (${trend.name}, ${trend.type}, ${fileObject.id})`);
          //     }));
          //   })
          // );
        })
      );
    })
  );
};

main();
