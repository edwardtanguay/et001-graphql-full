import * as model from './model.js';
import express from 'express';
import cors from 'cors';
import * as config from './config.js';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema.js';

const app = express();
app.use(cors());

// GRAPHQL

const root = {
	message: () => {
		return 'this is the message';
	},
	departments: [
		"Sales",
		"Marketing",
		"Executive",
		"Development"
	],
	jobs: model.getJobs(),
	skills: model.getSkills()
};

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);


// REST

app.get('/', (req: express.Request, res: express.Response) => {
	res.send(model.getApiInstructions());
});

app.get('/jobs', (req: express.Request, res: express.Response) => {
	res.json(model.getJobs());
});

app.get('/skills', (req: express.Request, res: express.Response) => {
	res.json(model.getSkills());
});

app.get('/jobs/:id', (req: express.Request, res: express.Response) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		res.status(400).send({
			error: true,
			message: "sent string, should be number"
		});
	} else {
		const job = model.getJob(id);
		if (job === undefined) {
			res.status(404).send({
				error: true,
				message: "id did not correspond to an existing item"
			});
		} else {
			res.json(job);
		}
	}
});

app.get('/skills/:idCode', (req: express.Request, res: express.Response) => {
	const idCode = req.params.idCode;
	const skill = model.getSkill(idCode);
	if (skill === undefined) {
		res.status(404).send({
			error: true,
			message: "idCode did not correspond to an existing item"
		});
	} else {
		res.json(skill);
	}
});

app.listen(config.port, () => {
	console.log(`listening on port http://localhost:${config.port}`);
});